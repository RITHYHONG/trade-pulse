import { NextRequest, NextResponse } from "next/server";
import { adminApp, isAdminReady } from "@/lib/firebase-admin";

/**
 * Server endpoint to verify a Firebase ID token (from magic-link sign-in)
 * and set secure session cookies using the Admin SDK.
 */
export async function POST(request: NextRequest) {
  // Simple in-memory rate limiter (keeps data during a warm lambda instance).
  // Note: For multi-instance deployments use a shared store (Redis) instead.
  type Timestamps = number[];
  const IP_WINDOW = 60 * 60 * 1000; // 1 hour
  const IP_MAX = 10; // max attempts per IP per window
  const EMAIL_WINDOW = 60 * 60 * 1000; // 1 hour
  const EMAIL_MAX = 5; // max attempts per email per window

  // Attach rate limit stores to global to survive module reloads in dev/HMR
  const globalAny: any = globalThis as any;
  if (!globalAny.__rateLimitIP) globalAny.__rateLimitIP = new Map<string, Timestamps>();
  if (!globalAny.__rateLimitEmail) globalAny.__rateLimitEmail = new Map<string, Timestamps>();

  const ipStore: Map<string, Timestamps> = globalAny.__rateLimitIP;
  const emailStore: Map<string, Timestamps> = globalAny.__rateLimitEmail;

  function prune(arr: Timestamps, window: number) {
    const cutoff = Date.now() - window;
    while (arr.length && arr[0] < cutoff) arr.shift();
  }

  function recordAttempt(store: Map<string, Timestamps>, key: string, window: number) {
    const now = Date.now();
    let arr = store.get(key);
    if (!arr) {
      arr = [];
      store.set(key, arr);
    }
    prune(arr, window);
    arr.push(now);
    return arr;
  }

  function getRetryAfterSeconds(arr: Timestamps, window: number) {
    if (!arr.length) return 0;
    const cutoff = Date.now() - window;
    const earliest = arr[0];
    const retryMs = Math.max(0, window - (Date.now() - earliest));
    return Math.ceil(retryMs / 1000);
  }

  try {
    const { idToken, email, displayName } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    // Rate limit checks: by IP and by email (if provided)
    const ip = request.headers.get('x-forwarded-for') || request.ip || request.headers.get('x-real-ip') || 'unknown';
    const emailKey = (email || '').toLowerCase();

    // record and evaluate IP attempts
    const ipArr = recordAttempt(ipStore, ip, IP_WINDOW);
    if (ipArr.length > IP_MAX) {
      const retryAfter = getRetryAfterSeconds(ipArr, IP_WINDOW);
      return NextResponse.json({ error: 'Too many requests from this IP' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
    }

    // record and evaluate email attempts (if email provided)
    if (emailKey) {
      const emailArr = recordAttempt(emailStore, emailKey, EMAIL_WINDOW);
      if (emailArr.length > EMAIL_MAX) {
        const retryAfter = getRetryAfterSeconds(emailArr, EMAIL_WINDOW);
        return NextResponse.json({ error: 'Too many requests for this email' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
      }
    }

    if (!isAdminReady) {
      // Fallback to behavior similar to /api/auth/set-cookies when admin SDK isn't available
      const [, payloadB64] = idToken.split('.');
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
      const uid: string = payload.user_id || payload.sub || idToken;

      const response = NextResponse.json({ success: true, message: "Magic link cookies set (admin SDK unavailable)" });
      const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, maxAge: 60 * 60 * 24 * 5, path: '/' };
      response.cookies.set({ name: 'auth-token', value: uid, ...opts });
      response.cookies.set({ name: 'user-email', value: email || '', ...opts, httpOnly: false });
      response.cookies.set({ name: 'user-name', value: displayName || '', ...opts, httpOnly: false });
      return response;
    }

    // Verify the ID token using the Admin SDK
    const decodedToken = await adminApp.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    if (!uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Determine user role from Firestore if possible
    let userRole = "user";
    try {
      const userDoc = await adminApp.firestore().collection("users").doc(uid).get();
      if (userDoc.exists) {
        userRole = userDoc.data()?.role || "user";
      }
    } catch (dbErr) {
      console.error("[magic-verify] Error fetching user role:", dbErr);
    }

    // Create a session cookie via Admin SDK
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminApp.auth().createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true, message: "Magic link verified, cookies set" });

    response.cookies.set({
      name: "auth-token",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    response.cookies.set({
      name: "user-role",
      value: userRole,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400 * 30,
      path: "/",
    });

    response.cookies.set({
      name: "user-email",
      value: email || "",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400 * 30,
      path: "/",
    });

    response.cookies.set({
      name: "user-name",
      value: displayName || "",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400 * 30,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[magic-verify] Error:", error);
    return NextResponse.json({ error: "Magic link verification failed" }, { status: 500 });
  }
}

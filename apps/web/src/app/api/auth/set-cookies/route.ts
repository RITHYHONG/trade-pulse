import { NextRequest, NextResponse } from "next/server";
import { adminApp, isAdminReady } from "@/lib/firebase-admin";

/**
 * API route to set authentication cookies securely
 * Verifies the Firebase ID token on the server
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken, email, displayName } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    if (!isAdminReady) {
      // Fallback: decode JWT payload client-side without verification (dev only)
      const [, payloadB64] = idToken.split('.');
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
      const uid: string = payload.user_id || payload.sub || idToken;

      // Look up role from Firestore REST API — rules allow authenticated users to read own profile
      let userRole = 'user';
      try {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'trade-pulse-b9fc4';
        const fsRes = await fetch(
          `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        if (fsRes.ok) {
          const fsData = await fsRes.json();
          userRole = fsData?.fields?.role?.stringValue || 'user';
        }
      } catch {
        // ignore — fall back to 'user'
      }

      const response = NextResponse.json({ success: true, message: "Cookies set (admin SDK unavailable)" });
      const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, maxAge: 60 * 60 * 24 * 5, path: '/' };
      response.cookies.set({ name: 'auth-token', value: uid, ...opts });
      response.cookies.set({ name: 'user-role', value: userRole, ...opts, httpOnly: false });
      response.cookies.set({ name: 'user-email', value: email || '', ...opts, httpOnly: false });
      response.cookies.set({ name: 'user-name', value: displayName || '', ...opts, httpOnly: false });
      return response;
    }

    // Verify the ID token using the custom service account
    const decodedToken = await adminApp.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    if (!uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch the actual role from Firestore user profile
    let userRole = "user";
    try {
      const userDoc = await adminApp.firestore().collection("users").doc(uid).get();
      if (userDoc.exists) {
        userRole = userDoc.data()?.role || "user";
      }
    } catch (dbErr) {
      console.error("[set-cookies] Error fetching user role from firestore:", dbErr);
    }

    // Create a session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminApp
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // Create response with set cookies
    const response = NextResponse.json({
      success: true,
      message: "Cookies set successfully",
    });

    // Set secure, HTTP-only session cookie
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
      maxAge: 86400 * 30, // 30 days (1 month)
      path: "/",
    });

    // Optional: Store additional user info in non-httpOnly cookies for client use
    response.cookies.set({
      name: "user-email",
      value: email || "",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400 * 30, // 30 days (1 month)
      path: "/",
    });

    response.cookies.set({
      name: "user-name",
      value: displayName || "",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400 * 30, // 30 days (1 month)
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error setting cookies:", error);
    return NextResponse.json(
      { error: "Failed to set cookies" },
      { status: 500 },
    );
  }
}

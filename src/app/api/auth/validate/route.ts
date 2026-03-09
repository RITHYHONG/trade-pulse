import { NextRequest, NextResponse } from "next/server";
import { adminApp, isAdminReady } from "@/lib/firebase-admin";

/**
 * API route to validate current session and refresh cookies if needed
 * This helps maintain consistency between Firebase auth and middleware cookies
 */
export async function POST(request: NextRequest) {
  // Guard: Admin SDK requires service account credentials in env vars.
  // Set FIREBASE_SERVICE_ACCOUNT (JSON string) or the three FIREBASE_ADMIN_* vars.
  if (!isAdminReady) {
    console.error(
      "[auth/validate] Firebase Admin SDK not initialized. " +
      "Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_ADMIN_PROJECT_ID + " +
      "FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY."
    );

    // Fallback: set the auth-token cookie from the raw idToken body so the
    // middleware can at least unblock navigation (uid extracted client-side).
    try {
      const body = await request.json();
      const { idToken, email, displayName } = body || {};
      if (idToken) {
        // We can't verify without admin SDK, so we decode the JWT payload naively.
        // This is NOT secure — only a stop-gap until credentials are configured.
        const [, payloadB64] = idToken.split('.');
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
        const uid: string = payload.user_id || payload.sub || idToken;

        const response = NextResponse.json({
          success: true,
          valid: true,
          refreshed: true,
          message: "Session set (admin SDK unavailable — credentials not configured)",
        });
        const cookieOpts = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict" as const,
          maxAge: 60 * 60 * 24 * 5,
          path: "/",
        };
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

        response.cookies.set({ name: "auth-token", value: uid, ...cookieOpts });
        response.cookies.set({ name: "user-role", value: userRole, ...cookieOpts, httpOnly: false });
        response.cookies.set({ name: "user-email", value: email || "", ...cookieOpts, httpOnly: false });
        response.cookies.set({ name: "user-name", value: displayName || "", ...cookieOpts, httpOnly: false });
        return response;
      }
    } catch {
      // ignore
    }

    return NextResponse.json(
      {
        error: "Firebase Admin SDK not configured. Add FIREBASE_SERVICE_ACCOUNT to environment variables.",
        valid: false,
      },
      { status: 503 },
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body", valid: false },
        { status: 400 },
      );
    }
    const { idToken, email, displayName } = body || {};

    if (!idToken) {
      return NextResponse.json(
        { error: "Missing idToken", valid: false },
        { status: 400 },
      );
    }

    // Verify the ID token
    const decodedToken = await adminApp.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    if (!uid) {
      return NextResponse.json(
        { error: "Invalid token", valid: false },
        { status: 401 },
      );
    }

    // Check if auth cookies exist and are valid
    const authToken = request.cookies.get("auth-token")?.value;

    // If cookies are missing or don't match, refresh them
    if (!authToken || authToken !== uid) {
      // Fetch user role from Firestore
      let userRole = "user";
      try {
        const userDoc = await adminApp.firestore().collection("users").doc(uid).get();
        if (userDoc.exists) {
          userRole = userDoc.data()?.role || "user";
        }
      } catch (dbErr) {
        console.error("[validate] Error fetching user role from firestore:", dbErr);
      }

      // Create a new session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await adminApp
        .auth()
        .createSessionCookie(idToken, { expiresIn });

      const response = NextResponse.json({
        success: true,
        valid: true,
        refreshed: true,
        message: "Session validated and cookies refreshed",
      });

      // Set fresh session cookie
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
    }

    // Cookies are valid
    return NextResponse.json({
      success: true,
      valid: true,
      refreshed: false,
      message: "Session is valid",
    });
  } catch (error) {
    console.error("Error validating session:", error);
    return NextResponse.json(
      { error: "Failed to validate session", valid: false },
      { status: 500 },
    );
  }
}

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
      // Admin SDK is unavailable — refuse to set auth cookies rather than
      // accepting an unverified token. This prevents privilege escalation.
      console.error("[set-cookies] Firebase Admin SDK not initialised — rejecting request.");
      return NextResponse.json(
        { error: "Auth service temporarily unavailable. Please try again." },
        { status: 503 },
      );
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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400 * 30, // 30 days
      path: "/",
    });

    response.cookies.set({
      name: "user-name",
      value: displayName || "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400 * 30, // 30 days
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

import { NextRequest, NextResponse } from "next/server";
import { adminApp } from "@/lib/firebase-admin";

/**
 * API route to validate current session and refresh cookies if needed
 * This helps maintain consistency between Firebase auth and middleware cookies
 */
export async function POST(request: NextRequest) {
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
      const userRole = "user"; // TODO: Fetch from Firestore user profile if needed

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

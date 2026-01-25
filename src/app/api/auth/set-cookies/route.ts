import { NextRequest, NextResponse } from "next/server";
import { adminApp } from "@/lib/firebase-admin";

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

    // Verify the ID token using the custom service account
    const decodedToken = await adminApp.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    if (!uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Default role is 'user' - you can add logic here to fetch actual role from database
    const userRole = "user"; // TODO: Fetch from Firestore user profile

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

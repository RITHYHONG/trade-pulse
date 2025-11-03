import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to validate current session and refresh cookies if needed
 * This helps maintain consistency between Firebase auth and middleware cookies
 */
export async function POST(request: NextRequest) {
  try {
    const { uid, email, displayName } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'Missing uid', valid: false },
        { status: 400 }
      );
    }

    // Check if auth cookies exist and are valid
    const authToken = request.cookies.get('auth-token')?.value;
    
    // If cookies are missing or don't match, refresh them
    if (!authToken || authToken !== uid) {
      const userRole = 'user'; // TODO: Fetch from Firestore user profile if needed

      const response = NextResponse.json({ 
        success: true,
        valid: true,
        refreshed: true,
        message: 'Session validated and cookies refreshed'
      });

      // Set fresh cookies with 1 month expiration
      response.cookies.set({
        name: 'auth-token',
        value: uid,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 * 30, // 30 days (1 month)
        path: '/',
      });

      response.cookies.set({
        name: 'user-role',
        value: userRole,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 * 30, // 30 days (1 month)
        path: '/',
      });

      response.cookies.set({
        name: 'user-email',
        value: email || '',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 * 30, // 30 days (1 month)
        path: '/',
      });

      response.cookies.set({
        name: 'user-name',
        value: displayName || '',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 * 30, // 30 days (1 month)
        path: '/',
      });

      return response;
    }

    // Cookies are valid
    return NextResponse.json({ 
      success: true,
      valid: true,
      refreshed: false,
      message: 'Session is valid'
    });

  } catch (error) {
    console.error('Error validating session:', error);
    return NextResponse.json(
      { error: 'Failed to validate session', valid: false },
      { status: 500 }
    );
  }
}
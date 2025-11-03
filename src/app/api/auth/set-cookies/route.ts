import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to set authentication cookies securely
 * Called after successful Firebase authentication
 */
export async function POST(request: NextRequest) {
  try {
    const { uid, email, displayName } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: 'Missing uid' },
        { status: 400 }
      );
    }

    // Default role is 'user' - you can add logic here to fetch actual role from database
    const userRole = 'user'; // TODO: Fetch from Firestore user profile

    // Create response with set cookies
    const response = NextResponse.json({ 
      success: true,
      message: 'Cookies set successfully'
    });

    // Set secure, HTTP-only cookies with 1 month expiration
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

    // Optional: Store additional user info in non-httpOnly cookies for client use
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
  } catch (error) {
    console.error('Error setting cookies:', error);
    return NextResponse.json(
      { error: 'Failed to set cookies' },
      { status: 500 }
    );
  }
}

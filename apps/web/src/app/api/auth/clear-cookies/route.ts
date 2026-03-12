import { NextResponse } from 'next/server';

/**
 * API route to clear authentication cookies on sign out
 */
export async function POST() {
  const response = NextResponse.json({ 
    success: true,
    message: 'Cookies cleared successfully'
  });

  // Clear all auth-related cookies
  response.cookies.set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  response.cookies.set({
    name: 'user-role',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  response.cookies.set({
    name: 'user-email',
    value: '',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  response.cookies.set({
    name: 'user-name',
    value: '',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
}

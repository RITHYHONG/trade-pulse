import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const userRole = request.cookies.get("user-role")?.value;

  // Debug log (remove in production)
  console.log(`[Middleware] Path: ${pathname}, Token: ${token ? 'present' : 'missing'}, Role: ${userRole || 'none'}`);

  // Protected routes - require authentication
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/app") || pathname.startsWith("/create-post") || pathname.startsWith("/settings")) {
    if (!token) {
      // Add a flag to indicate potential session mismatch for client-side handling
      const response = NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}&reason=session_expired`, request.url));
      return response;
    }
  }

  // Admin routes - require admin role
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}&reason=session_expired`, request.url));
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Add security headers for better protection
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Add CSP header for better security
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com https://firebasestorage.googleapis.com;"
  );

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*", 
    "/app/:path*",
    "/create-post",
    "/login",
    "/signup",
    "/settings/:path*"
  ],
};
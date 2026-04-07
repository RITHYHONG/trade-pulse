import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const cookieRole = request.cookies.get("user-role")?.value;

  // Protected routes - require authentication
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/app") ||
    pathname.startsWith("/create-post") ||
    pathname.startsWith("/settings")
  ) {
    if (!token) {
      const response = NextResponse.redirect(
        new URL(
          `/login?redirect=${encodeURIComponent(pathname)}&reason=session_expired`,
          request.url,
        ),
      );
      return response;
    }
  }

  // Admin routes - require admin role. Verify server-side via API to avoid importing
  // server-only modules into the Edge runtime.
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(
          `/login?redirect=${encodeURIComponent(pathname)}&reason=session_expired`,
          request.url,
        ),
      );
    }

    // Call an internal server API that performs Admin SDK verification.
    try {
      const cookieHeader = request.headers.get("cookie") || "";
      const verifyUrl = new URL("/api/admin/verify-session", request.url).toString();
      const res = await fetch(verifyUrl, { headers: { cookie: cookieHeader } });
      if (!res.ok) {
        // If verification endpoint is unavailable or token invalid, redirect to login
        return NextResponse.redirect(
          new URL(`/login?redirect=${encodeURIComponent(pathname)}&reason=session_invalid`, request.url),
        );
      }
      const data = await res.json();
      if (data?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (err) {
      console.warn("[middleware] verify-session call failed:", err);
      // Fallback to cookie role for dev convenience
      if (cookieRole !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // Redirect authenticated users away from auth pages
  const force = request.nextUrl.searchParams.get("force") === "true";
  if (token && !force && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Add security headers
  const response = NextResponse.next();

  // Add security headers for better protection
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Add CSP header for better security
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://securetoken.googleapis.com https://www.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com https://firebasestorage.googleapis.com https://accounts.google.com; frame-src 'self' https://accounts.google.com https://content.googleapis.com;",
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
    "/app/:path*",
    "/create-post",
    "/login",
    "/signup",
    "/settings/:path*",
  ],
};

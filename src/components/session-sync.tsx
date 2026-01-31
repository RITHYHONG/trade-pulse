"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';

/**
 * Session sync component that handles authentication state mismatches
 * between Firebase Auth and middleware cookies
 */
export function SessionSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    const reason = searchParams.get('reason');
    const pathname = window.location.pathname;
    const isProtectedRoute = pathname.startsWith('/dashboard') ||
      pathname.startsWith('/app') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/create-post');

    // Handle session mismatch on protected routes
    if (isProtectedRoute && !user && !loading) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[SessionSync] Protected route access without user, clearing cookies...');
      }
      fetch('/api/auth/clear-cookies', { method: 'POST' })
        .finally(() => {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}&reason=session_mismatch`);
        });
      return;
    }

    // Handle session expiration
    if (reason === 'session_expired' && !loading) {
      if (user) {
        // Firebase auth is still valid, refresh the session
        fetch('/api/auth/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success && data.valid) {
              // Session refreshed, redirect to original destination
              const redirect = searchParams.get('redirect');
              router.replace(redirect || '/dashboard');
            }
          })
          .catch(error => {
            console.error('Session refresh failed:', error);
            // Force sign out and redirect to login
            router.replace('/login');
          });
      }
    }
  }, [user, loading, searchParams, router]);

  return null; // This component doesn't render anything
}
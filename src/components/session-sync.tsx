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
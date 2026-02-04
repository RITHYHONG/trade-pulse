'use client';

import { useEffect } from 'react';
import { useAuth } from '../hooks/use-auth';
import { sessionValidateResponseSchema } from '@/lib/validations';
import { auth } from '@/lib/firebase';

/**
 * Global session manager that ensures auth state consistency
 * Should be included in the app layout to handle session synchronization
 */
export function SessionManager() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Only run on client side after initial load
    if (typeof window === 'undefined' || loading) return;

    // Set up periodic session validation for authenticated users
    if (user) {
      const validateSession = async () => {
        try {
          // Get fresh ID token
          const idToken = await auth.currentUser?.getIdToken();

          if (!idToken) {
            console.warn('Session validation skipped: No ID token available');
            return;
          }

          const response = await fetch('/api/auth/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idToken,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            }),
          });

          const data = await response.json();
          const validatedData = sessionValidateResponseSchema.parse(data);

          if (!validatedData.valid) {
            // Session is invalid, force a page reload to trigger middleware
            window.location.reload();
          }
        } catch (error) {
          // Session validation failed, but don't log sensitive error details
          // In development, you might want to log for debugging
          if (process.env.NODE_ENV === 'development') {
            console.error('Session validation error:', error);
          }
        }
      };

      // Validate session immediately
      validateSession();

      // Set up periodic validation (every 5 minutes)
      const interval = setInterval(validateSession, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user, loading]);

  return null; // This component doesn't render anything
}
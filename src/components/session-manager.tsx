'use client';

import { useEffect } from 'react';
import { useAuth } from '../hooks/use-auth';

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
          const response = await fetch('/api/auth/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            }),
          });
          
          const data = await response.json();
          
          if (!data.valid) {
            // Session is invalid, force a page reload to trigger middleware
            window.location.reload();
          }
        } catch (error) {
          console.error('Session validation error:', error);
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
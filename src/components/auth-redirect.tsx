"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface AuthRedirectProps {
  authenticatedPath?: string;
  redirectAuthenticated?: boolean;
}

export function AuthRedirect({
  authenticatedPath = '/dashboard',
  redirectAuthenticated = true
}: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;

    // Wait until auth initialization completes
    if (loading) return;

    if (user && redirectAuthenticated) {
      // Logged in: try to restore last visited path, otherwise go to authenticated path
      let last = undefined;
      try {
        last = localStorage.getItem('last_visited_path') || undefined;
      } catch {
        // ignore storage errors
      }

      const safeLast = last && !['/', '/login', '/signup', '/'].includes(last) ? last : undefined;
      redirected.current = true;
      router.replace(safeLast || authenticatedPath);
    }
    // If not redirecting authenticated users, or user is not logged in, do nothing
  }, [user, loading, router, authenticatedPath, redirectAuthenticated]);

  return null; // nothing to render, we redirect immediately
}
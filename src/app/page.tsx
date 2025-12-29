"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;

    // Wait until auth initialization completes
    if (loading) return;

    if (user) {
      // Logged in: try to restore last visited path, otherwise go to /blog
      let last = undefined;
      try {
        last = localStorage.getItem('last_visited_path') || undefined;
      } catch {
        // ignore storage errors
      }

      const safeLast = last && !['/', '/login', '/signup', '/'].includes(last) ? last : undefined;
      redirected.current = true;
      router.replace(safeLast || '/blog');
    } else {
      // Not logged in: send to landing page
      redirected.current = true;
      router.replace('/');
    }
  }, [user, loading, router]);

  return null; // nothing to render, we redirect immediately
}


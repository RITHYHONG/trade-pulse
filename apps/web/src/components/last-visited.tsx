"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Tracks the last visited client-side path and stores it in localStorage
 * Excludes common auth and root pages.
 */
export function LastVisitedTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Don't track API or asset routes
    if (pathname.startsWith('/api') || pathname.startsWith('/_next')) return;

    // Exclude root and auth landing pages
    const excluded = ['/', '/login', '/signup', '/'];
    if (excluded.includes(pathname)) return;

    try {
      localStorage.setItem('last_visited_path', pathname);
    } catch (e) {
      // Ignore storage errors
      console.error('Failed to save last visited path:', e);
    }
  }, [pathname]);

  return null;
}

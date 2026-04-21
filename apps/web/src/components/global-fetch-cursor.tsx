'use client';

import { useEffect } from 'react';

const LOADING_CURSOR_CLASS = 'cursor-loading';
let originalFetch: typeof fetch | null = null;
let activeRequests = 0;

function updateBodyCursor(shouldShow: boolean) {
  const body = document.body;
  if (!body) return;

  if (shouldShow) {
    body.classList.add(LOADING_CURSOR_CLASS);
  } else {
    body.classList.remove(LOADING_CURSOR_CLASS);
  }
}

function shouldTrackFetch(input: RequestInfo | URL) {
  return true;
}

export function GlobalFetchCursor() {
  useEffect(() => {
    if (typeof window === 'undefined' || originalFetch) return;

    originalFetch = window.fetch.bind(window);

    const wrappedFetch: typeof fetch = async (...args) => {
      const track = shouldTrackFetch(args[0]);
      const fetchFn = originalFetch;

      if (track) {
        activeRequests += 1;
        updateBodyCursor(true);
      }

      try {
        if (!fetchFn) {
          throw new Error('fetch wrapper missing original fetch implementation');
        }
        return await fetchFn(...args);
      } finally {
        if (track) {
          activeRequests = Math.max(0, activeRequests - 1);
          if (activeRequests === 0) {
            updateBodyCursor(false);
          }
        }
      }
    };

    window.fetch = wrappedFetch;

    return () => {
      if (originalFetch) {
        window.fetch = originalFetch;
        originalFetch = null;
        activeRequests = 0;
        updateBodyCursor(false);
      }
    };
  }, []);

  return null;
}

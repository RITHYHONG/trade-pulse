import { useEffect } from 'react';

export type RecordViewOptions = {
  ttlHours?: number; // how long to avoid counting repeat views from same client
  requireConsent?: boolean; // if true, only record if analytics consent cookie is present
  cookieName?: string; // cookie name to check for consent
};

export async function recordView(postId: string, options?: RecordViewOptions) {
  if (typeof window === 'undefined') {
    console.log('[recordView] skipped: not in browser');
    return;
  }
  const { ttlHours = 1, requireConsent = false, cookieName = 'analytics_consent' } = options || {};

  console.log('[recordView] called for postId:', postId, 'options:', options);

  // If consent required, check for cookie
  if (requireConsent) {
    const cookies = document.cookie || '';
    if (!cookies.includes(cookieName)) {
      console.log('[recordView] skipped: consent required but not found');
      return;
    }
  }

  try {
    const key = `post_view_${postId}`;
    const last = localStorage.getItem(key);
    const now = Date.now();
    console.log('[recordView] TTL check - key:', key, 'last:', last, 'now:', now);
    
    if (last) {
      const lastTs = parseInt(last, 10);
      if (!Number.isNaN(lastTs)) {
        const diffHours = (now - lastTs) / (1000 * 60 * 60);
        console.log('[recordView] diffHours:', diffHours, 'ttlHours:', ttlHours);
        if (diffHours < ttlHours) {
          // skip duplicate view within TTL
          console.log('[recordView] skipped: within TTL window');
          return;
        }
      }
    }

    console.log('[recordView] fetching /api/blog/views with postId:', postId);
    const response = await fetch('/api/blog/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });

    console.log('[recordView] response status:', response.status);
    const data = await response.json();
    console.log('[recordView] response data:', data);

    localStorage.setItem(key, String(now));
    console.log('[recordView] success - saved timestamp to localStorage');
  } catch (err) {
    // swallow errors - view counting should not break the page
    console.error('[recordView] error:', err);
  }
}

export default function useRecordView(postId?: string, options?: RecordViewOptions) {
  useEffect(() => {
    if (!postId) return;
    recordView(postId, options);
  }, [postId, JSON.stringify(options)]);
}

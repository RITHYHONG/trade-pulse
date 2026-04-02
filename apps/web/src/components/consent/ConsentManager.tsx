"use client";

import { useEffect, useState } from 'react';

export interface ConsentPreferences {
  strictlyNecessary: boolean;
  performance: boolean;
  functionality: boolean;
  marketing: boolean;
  thirdParty: boolean;
}

const STORAGE_KEY = 'tradepulse_consent_v1';

export function useConsent() {
  const [consent, setConsent] = useState<ConsentPreferences>({
    strictlyNecessary: true,
    performance: false,
    functionality: false,
    marketing: false,
    thirdParty: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConsentPreferences;
        setConsent((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) {
      // ignore
    }
  }, [consent]);

  function acceptAll() {
    setConsent({
      strictlyNecessary: true,
      performance: true,
      functionality: true,
      marketing: true,
      thirdParty: true,
    });
  }

  function rejectNonEssential() {
    setConsent({
      strictlyNecessary: true,
      performance: false,
      functionality: false,
      marketing: false,
      thirdParty: false,
    });
  }

  return { consent, setConsent, acceptAll, rejectNonEssential } as const;
}

"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { dashboardStore } from "@/store/dashboard-store";
import { getUserProfile, updateUserPreferences } from "@/lib/firestore-service";

export function DashboardPreferencesSync() {
  const { user } = useAuth();
  const layout = dashboardStore((s) => s.layout);
  const setLayout = dashboardStore((s) => s.setLayout);
  const initialLoadedRef = useRef(false);
  const saveTimeoutRef = useRef<number | null>(null);

  // Load preferences from Firestore on login
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    getUserProfile(user.uid)
      .then((profile) => {
        if (!mounted || !profile) return;
        const prefs = (profile as any).preferences || (profile as any).preferences || {};
        // Support multiple potential shapes for stored dashboard layout
        const serverLayout = (prefs && (prefs.dashboardLayout || prefs.dashboard?.layout)) || (profile as any).dashboardLayout || null;
        if (serverLayout && Array.isArray(serverLayout)) {
          const normalized = serverLayout.map((item: any) => ({ id: item.id, collapsed: !!item.collapsed }));
          setLayout(normalized);
          initialLoadedRef.current = true;
        }
      })
      .catch((err) => console.error("Failed to load dashboard preferences", err));

    return () => {
      mounted = false;
    };
  }, [user, setLayout]);

  // Save to Firestore when layout changes (debounced)
  useEffect(() => {
    if (!user) return;
    if (!initialLoadedRef.current) {
      // Avoid writing before initial load to prevent overwriting server prefs
      return;
    }

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        const profile = await getUserProfile(user.uid);
        const existingPrefs = (profile && (profile as any).preferences) || {};
        const merged = { ...existingPrefs, dashboardLayout: layout };
        await updateUserPreferences(user.uid, merged);
      } catch (e) {
        console.error("Failed to save dashboard preferences", e);
      }
    }, 900);

    return () => {
      if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    };
  }, [layout, user]);

  return null;
}

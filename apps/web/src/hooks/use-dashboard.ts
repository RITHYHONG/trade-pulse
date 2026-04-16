import { useEffect } from 'react';
import { dashboardStore } from '@/store/dashboard-store';

export function useDashboard() {
  const { username, stats, layout, setUsername, setStats, setLayout, toggleWidget } = dashboardStore();

  useEffect(() => {
    // TODO: fetch server-side profile and merge with local persisted layout
  }, []);

  return { username, stats, layout, setUsername, setStats, setLayout, toggleWidget };
}

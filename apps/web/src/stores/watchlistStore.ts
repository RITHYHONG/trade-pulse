import { create } from 'zustand';
import { showSuccess, showError } from '@/lib/toast';

type State = {
  watchlist: string[];
  alerts: string[];
  setWatchlist: (list: string[]) => void;
  setAlerts: (list: string[]) => void;
  fetchRemote: () => Promise<void>;
  addToWatchlist: (slug: string) => Promise<void>;
  removeFromWatchlist: (slug: string) => Promise<void>;
  addAlert: (slug: string) => Promise<void>;
  removeAlert: (slug: string) => Promise<void>;
  isInWatchlist: (slug: string) => boolean;
  hasAlert: (slug: string) => boolean;
};

export const useWatchlistStore = create<State>((set, get) => ({
  watchlist: [],
  alerts: [],
  setWatchlist: (list) => set({ watchlist: list }),
  setAlerts: (list) => set({ alerts: list }),
  fetchRemote: async () => {
    try {
      const [wRes, aRes] = await Promise.all([fetch('/api/watchlist'), fetch('/api/alerts')]);
      const w = await wRes.json().catch(() => ({}));
      const a = await aRes.json().catch(() => ({}));
      set({ watchlist: w.watchlist || [], alerts: a.alerts || [] });
    } catch (err) {
      // ignore
    }
  },
  addToWatchlist: async (slug) => {
    // optimistic
    const prev = get().watchlist;
    if (!prev.includes(slug)) set({ watchlist: [...prev, slug] });
    try {
      const res = await fetch('/api/watchlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
      if (!res.ok) throw new Error('Failed to add');
      const data = await res.json();
      set({ watchlist: data.watchlist || [] });
      showSuccess('Added to Watchlist');
    } catch (err) {
      set({ watchlist: prev });
      showError('Failed to add to watchlist');
    }
  },
  removeFromWatchlist: async (slug) => {
    const prev = get().watchlist;
    set({ watchlist: prev.filter(s => s !== slug) });
    try {
      const res = await fetch('/api/watchlist', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
      if (!res.ok) throw new Error('Failed to remove');
      const data = await res.json();
      set({ watchlist: data.watchlist || [] });
      showSuccess('Removed from Watchlist');
    } catch (err) {
      set({ watchlist: prev });
      showError('Failed to remove from watchlist');
    }
  },
  addAlert: async (slug) => {
    const prev = get().alerts;
    if (!prev.includes(slug)) set({ alerts: [...prev, slug] });
    try {
      const res = await fetch('/api/alerts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
      if (!res.ok) throw new Error('Failed to add alert');
      const data = await res.json();
      set({ alerts: data.alerts || [] });
      showSuccess('Alert set');
    } catch (err) {
      set({ alerts: prev });
      showError('Failed to set alert');
    }
  },
  removeAlert: async (slug) => {
    const prev = get().alerts;
    set({ alerts: prev.filter(s => s !== slug) });
    try {
      const res = await fetch('/api/alerts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
      if (!res.ok) throw new Error('Failed to remove alert');
      const data = await res.json();
      set({ alerts: data.alerts || [] });
      showSuccess('Alert removed');
    } catch (err) {
      set({ alerts: prev });
      showError('Failed to remove alert');
    }
  },
  isInWatchlist: (slug) => get().watchlist.includes(slug),
  hasAlert: (slug) => get().alerts.includes(slug),
}));

export default useWatchlistStore;

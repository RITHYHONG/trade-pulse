import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WidgetLayout = { id: string; x?: number; y?: number; w?: number; h?: number; collapsed?: boolean };

type StatItem = { label: string; value: string; trend?: string; trendValue?: string; color?: string };

type DashboardState = {
  username: string;
  stats: StatItem[];
  layout: WidgetLayout[];
  setUsername: (name: string) => void;
  setStats: (stats: StatItem[]) => void;
  setLayout: (layout: WidgetLayout[]) => void;
  toggleWidget: (id: string) => void;
};

export const dashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      username: 'Trader',
      stats: [
        { label: 'Daily P&L', value: '+$0.00', trend: 'neutral', trendValue: '—', color: 'bg-emerald-500' },
        { label: 'Active Trades', value: '0', trend: 'neutral', trendValue: 'Running', color: 'bg-indigo-500' },
        { label: 'Risk Exposure', value: '0.0%', trend: 'neutral', trendValue: 'Safe', color: 'bg-amber-500' },
        { label: 'Win Rate (20d)', value: '0%', trend: 'neutral', trendValue: '—', color: 'bg-primary' }
      ],
      layout: [{ id: 'ai-summary' }, { id: 'economic-calendar' }, { id: 'watchlist' }],
      setUsername: (name: string) => set({ username: name }),
      setStats: (stats: StatItem[]) => set({ stats }),
      setLayout: (layout: WidgetLayout[]) => set({ layout }),
      toggleWidget: (id: string) => set((state) => ({ layout: state.layout.map(w => w.id === id ? { ...w, collapsed: !w.collapsed } : w) }))
    }),
    { name: 'dashboard-storage' }
  )
);

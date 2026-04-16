'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { StatCard } from './StatCard';
import { TrendingUp, Activity, ShieldCheck, Zap } from 'lucide-react';
import { dashboardStore } from '@/store/dashboard-store';

export function DashboardClient() {
  const { username, stats } = dashboardStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground">{`Good Morning, ${username}. Here's what's happening today.`}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9">Export Data</Button>
          <Button className="h-9 bg-primary hover:bg-primary/90">
            <TrendingUp className="mr-2 h-4 w-4" />
            Quick Trade
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => {
          const Icon = idx === 0 ? TrendingUp : idx === 1 ? Activity : idx === 2 ? ShieldCheck : Zap;
          return (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              trend={s.trend as any}
              trendValue={s.trendValue}
              icon={Icon}
              color={s.color}
            />
          );
        })}
      </div>
    </div>
  );
}

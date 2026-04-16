'use client';
import React from 'react';

type Props = {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ComponentType<any>;
  color?: string;
};

export function StatCard({ label, value, trend, trendValue, icon: Icon, color = 'bg-primary' }: Props) {
  return (
    <div className="card-interactive bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
          {Icon ? <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : trend === 'down' ? 'bg-destructive/10 text-destructive' : 'bg-muted/10 text-muted-foreground'}`}>
          {trendValue}
        </span>
        <span className="text-xs text-muted-foreground">vs yesterday</span>
      </div>
    </div>
  );
}

import React from 'react';
import { Activity, Zap, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CalendarHeaderProps {
  highImpactCount: number;
  totalEvents: number;
  isMobile: boolean;
}

export function CalendarHeader({ highImpactCount, totalEvents, isMobile }: CalendarHeaderProps) {
  return (
    <div className="flex-none border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-[var(--primary)]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-foreground leading-tight tracking-tight">
              Economic Calendar & <span className="text-[var(--primary)]">Market Intelligence Hub</span>
            </h1>
            <p className="text-[0.7rem] text-muted-foreground font-semibold uppercase tracking-widest opacity-60">
              TradePulse Intelligence
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-bold text-muted-foreground">CRITICAL EVENTS:</span>
            <Badge variant="outline" className="h-5 bg-rose-500/10 text-rose-500 border-rose-500/20 px-2 font-sans text-[0.7rem]">
              {highImpactCount} HIGH IMPACT
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <nav aria-label="Breadcrumb" className="hidden xl:flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-4">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Economic Calendar</span>
          </nav>
          <Badge variant="outline" className="hidden lg:flex font-sans text-[0.7rem] font-bold px-2.5 py-1 text-muted-foreground border-border/60 bg-secondary/20">
            {totalEvents} LOADED
          </Badge>
        </div>
      </div>
    </div>
  );
}
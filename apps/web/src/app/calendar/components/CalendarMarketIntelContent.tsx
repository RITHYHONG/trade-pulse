import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Bell, BrainCircuit, Target } from 'lucide-react';
import { CentralBankDashboard } from './economic-calendar/CentralBankDashboard';
import { AlertSystem } from './economic-calendar/AlertSystem';
import { CorrelationMatrix, Correlation } from './economic-calendar/CorrelationMatrix';
import { CentralBankEvent, AiIntelligence } from './economic-calendar/types';

interface CalendarMarketIntelContentProps {
  events: CentralBankEvent[];
  aiIntelligence: AiIntelligence | null;
  isAiLoading: boolean;
  correlations: Correlation[];
}

export const CalendarMarketIntelContent = React.memo(function CalendarMarketIntelContent({
  events,
  aiIntelligence,
  isAiLoading,
  correlations,
}: CalendarMarketIntelContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-[var(--primary)]" />
            AI Market Pulse
          </h4>
          {aiIntelligence?.marketVerdict ? (
            <Badge variant="outline" className="h-5 text-[var(--primary)] bg-primary/10 border-primary/20 font-mono text-[0.65rem]">
              {aiIntelligence.marketVerdict}
            </Badge>
          ) : (
            <Badge variant="outline" className="h-5 text-muted-foreground border-border/40 bg-background/70 font-mono text-[0.65rem]">
              Intelligence queued
            </Badge>
          )}
        </div>

        <div className="p-4 rounded-xl bg-card/60 border border-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-8 h-8" />
          </div>
          {isAiLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ) : (
            <div className="space-y-3 relative z-10">
              <p className="text-[0.75rem] font-medium text-foreground leading-relaxed italic">
                &quot;{aiIntelligence?.overallSummary || 'Analyzing market events...' }&quot;
              </p>
              {aiIntelligence?.keyRisks && aiIntelligence.keyRisks.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {aiIntelligence.keyRisks.map((risk, index) => (
                    <Badge key={index} variant="secondary" className="h-4 text-[0.6rem] bg-background/50 border-border/20 font-bold uppercase">
                      • {risk}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-[0.2em]">Central Bank Watch</h4>
          <Target className="w-3.5 h-3.5 text-primary/50" />
        </div>
        <CentralBankDashboard events={events} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-[0.2em]">Live Alerts</h4>
          <Bell className="w-3.5 h-3.5 text-primary/50" />
        </div>
        <AlertSystem />
      </div>

      <div className="space-y-4 pb-8">
        <div className="flex items-center justify-between">
          <h4 className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-[0.2em]">Cross Correlations</h4>
          <Activity className="w-3.5 h-3.5 text-primary/50" />
        </div>
        <CorrelationMatrix correlations={correlations} />
      </div>
    </div>
  );
});

CalendarMarketIntelContent.displayName = 'CalendarMarketIntelContent';

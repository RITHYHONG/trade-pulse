import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalendarMarketIntelContent } from './CalendarMarketIntelContent';

interface CalendarIntelligencePanelProps {
  intelPanelOpen: boolean;
  onIntelPanelToggle: () => void;
  isMobile: boolean;
  mobileTab: string;
  centralBankEvents: any[];
  aiIntelligence: any;
  isAiLoading: boolean;
  correlations: any[];
}

export function CalendarIntelligencePanel({
  intelPanelOpen,
  onIntelPanelToggle,
  isMobile,
  mobileTab,
  centralBankEvents,
  aiIntelligence,
  isAiLoading,
  correlations
}: CalendarIntelligencePanelProps) {
  return (
    <aside
      className={cn(
        "flex-none border-l border-border/40 bg-background/30 transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
        (isMobile ? mobileTab === 'insights' : intelPanelOpen) ? (isMobile ? "fixed inset-x-0 inset-y-0 pb-16 z-40 bg-background" : "w-[320px] xl:w-[380px]") : "w-0"
      )}
    >
      <div className="flex-none p-5 border-b border-border/40 bg-background/40 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-xs tracking-widest uppercase">Market Intelligence</h3>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onIntelPanelToggle} className="h-7 w-7 rounded-full">
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
      <CalendarMarketIntelContent
        events={centralBankEvents}
        aiIntelligence={aiIntelligence}
        isAiLoading={isAiLoading}
        correlations={correlations}
      />
    </aside>
  );
}
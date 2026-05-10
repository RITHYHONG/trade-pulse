import React from 'react';
import { BarChart3, Filter, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarMobileNavProps {
  mobileTab: string;
  onTabChange: (tab: 'calendar' | 'filters' | 'insights') => void;
  onIntelPanelToggle: () => void;
}

export function CalendarMobileNav({ mobileTab, onTabChange, onIntelPanelToggle }: CalendarMobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-xl border-t border-border/50 flex items-center justify-around z-50">
      <button
        onClick={() => onTabChange('calendar')}
        className={cn("flex flex-col items-center justify-center w-full h-full", mobileTab === 'calendar' ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
      >
        <BarChart3 className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">Calendar</span>
      </button>
      <button
        onClick={() => onTabChange('filters')}
        className={cn("flex flex-col items-center justify-center w-full h-full", mobileTab === 'filters' ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
      >
        <Filter className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">Filters</span>
      </button>
      <button
        onClick={() => {
          onTabChange('insights');
          onIntelPanelToggle();
        }}
        className={cn("flex flex-col items-center justify-center w-full h-full", mobileTab === 'insights' ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}
      >
        <BrainCircuit className="w-5 h-5 mb-1" />
        <span className="text-[10px] font-bold">Insights</span>
      </button>
    </nav>
  );
}
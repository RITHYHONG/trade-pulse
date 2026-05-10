import React from 'react';
import { cn } from '@/lib/utils';
import { FilterSidebar } from './economic-calendar/FilterSidebar';
import { FilterState } from './economic-calendar/types';

interface CalendarSidebarProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  events: any[];
  mobileTab: string;
}

export function CalendarSidebar({
  sidebarOpen,
  isMobile,
  filters,
  onFiltersChange,
  events,
  mobileTab
}: CalendarSidebarProps) {
  if (isMobile) {
    return mobileTab === 'filters' ? (
      <div className="flex-1 flex flex-col bg-background relative z-40 overflow-hidden pb-16">
        <div className="flex items-center justify-between p-4 border-b border-border/40 bg-background/80 flex-none leading-none h-14">
          <span className="text-xs font-bold tracking-widest uppercase items-center flex h-full">Global Filters</span>
        </div>
        <div className="flex-1 overflow-y-auto basis-full min-h-0 relative">
          <FilterSidebar filters={filters} onFiltersChange={onFiltersChange} events={events} />
        </div>
      </div>
    ) : null;
  }

  return (
    <aside
      className={cn(
        "flex-none border-r border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 ease-in-out z-40 hidden md:block",
        sidebarOpen ? "w-72" : "w-0"
      )}
    >
      <div className="h-full relative flex flex-col bg-card/20">
        <FilterSidebar filters={filters} onFiltersChange={onFiltersChange} events={events} />
      </div>
    </aside>
  );
}
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, BarChart3, Grid3x3, List, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewMode } from './economic-calendar/types';
import dynamic from 'next/dynamic';

// Dynamically import view components
const TimelineView = dynamic(
  () => import('./economic-calendar/TimelineView').then(mod => ({ default: mod.TimelineView })),
  { ssr: false }
);

const HeatMapView = dynamic(
  () => import('./economic-calendar/HeatMapView').then(mod => ({ default: mod.HeatMapView })),
  { ssr: false }
);

const ListView = dynamic(
  () => import('./economic-calendar/ListView').then(mod => ({ default: mod.ListView })),
  { ssr: false }
);

interface CalendarMainProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  intelPanelOpen: boolean;
  onIntelPanelToggle: () => void;
  filteredEvents: any[];
  onEventClick: (event: any) => void;
  isMobile: boolean;
  mobileTab: string;
}

export function CalendarMain({
  viewMode,
  onViewModeChange,
  sidebarOpen,
  onSidebarToggle,
  intelPanelOpen,
  onIntelPanelToggle,
  filteredEvents,
  onEventClick,
  isMobile,
  mobileTab
}: CalendarMainProps) {
  return (
    <div className={cn("flex-1 flex flex-col min-w-0 bg-secondary/10 relative", isMobile && mobileTab !== 'calendar' && "hidden")}>
      <div className="flex-none px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSidebarToggle}
              className="hover:bg-background h-8 w-8 rounded-lg border border-border/40 text-muted-foreground transition-all hover:text-primary shrink-0"
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          )}

          <Tabs value={viewMode} onValueChange={(value) => onViewModeChange(value as ViewMode)} className="w-auto shrink-0">
            <TabsList className="h-9 bg-muted/40 p-1 gap-1 border border-border/20 rounded-xl">
              <TabsTrigger value="timeline" className="text-[11px] font-bold px-4 h-7 data-[state=active]:bg-primary/50 data-[state=active]:text-primary transition-all">
                <BarChart3 className="w-3.5 h-3.5 mr-2" />
                TIMELINE
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="text-[11px] font-bold px-4 h-7 data-[state=active]:bg-background data-[state=active]:text-primary transition-all">
                <Grid3x3 className="w-3.5 h-3.5 mr-2" />
                HEATMAP
              </TabsTrigger>
              <TabsTrigger value="list" className="text-[11px] font-bold px-4 h-7 data-[state=active]:bg-background data-[state=active]:text-primary transition-all">
                <List className="w-3.5 h-3.5 mr-2" />
                LIST
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="hidden lg:flex items-end gap-2 mt-2 md:mt-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onIntelPanelToggle}
            className={cn(
              "h-8 px-3 text-[0.7rem] font-bold transition-all border border-transparent",
              intelPanelOpen ? "bg-primary/10 border-primary/20" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {intelPanelOpen ? <PanelRightClose className="w-4 h-4 mr-2" /> : <PanelRightOpen className="w-4 h-4 mr-2" />}
            INTELLIGENCE
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 md:px-6 pb-6">
        <div className="h-full bg-background/20 rounded-2xl border border-border/40 overflow-hidden shadow-inner flex flex-col">
          <div className="flex-1 overflow-auto scrollbar-hide [will-change:transform]">
            {viewMode === 'timeline' && <TimelineView events={filteredEvents} onEventClick={onEventClick} />}
            {viewMode === 'heatmap' && <HeatMapView events={filteredEvents} onEventClick={onEventClick} />}
            {viewMode === 'list' && <ListView events={filteredEvents} onEventClick={onEventClick} />}
          </div>
        </div>
      </div>
    </div>
  );
}
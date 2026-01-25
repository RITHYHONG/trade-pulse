import React, { useState, useMemo, useEffect } from 'react';
import { FilterSidebar } from './components/economic-calendar/FilterSidebar';
import { TimelineView } from './components/economic-calendar/TimelineView';
import { HeatMapView } from './components/economic-calendar/HeatMapView';
import { ListView } from './components/economic-calendar/ListView';
import { EventIntelligencePanel } from './components/economic-calendar/EventIntelligencePanel';
import { CentralBankDashboard } from './components/economic-calendar/CentralBankDashboard';
import { AlertSystem } from './components/economic-calendar/AlertSystem';
import { CorrelationMatrix } from './components/economic-calendar/CorrelationMatrix';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Grid3x3,
  List,
  Filter,
  Activity,
  Bell,
  Target,
  Zap,
  BrainCircuit,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { mockEconomicEvents, mockCentralBankEvents } from './components/economic-calendar/mockData';
import { FilterState, EconomicEvent, ViewMode, CentralBankEvent, AiIntelligence } from './components/economic-calendar/types';
// EconomicCalendarService removed from client-side imports for security

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
const MarketIntelContent = React.memo(({ events, aiIntelligence, isAiLoading, correlations }: { events: CentralBankEvent[], aiIntelligence: AiIntelligence | null, isAiLoading: boolean, correlations: unknown[] }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
    {/* AI Verdict Section */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-1.5">
          <BrainCircuit className="w-3.5 h-3.5 text-primary" />
          AI Market Pulse
        </h4>
        {aiIntelligence?.marketVerdict && (
          <Badge variant="outline" className="h-5 bg-primary/10 text-primary border-primary/20 font-mono text-[0.65rem]">
            {aiIntelligence.marketVerdict}
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
              &quot;{aiIntelligence?.overallSummary || 'Analyzing market events...'}&quot;
            </p>
            {aiIntelligence?.keyRisks && (
              <div className="flex flex-wrap gap-1.5">
                {aiIntelligence.keyRisks.map((risk: string, i: number) => (
                  <Badge key={i} variant="secondary" className="h-4 text-[0.6rem] bg-background/50 border-border/20 font-bold uppercase">
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
));

MarketIntelContent.displayName = 'MarketIntelContent';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [intelPanelOpen, setIntelPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [centralBankEvents, setCentralBankEvents] = useState<CentralBankEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiIntelligence, setAiIntelligence] = useState<AiIntelligence | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [correlations, setCorrelations] = useState<unknown[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'week',
    impacts: ['high', 'medium', 'low'],
    regions: ['US', 'EU', 'UK', 'Asia', 'EM'],
    categories: [],
    searchQuery: '',
    highImpactOnly: false,
    viewPreset: 'custom'
  });

  useEffect(() => {
    function updateIsMobile() {
      const width = window.innerWidth || 0;
      const mobile = width < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setIntelPanelOpen(false);
      } else {
        setSidebarOpen(true);
        setIntelPanelOpen(width >= 1536); // Auto open on 2xl+
      }
    }
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setIsAiLoading(true); // Set AI loading true at the start of the bulk fetch
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - 2);
        const end = new Date(today);
        end.setDate(today.getDate() + 14);

        const response = await fetch(`/api/calendar/bulk?start=${start.toISOString()}&end=${end.toISOString()}`);
        if (!response.ok) throw new Error('Failed to fetch bulk calendar data');

        const data = await response.json();

        // Parse dates which come as strings from JSON API
        const parsedEvents = (data.events || []).map((event: EconomicEvent) => ({
          ...event,
          datetime: new Date(event.datetime)
        }));

        const parsedCBEvents = (data.centralBankEvents || []).map((event: CentralBankEvent) => ({
          ...event,
          datetime: new Date(event.datetime)
        }));

        setEvents(parsedEvents);
        setCentralBankEvents(parsedCBEvents);
        setAiIntelligence(data.intelligence);
        setCorrelations(data.correlations);

        setIsAiLoading(false);
      } catch (err) {
        console.error('Failed to fetch events', err);
        setEvents(mockEconomicEvents);
        setCentralBankEvents(mockCentralBankEvents);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (filters.dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        startDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
        endDate = new Date(weekStart);
        endDate.setDate(weekStart.getDate() + 6);
        endDate.setHours(23, 59, 59);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'custom':
        startDate = filters.customRange?.start || now;
        endDate = filters.customRange?.end || now;
        break;
      default:
        startDate = now;
        endDate = now;
    }

    return events.filter(event => {
      // Date filter
      const eventDate = new Date(event.datetime);
      if (eventDate < startDate || eventDate > endDate) return false;

      if (filters.highImpactOnly && event.impact !== 'high') return false;
      if (!filters.impacts.includes(event.impact)) return false;
      if (!filters.regions.includes(event.region)) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(event.category)) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          event.name.toLowerCase().includes(query) ||
          event.country.toLowerCase().includes(query) ||
          event.region.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [events, filters]);

  const highImpactCount = useMemo(() =>
    filteredEvents.filter(e => e.impact === 'high').length,
    [filteredEvents]
  );

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleEventClick = (event: EconomicEvent) => {
    setSelectedEvent(event);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Header Skeleton */}
        <div className="flex-none border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="hidden sm:block">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex-1 max-w-md mx-auto hidden md:block">
              <Skeleton className="h-6 w-48 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="hidden lg:block w-16 h-6 rounded" />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <main className="flex-1 flex overflow-hidden relative">
          {/* Sidebar Skeleton */}
          {!isMobile && (
            <aside className="flex-none w-72 border-r border-border/40 bg-background/50 backdrop-blur-sm">
              <div className="h-full p-4 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
              </div>
            </aside>
          )}

          {/* Main View Skeleton */}
          <div className="flex-1 flex flex-col min-w-0 bg-secondary/10">
            <div className="flex-none px-4 md:px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-8 w-48 rounded-xl" />
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <Skeleton className="h-8 w-24 rounded" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden px-4 md:px-6 pb-6">
              <div className="h-full bg-background/20 rounded-2xl border border-border/40 overflow-hidden shadow-inner flex flex-col">
                <div className="flex-1 p-6 space-y-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="w-16 h-4" />
                      <Skeleton className="flex-1 h-20 rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence Panel Skeleton */}
          {!isMobile && (
            <aside className="flex-none w-[320px] border-l border-border/40 bg-background/30">
              <div className="flex-none p-5 border-b border-border/40 bg-background/40 backdrop-blur-sm">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="p-4 space-y-6">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
              </div>
            </aside>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background selection:bg-primary/10 transition-colors duration-300">
      <div className="flex-none border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground leading-tight tracking-tight">TradePulse <span className="text-primary">Calendar</span></h1>
              <p className="text-[0.7rem] text-muted-foreground font-semibold uppercase tracking-widest opacity-60">Intelligence Hub</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold text-muted-foreground">CRITICAL EVENTS:</span>
              <Badge variant="outline" className="h-5 bg-rose-500/10 text-rose-500 border-rose-500/20 px-2 font-mono text-[0.7rem]">
                {highImpactCount} HIGH IMPACT
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all">
                    <BrainCircuit className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-[85%] sm:w-[400px] border-l-border/40 bg-background/95 backdrop-blur-xl">
                  <SheetHeader className="p-6 border-b border-border/40">
                    <SheetTitle className="text-sm font-bold flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-primary" />
                      MARKET INTELLIGENCE
                    </SheetTitle>
                  </SheetHeader>
                  <MarketIntelContent
                    events={mockCentralBankEvents}
                    aiIntelligence={aiIntelligence}
                    isAiLoading={isAiLoading}
                    correlations={correlations}
                  />
                </SheetContent>
              </Sheet>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Filter className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-border/40 mx-1 hidden lg:block" />

            <Badge variant="outline" className="hidden lg:flex font-mono text-[0.7rem] font-bold px-2.5 py-1 text-muted-foreground border-border/60 bg-secondary/20">
              {filteredEvents.length} LOADED
            </Badge>
          </div>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden relative">
        <aside
          className={cn(
            "flex-none border-r border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 ease-in-out z-40",
            sidebarOpen ? (isMobile ? "fixed inset-0 w-full" : "w-72") : "w-0"
          )}
        >
          <div className="h-full relative flex flex-col bg-card/20">
            {isMobile && (
              <div className="flex items-center justify-between p-4 border-b border-border/40 bg-background/80">
                <span className="text-xs font-bold tracking-widest uppercase">Global Filters</span>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="rounded-full">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </div>
            )}
            <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} events={events} />
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 bg-secondary/10 relative">
          <div className="flex-none px-4 md:px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hover:bg-background h-8 w-8 rounded-lg border border-border/40 text-muted-foreground transition-all hover:text-primary"
                >
                  {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              )}

              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="w-auto">
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

            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIntelPanelOpen(!intelPanelOpen)}
                className={cn(
                  "h-8 px-3 text-[0.7rem] font-bold transition-all border border-transparent",
                  intelPanelOpen ? "text-primary bg-primary/10 border-primary/20" : "text-muted-foreground hover:bg-muted"
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
                {viewMode === 'timeline' && <TimelineView events={filteredEvents} onEventClick={handleEventClick} isLoading={isLoading} />}
                {viewMode === 'heatmap' && <HeatMapView events={filteredEvents} onEventClick={handleEventClick} isLoading={isLoading} />}
                {viewMode === 'list' && <ListView events={filteredEvents} onEventClick={handleEventClick} isLoading={isLoading} />}
              </div>
            </div>
          </div>
        </div>

        <aside
          className={cn(
            "flex-none border-l border-border/40 bg-background/30 transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
            intelPanelOpen ? "w-[320px] xl:w-[380px]" : "w-0"
          )}
        >
          <div className="flex-none p-5 border-b border-border/40 bg-background/40 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs tracking-widest uppercase">Market Intelligence</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIntelPanelOpen(false)} className="h-7 w-7 rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <MarketIntelContent
            events={centralBankEvents}
            aiIntelligence={aiIntelligence}
            isAiLoading={isAiLoading}
            correlations={correlations}
          />
        </aside>

        {selectedEvent && (
          <EventIntelligencePanel
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </main>
    </div>
  );
}

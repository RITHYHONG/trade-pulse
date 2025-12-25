import { useState, useMemo, useEffect } from 'react';
import { FilterSidebar } from './components/economic-calendar/FilterSidebar';
import { TimelineView } from './components/economic-calendar/TimelineView';
import { HeatMapView } from './components/economic-calendar/HeatMapView';
import { ListView } from './components/economic-calendar/ListView';
import { EventIntelligencePanel } from './components/economic-calendar/EventIntelligencePanel';
import { CentralBankDashboard } from './components/economic-calendar/CentralBankDashboard';
import { AlertSystem } from './components/economic-calendar/AlertSystem';
import { CorrelationMatrix } from './components/economic-calendar/CorrelationMatrix';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  LayoutDashboard,
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
import { FilterState, EconomicEvent, ViewMode, Region, EventCategory } from './components/economic-calendar/types';
import { getEconomicCalendar } from '@/lib/api/economic-calendar';
import { EconomicCalendarEvent } from '@/types';
import { cn } from '@/lib/utils';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [intelPanelOpen, setIntelPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const calendarEvents = await getEconomicCalendar();
        const mappedEvents = calendarEvents.map(mapToEconomicEvent);
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Failed to fetch events', error);
        setEvents(mockEconomicEvents);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  function mapToEconomicEvent(calEvent: EconomicCalendarEvent): EconomicEvent {
    const regionMap: Record<string, Region> = {
      'US': 'US', 'United States': 'US', 'EU': 'EU', 'European Union': 'EU',
      'Germany': 'EU', 'France': 'EU', 'UK': 'UK', 'United Kingdom': 'UK',
      'Japan': 'Asia', 'China': 'Asia', 'Australia': 'Asia', 'Canada': 'US',
    };
    const region = regionMap[calEvent.country] || 'US';

    const categoryMap: Partial<Record<string, EventCategory>> = {
      'GDP': 'gdp', 'CPI': 'inflation', 'PPI': 'inflation',
      'Unemployment': 'employment', 'NFP': 'employment',
      'Retail Sales': 'retail', 'PMI': 'manufacturing',
      'Interest Rate': 'centralBank',
    };
    const category: EventCategory = Object.keys(categoryMap).find(key => calEvent.event.includes(key))
      ? categoryMap[Object.keys(categoryMap).find(key => calEvent.event.includes(key))!]!
      : 'inflation';

    const today = new Date();
    const [hour, minute] = calEvent.time.split(':').map(Number);
    const datetime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour || 0, minute || 0);
    const unit = calEvent.consensus.includes('%') ? '%' : calEvent.consensus.includes('K') ? 'K' : '';

    return {
      id: calEvent.id,
      name: calEvent.event,
      country: calEvent.country,
      region,
      datetime,
      impact: calEvent.impact,
      category,
      actual: calEvent.actual ? parseFloat(calEvent.actual.replace(/[^\d.-]/g, '')) : undefined,
      consensus: parseFloat(calEvent.consensus.replace(/[^\d.-]/g, '')) || 0,
      previous: parseFloat(calEvent.previous.replace(/[^\d.-]/g, '')) || 0,
      unit,
      historicalData: {
        avgMove: 0.5, directionBias: 'neutral', biasSuccessRate: 50,
        peakImpactMinutes: 15, fadeTimeHours: 2
      },
      consensusIntelligence: {
        estimateDistribution: [0, 0, 0, 0, 0], revisionMomentum: 'stable',
        surpriseProbability: 50, whisperNumber: undefined
      },
      tradingSetup: {
        strategyTag: 'Monitor Only', correlatedAssets: [], expectedMove: 0.5, confidenceScore: 50
      },
      affectedAssets: []
    };
  }

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
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

  const highImpactCount = filteredEvents.filter(e => e.impact === 'high').length;

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleEventClick = (event: EconomicEvent) => {
    setSelectedEvent(event);
  };

  const MarketIntelContent = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Central Bank Watch</h4>
          <Target className="w-3.5 h-3.5 text-primary/50" />
        </div>
        <CentralBankDashboard events={mockCentralBankEvents} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Live Alerts</h4>
          <Bell className="w-3.5 h-3.5 text-primary/50" />
        </div>
        <AlertSystem />
      </div>

      <div className="space-y-4 pb-8">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Cross Correlations</h4>
          <Activity className="w-3.5 h-3.5 text-primary/50" />
        </div>
        <CorrelationMatrix />
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background selection:bg-primary/10 transition-colors duration-300">
      {/* Refined Modular Header */}
      <header className="flex-none border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground leading-tight tracking-tight">TradePulse <span className="text-primary">Calendar</span></h1>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest opacity-60">Intelligence Hub</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold text-muted-foreground">CRITICAL EVENTS:</span>
              <Badge variant="outline" className="h-5 bg-rose-500/10 text-rose-500 border-rose-500/20 px-2 font-mono text-[10px]">
                {highImpactCount} HIGH IMPACT
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Market Intelligence Mobile Trigger */}
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
                  <MarketIntelContent />
                </SheetContent>
              </Sheet>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Filter className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-border/40 mx-1 hidden lg:block" />

            <Badge variant="outline" className="hidden lg:flex font-mono text-[10px] font-bold px-2.5 py-1 text-muted-foreground border-border/60 bg-secondary/20">
              {filteredEvents.length} LOADED
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Layout Engine */}
      <main className="flex-1 flex overflow-hidden relative">

        {/* Left Filter Sidebar */}
        <aside
          className={cn(
            "flex-none border-r border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-500 ease-in-out z-40",
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
            <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        </aside>

        {/* Content Vessel */}
        <div className="flex-1 flex flex-col min-w-0 bg-secondary/10 relative">
          {/* Subtle Dynamic Toolbar */}
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
                  <TabsTrigger value="timeline" className="text-[11px] font-bold px-4 h-7 data-[state=active]:bg-background data-[state=active]:text-primary transition-all">
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

            {/* Desktop Intelligence Toggle */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIntelPanelOpen(!intelPanelOpen)}
                className={cn(
                  "h-8 px-3 text-[10px] font-bold transition-all border border-transparent",
                  intelPanelOpen ? "text-primary bg-primary/10 border-primary/20" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {intelPanelOpen ? <PanelRightClose className="w-4 h-4 mr-2" /> : <PanelRightOpen className="w-4 h-4 mr-2" />}
                INTELLIGENCE
              </Button>
            </div>
          </div>

          {/* Core Visualisation Window */}
          <div className="flex-1 overflow-hidden px-4 md:px-6 pb-6">
            <div className="h-full bg-background/40 backdrop-blur-[2px] rounded-2xl border border-border/40 overflow-hidden shadow-inner flex flex-col">
              <div className="flex-1 overflow-auto scrollbar-hide">
                {viewMode === 'timeline' && <TimelineView events={filteredEvents} onEventClick={handleEventClick} isLoading={isLoading} />}
                {viewMode === 'heatmap' && <HeatMapView events={filteredEvents} onEventClick={handleEventClick} isLoading={isLoading} />}
                {viewMode === 'list' && <ListView events={filteredEvents} onEventClick={handleEventClick} isLoading={isLoading} />}
              </div>
            </div>
          </div>
        </div>

        {/* Right Intelligence Sidebar (Desktop Only) */}
        <aside
          className={cn(
            "flex-none border-l border-border/40 bg-background/30 transition-all duration-500 ease-in-out flex flex-col overflow-hidden",
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
          <MarketIntelContent />
        </aside>

        {/* Dynamic Detail Overlay */}
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

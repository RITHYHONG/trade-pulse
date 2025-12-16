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
import { ChevronLeft, ChevronRight, BarChart3, Grid3x3, List, Filter, Activity, Bell, Target, Zap } from 'lucide-react';
import { mockEconomicEvents, mockCentralBankEvents } from './components/economic-calendar/mockData';
import { FilterState, EconomicEvent, ViewMode, Region, EventCategory } from './components/economic-calendar/types';
import { getEconomicCalendar } from '@/lib/api/economic-calendar';
import { EconomicCalendarEvent } from '@/types';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      setIsMobile(width < 1024);
      if (width < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
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
        // Fallback to mock
        setEvents(mockEconomicEvents);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  function mapToEconomicEvent(calEvent: EconomicCalendarEvent): EconomicEvent {
    // Infer region from country
    const regionMap: Record<string, Region> = {
      'US': 'US',
      'United States': 'US',
      'EU': 'EU',
      'European Union': 'EU',
      'Germany': 'EU',
      'France': 'EU',
      'UK': 'UK',
      'United Kingdom': 'UK',
      'Japan': 'Asia',
      'China': 'Asia',
      'Australia': 'Asia',
      'Canada': 'US',
    };
    const region = regionMap[calEvent.country] || 'US';

    // Infer category from event name
    const categoryMap: Partial<Record<string, EventCategory>> = {
      'GDP': 'gdp',
      'CPI': 'inflation',
      'PPI': 'inflation',
      'Unemployment': 'employment',
      'NFP': 'employment',
      'Retail Sales': 'retail',
      'PMI': 'manufacturing',
      'Interest Rate': 'centralBank',
    };
    const category: EventCategory = Object.keys(categoryMap).find(key => calEvent.event.includes(key)) ? categoryMap[Object.keys(categoryMap).find(key => calEvent.event.includes(key))!]! : 'inflation';

    // Parse time to datetime
    const today = new Date();
    const [hour, minute] = calEvent.time.split(':').map(Number);
    const datetime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour || 0, minute || 0);

    // Infer unit
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
        avgMove: 0.5,
        directionBias: 'neutral',
        biasSuccessRate: 50,
        peakImpactMinutes: 15,
        fadeTimeHours: 2
      },
      consensusIntelligence: {
        estimateDistribution: [0, 0, 0, 0, 0],
        revisionMomentum: 'stable',
        surpriseProbability: 50,
        whisperNumber: undefined
      },
      tradingSetup: {
        strategyTag: 'Monitor Only',
        correlatedAssets: [],
        expectedMove: 0.5,
        confidenceScore: 50
      },
      affectedAssets: []
    };
  }

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Impact filter
      if (filters.highImpactOnly && event.impact !== 'high') return false;
      if (!filters.impacts.includes(event.impact)) return false;

      // Region filter
      if (!filters.regions.includes(event.region)) return false;

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
        return false;
      }

      // Search filter
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

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/95 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Economic Calendar</h1>
                <p className="text-sm text-muted-foreground">Track global economic events and market impact</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/5">
                  <Zap className="w-3 h-3 mr-1.5" />
                  {highImpactCount} High Impact
                </Badge>
                <Badge variant="outline" className="border-border/50 bg-background/50">
                  {filteredEvents.length} Events
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Sidebar Toggle Button */}
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-card/95 backdrop-blur-xl border border-border/50 rounded-r-xl rounded-l-none hover:bg-card transition-colors shadow-lg"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <ChevronRight className="w-4 h-4 text-primary" />
          </Button>
        )}

        {/* Filter Sidebar - show inline on lg, overlay on mobile */}
        {/* Desktop: show sidebar in layout */}
        <div className="hidden lg:block relative h-full">
          {sidebarOpen && (
            <div className="relative h-full">
              <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl hover:bg-card transition-colors shadow-lg"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-primary" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile: show overlay when sidebarOpen */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-50 flex bg-background/95 backdrop-blur-xl p-4">
            <div className="w-full md:w-80 bg-card/50 backdrop-blur-xl rounded-xl border border-border/50 p-4">
              <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
            </div>
            <div className="absolute top-6 right-6">
              <Button
                variant="ghost"
                size="icon"
                className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl hover:bg-card transition-colors"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-primary rotate-180" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex h-full overflow-auto">
          {/* Left Section - View Tabs */}
          <div className="flex-1 flex flex-col border-r border-border/50">
            {/* Mobile filter toggle */}
            {isMobile && (
              <div className="px-4 py-3 border-b border-border/50 bg-card/95 backdrop-blur-xl">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/50 hover:bg-muted/50 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            )}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="flex-1 flex flex-col min-h-0">
              <div className="border-b border-border/50 bg-card/95 backdrop-blur-xl px-6 py-4">
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 flex items-center gap-2 px-4 py-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger
                    value="heatmap"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 flex items-center gap-2 px-4 py-2"
                  >
                    <Grid3x3 className="w-4 h-4" />
                    Heat Map
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 flex items-center gap-2 px-4 py-2"
                  >
                    <List className="w-4 h-4" />
                    List View
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="overflow-y-auto flex-1">
                <TabsContent value="timeline" className="h-full m-0">
                  <TimelineView events={filteredEvents} onEventClick={handleEventClick} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="heatmap" className="h-full m-0">
                  <HeatMapView events={filteredEvents} onEventClick={handleEventClick} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="list" className="h-full m-0">
                  <ListView events={filteredEvents} onEventClick={handleEventClick} isLoading={isLoading} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Section - Advanced Features */}
          <div className="flex-1 flex flex-col">
            <Tabs defaultValue="central-bank" className="flex-1 flex flex-col min-h-0">
              <div className="border-b border-border/50 bg-card/95 backdrop-blur-xl px-6 py-4">
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger
                    value="central-bank"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 flex items-center gap-2 px-4 py-2"
                  >
                    <Target className="w-4 h-4" />
                    Central Bank Watch
                  </TabsTrigger>
                  <TabsTrigger
                    value="alerts"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 flex items-center gap-2 px-4 py-2"
                  >
                    <Bell className="w-4 h-4" />
                    Smart Alerts
                  </TabsTrigger>
                  <TabsTrigger
                    value="correlation"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 flex items-center gap-2 px-4 py-2"
                  >
                    <Activity className="w-4 h-4" />
                    Correlation Matrix
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="overflow-y-auto flex-1">
                <TabsContent value="central-bank" className="m-0 p-6 h-full">
                  <CentralBankDashboard events={mockCentralBankEvents} />
                </TabsContent>

                <TabsContent value="alerts" className="m-0 p-6 h-full">
                  <AlertSystem />
                </TabsContent>

                <TabsContent value="correlation" className="m-0 p-6 h-full">
                  <CorrelationMatrix />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Event Intelligence Panel */}
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

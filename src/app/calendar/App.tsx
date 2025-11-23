import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/economic-calendar/Header';
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
import { ChevronLeft, ChevronRight, BarChart3, Grid3x3, List } from 'lucide-react';
import { mockEconomicEvents, mockCentralBankEvents } from './components/economic-calendar/mockData';
import { FilterState, EconomicEvent, ViewMode, Region, EventCategory } from './components/economic-calendar/types';
import { getEconomicCalendar } from '@/lib/api/economic-calendar';
import { EconomicCalendarEvent } from '@/types';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [events, setEvents] = useState<EconomicEvent[]>([]);
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
    const fetchEvents = async () => {
      try {
        const calendarEvents = await getEconomicCalendar();
        const mappedEvents = calendarEvents.map(mapToEconomicEvent);
        setEvents(mappedEvents);
      } catch (error) {
        console.error('Failed to fetch events', error);
        // Fallback to mock
        setEvents(mockEconomicEvents);
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
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <Header
        filters={filters}
        onFiltersChange={handleFiltersChange}
        eventCount={filteredEvents.length}
        highImpactCount={highImpactCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Sidebar Toggle Button */}
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-slate-900 border border-slate-800 rounded-r-lg rounded-l-none hover:bg-slate-800"
            onClick={() => setSidebarOpen(true)}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </Button>
        )}

        {/* Filter Sidebar */}
        {sidebarOpen && (
          <div className="relative h-full">
            <FilterSidebar filters={filters} onFiltersChange={handleFiltersChange} />
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800"
              onClick={() => setSidebarOpen(false)}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex h-full overflow-auto">
          {/* Left Section - View Tabs */}
          <div className="flex-1 flex flex-col border-r border-slate-800">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="flex-1 flex flex-col min-h-0">
              <div className="border-b border-slate-800 bg-slate-950 px-6 py-3">
                <TabsList className="bg-slate-900">
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger value="heatmap" className="data-[state=active]:bg-blue-600">
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    Heat Map
                  </TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-blue-600">
                    <List className="w-4 h-4 mr-2" />
                    List View
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="overflow-y-auto flex-1">
                <TabsContent value="timeline" className="h-full m-0">
                  <TimelineView events={filteredEvents} onEventClick={handleEventClick} />
                </TabsContent>

                <TabsContent value="heatmap" className="h-full m-0">
                  <HeatMapView events={filteredEvents} onEventClick={handleEventClick} />
                </TabsContent>

                <TabsContent value="list" className="h-full m-0">
                  <ListView events={filteredEvents} onEventClick={handleEventClick} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Section - Advanced Features */}
          <div className="flex-1 flex flex-col">
            <Tabs defaultValue="central-bank" className="flex-1 flex flex-col min-h-0">
              <div className="border-b border-slate-800 px-6 py-3 bg-slate-950">
                <TabsList className="bg-slate-900">
                  <TabsTrigger 
                    value="central-bank" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                  >
                    Central Bank Watch
                  </TabsTrigger>
                  <TabsTrigger 
                    value="alerts" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                  >
                    Smart Alerts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="correlation" 
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                  >
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
      </div>
    </div>
  );
}

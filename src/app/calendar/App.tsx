import { useState, useMemo } from 'react';
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
import { FilterState, EconomicEvent, ViewMode } from './components/economic-calendar/types';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'week',
    impacts: ['high', 'medium', 'low'],
    regions: ['US', 'EU', 'UK', 'Asia', 'EM'],
    categories: [],
    searchQuery: '',
    highImpactOnly: false,
    viewPreset: 'custom'
  });

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    return mockEconomicEvents.filter(event => {
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
  }, [filters]);

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
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* View Tabs */}
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

            <div className="flex-1 overflow-hidden min-h-0">
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

          {/* Bottom Panels - Advanced Features */}
          <div className="border-t border-slate-800 bg-slate-950">
            <Tabs defaultValue="central-bank" className="w-full">
              <div className="border-b border-slate-800 px-6">
                <TabsList className="bg-transparent border-b-0 h-auto p-0">
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

              <div className="max-h-[400px] overflow-y-auto">
                <TabsContent value="central-bank" className="m-0 p-6">
                  <CentralBankDashboard events={mockCentralBankEvents} />
                </TabsContent>

                <TabsContent value="alerts" className="m-0 p-6">
                  <AlertSystem />
                </TabsContent>

                <TabsContent value="correlation" className="m-0 p-6">
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

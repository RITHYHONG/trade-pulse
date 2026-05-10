'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { EventIntelligencePanel } from './components/economic-calendar/EventIntelligencePanel';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarMain } from './components/CalendarMain';
import { CalendarSidebar } from './components/CalendarSidebar';
import { CalendarIntelligencePanel } from './components/CalendarIntelligencePanel';
import { CalendarMobileNav } from './components/CalendarMobileNav';
import { CalendarLoadingState } from './components/CalendarLoadingState';
import { mockEconomicEvents, mockCentralBankEvents } from './components/economic-calendar/mockData';
import { FilterState, EconomicEvent, ViewMode, CentralBankEvent, AiIntelligence } from './components/economic-calendar/types';
import { Correlation } from './components/economic-calendar/CorrelationMatrix';
import { useCalendarState } from './hooks/use-calendar-state';
import { useIsMobileBreakpoint } from '@/hooks/use-media-query';
import { toast } from '@/lib/toast';
import { calendarApiResponseSchema } from '@/lib/validations';

export default function App() {
  const { filters, updateFilters, selectedEventId, updateSelectedEvent } = useCalendarState();
  const isMobile = useIsMobileBreakpoint();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [intelPanelOpen, setIntelPanelOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'calendar' | 'filters' | 'insights'>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [centralBankEvents, setCentralBankEvents] = useState<CentralBankEvent[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [aiIntelligence, setAiIntelligence] = useState<AiIntelligence | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [correlations, setCorrelations] = useState<Correlation[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchEvents = async () => {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - 2);
      const end = new Date(today);
      end.setDate(today.getDate() + 14);

      const url = `/api/calendar/bulk?start=${start.toISOString()}&end=${end.toISOString()}`;

      try {
        setIsEventsLoading(true);
        setIsAiLoading(true); // Set AI loading true at the start of the bulk fetch

        const response = await fetch(url, {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch bulk calendar data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Validate response with zod schema
        const validatedData = calendarApiResponseSchema.parse(data);

        // Parse dates which come as strings from JSON API
        const parsedEvents = validatedData.events.map((event) => ({
          ...event,
          datetime: new Date(event.datetime)
        }));

        const parsedCBEvents = validatedData.centralBankEvents.map((event) => ({
          ...event,
          datetime: new Date(event.datetime)
        }));

        setEvents(parsedEvents);
        setCentralBankEvents(parsedCBEvents);
        setAiIntelligence(validatedData.intelligence || null);
        setCorrelations((validatedData.correlations || []) as Correlation[]);

      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled, this is expected behavior
          return;
        }

        // Show user-friendly error toast
        toast.error('Failed to load calendar data. Using cached data instead.');

        // Fallback to mock data
        setEvents(mockEconomicEvents);
        setCentralBankEvents(mockCentralBankEvents);
        setAiIntelligence(null);
        setCorrelations([]);
      } finally {
        setIsEventsLoading(false);
        setIsAiLoading(false);
      }
    };

    fetchEvents();

    return () => abortController.abort();
  }, []);

  // Handle mobile layout changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setIntelPanelOpen(false);
    } else {
      setSidebarOpen(true);
      setIntelPanelOpen(window.innerWidth >= 1536); // Auto open on 2xl+
    }
  }, [isMobile]);

  // Handle deep linking to events
  useEffect(() => {
    if (selectedEventId && events.length > 0) {
      const event = events.find(e => e.id === selectedEventId);
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, [selectedEventId, events]);

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
    updateFilters(newFilters);
  };

  const handleEventClick = (event: EconomicEvent) => {
    setSelectedEvent(event);
    updateSelectedEvent(event.id);
  };

  const handleEventClose = () => {
    setSelectedEvent(null);
    updateSelectedEvent(null);
  };

  if (isEventsLoading) {
    return (
      <CalendarLoadingState
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        intelPanelOpen={intelPanelOpen}
      />
    );
  }

  return (
    <div id="main-content" className="h-screen flex flex-col bg-background selection:bg-primary/10 transition-colors duration-300">
      <CalendarHeader
        highImpactCount={highImpactCount}
        totalEvents={filteredEvents.length}
        isMobile={isMobile}
      />

      <main className="flex-1 flex overflow-hidden relative pb-16 md:pb-0">
        <CalendarSidebar
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          events={events}
          mobileTab={mobileTab}
        />

        <CalendarMain
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(prev => !prev)}
          intelPanelOpen={intelPanelOpen}
          onIntelPanelToggle={() => setIntelPanelOpen(prev => !prev)}
          filteredEvents={filteredEvents}
          onEventClick={handleEventClick}
          isMobile={isMobile}
          mobileTab={mobileTab}
        />

        <CalendarIntelligencePanel
          intelPanelOpen={intelPanelOpen}
          onIntelPanelToggle={() => setIntelPanelOpen(prev => !prev)}
          isMobile={isMobile}
          mobileTab={mobileTab}
          centralBankEvents={centralBankEvents}
          aiIntelligence={aiIntelligence}
          isAiLoading={isAiLoading}
          correlations={correlations}
        />

        {isMobile && (
          <CalendarMobileNav
            mobileTab={mobileTab}
            onTabChange={setMobileTab}
            onIntelPanelToggle={() => setIntelPanelOpen(true)}
          />
        )}

        {selectedEvent && (
          <EventIntelligencePanel
            event={selectedEvent}
            onClose={handleEventClose}
          />
        )}
      </main>
    </div>
  );
}

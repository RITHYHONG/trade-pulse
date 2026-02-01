import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from './components/economic-calendar/types';

const STORAGE_KEY = 'calendar-filters';
const EVENT_ID_KEY = 'event';

export function useCalendarState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL or localStorage
  const [filters, setFilters] = useState<FilterState>(() => {
    // First try URL params
    const urlFilters = parseFiltersFromURL(searchParams);
    if (urlFilters) return urlFilters;

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return { ...JSON.parse(stored), customRange: undefined }; // Don't persist customRange
        } catch (e) {
          console.warn('Failed to parse stored filters:', e);
        }
      }
    }

    // Default filters
    return {
      dateRange: 'week',
      impacts: ['high', 'medium', 'low'],
      regions: ['US', 'EU', 'UK', 'Asia', 'EM'],
      categories: [],
      searchQuery: '',
      highImpactOnly: false,
      viewPreset: 'custom'
    };
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>(() => {
    return searchParams.get(EVENT_ID_KEY);
  });

  // Update URL when filters change
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };

      // Update localStorage
      if (typeof window !== 'undefined') {
        const toStore = { ...updated };
        delete toStore.customRange; // Don't store customRange
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      }

      return updated;
    });
  }, []);

  // Update selected event in URL
  const updateSelectedEvent = useCallback((eventId: string | null) => {
    setSelectedEventId(eventId);
  }, []);

  // Effect to update URL when filters change
  useEffect(() => {
    // Don't update filters in URL if an event is selected
    if (selectedEventId) return;

    const params = new URLSearchParams(searchParams.toString());
    serializeFiltersToURL(filters, params);
    const newUrl = `?${params.toString()}`;

    // Only update if the URL would actually change
    if (newUrl !== `?${searchParams.toString()}`) {
      router.replace(newUrl, { scroll: false });
    }
  }, [filters, router, searchParams, selectedEventId]);

  // Effect to update URL when selected event changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedEventId) {
      params.set(EVENT_ID_KEY, selectedEventId);
      // Remove filter params when event is selected for cleaner URLs
      params.delete('dateRange');
      params.delete('impacts');
      params.delete('regions');
      params.delete('categories');
      params.delete('searchQuery');
      params.delete('highImpactOnly');
      params.delete('viewPreset');
    } else {
      params.delete(EVENT_ID_KEY);
    }

    const newUrl = `?${params.toString()}`;

    // Only update if the URL would actually change
    if (newUrl !== `?${searchParams.toString()}`) {
      router.replace(newUrl, { scroll: false });
    }
  }, [selectedEventId, router, searchParams]);

  return {
    filters,
    updateFilters,
    selectedEventId,
    updateSelectedEvent
  };
}

function parseFiltersFromURL(searchParams: URLSearchParams): FilterState | null {
  const dateRange = searchParams.get('dateRange') as FilterState['dateRange'];
  const impacts = searchParams.get('impacts')?.split(',') as FilterState['impacts'];
  const regions = searchParams.get('regions')?.split(',') as FilterState['regions'];
  const categories = searchParams.get('categories')?.split(',') as FilterState['categories'];
  const searchQuery = searchParams.get('searchQuery') || '';
  const highImpactOnly = searchParams.get('highImpactOnly') === 'true';
  const viewPreset = (searchParams.get('viewPreset') as FilterState['viewPreset']) || 'custom';

  if (!dateRange) return null;

  return {
    dateRange,
    impacts: impacts || ['high', 'medium', 'low'],
    regions: regions || ['US', 'EU', 'UK', 'Asia', 'EM'],
    categories: categories || [],
    searchQuery,
    highImpactOnly,
    viewPreset
  };
}

function serializeFiltersToURL(filters: FilterState, params: URLSearchParams) {
  // Only add non-default values to keep URLs clean
  const defaults = {
    dateRange: 'week',
    impacts: ['high', 'medium', 'low'],
    regions: ['US', 'EU', 'UK', 'Asia', 'EM'],
    categories: [],
    searchQuery: '',
    highImpactOnly: false,
    viewPreset: 'custom'
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'customRange') return; // Don't serialize customRange

    const defaultValue = defaults[key as keyof typeof defaults];
    const isDefault = Array.isArray(value)
      ? value.length === defaultValue.length && [...value].sort().every((v, i) => v === [...defaultValue].sort()[i])
      : value === defaultValue;

    if (!isDefault) {
      if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, String(value));
      }
    } else {
      params.delete(key);
    }
  });
}
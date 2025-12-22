import { EconomicEvent, Region } from './types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatMapViewProps {
  events: EconomicEvent[];
  onEventClick: (event: EconomicEvent) => void;
  isLoading?: boolean;
}

export function HeatMapView({ events, onEventClick, isLoading = false }: HeatMapViewProps) {
  // Group events by hour and region
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const regions: Region[] = ['US', 'EU', 'UK', 'Asia', 'EM'];

  // Create heat map data structure
  const heatMapData: Record<string, EconomicEvent[]> = {};
  
  events.forEach(event => {
    const hour = event.datetime.getHours();
    const key = `${hour}-${event.region}`;
    if (!heatMapData[key]) heatMapData[key] = [];
    heatMapData[key].push(event);
  });

  // Calculate intensity for each cell
  const getIntensity = (eventsInCell: EconomicEvent[]) => {
    if (!eventsInCell || eventsInCell.length === 0) return 0;
    
    const totalImpact = eventsInCell.reduce((sum, event) => {
      const impactScore = event.impact === 'high' ? 3 : event.impact === 'medium' ? 2 : 1;
      return sum + impactScore;
    }, 0);
    
    return totalImpact / eventsInCell.length;
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-muted';
    if (intensity >= 2.5) return 'bg-rose-600';
    if (intensity >= 2) return 'bg-rose-500';
    if (intensity >= 1.5) return 'bg-orange-500';
    if (intensity >= 1) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const regionLabels = {
    US: 'United States',
    EU: 'European Union',
    UK: 'United Kingdom',
    Asia: 'Asia Pacific',
    EM: 'Emerging Markets'
  };

  if (isLoading) {
    const hours = Array.from({ length: 12 }, (_, i) => 8 + i);
    const regions: Region[] = ['US', 'EU', 'UK', 'Asia', 'EM'];
    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Heat Map View</h3>
          </div>

          <div className="bg-card rounded-xl p-4 overflow-x-auto border border-border shadow-sm">
            <div className="min-w-max">
              <div className="flex mb-2">
                <div className="w-32 flex-shrink-0" />
                {hours.map(hour => (
                  <div key={hour} className="w-12 text-center">
                    <div className="h-3 w-10 bg-muted rounded-md mx-auto animate-pulse" />
                  </div>
                ))}
              </div>

              {regions.map(region => (
                <div key={region} className="flex mb-1">
                  <div className="w-32 flex-shrink-0 flex items-center pr-4">
                    <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
                  </div>
                  {hours.map(hour => (
                    <div key={hour} className="w-12 h-12 m-0.5 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Heat Map View</h3>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">Intensity:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-emerald-500 rounded" />
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-amber-500 rounded" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-500 rounded" />
              <span className="text-xs text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-rose-600 rounded" />
              <span className="text-xs text-muted-foreground">Extreme</span>
            </div>
          </div>
        </div>

        {/* Heat Map Grid */}
        <div className="bg-card rounded-xl p-4 overflow-x-auto border border-border shadow-sm">
          <TooltipProvider>
            <div className="min-w-max">
              {/* Header Row */}
              <div className="flex mb-2">
                <div className="w-32 flex-shrink-0" /> {/* Empty corner */}
                {hours.map(hour => (
                  <div key={hour} className="w-12 text-center">
                    <div className="text-xs text-muted-foreground">
                      {hour.toString().padStart(2, '0')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {regions.map(region => (
                <div key={region} className="flex mb-1">
                  {/* Region Label */}
                  <div className="w-32 flex-shrink-0 flex items-center pr-4">
                    <span className="text-sm text-foreground">{regionLabels[region]}</span>
                  </div>

                  {/* Hour Cells */}
                  {hours.map(hour => {
                    const key = `${hour}-${region}`;
                    const cellEvents = heatMapData[key] || [];
                    const intensity = getIntensity(cellEvents);
                    const color = getIntensityColor(intensity);
                    const hasEvents = cellEvents.length > 0;

                    return (
                      <Tooltip key={hour}>
                        <TooltipTrigger asChild>
                          <div
                            className={`
                              w-12 h-12 m-0.5 rounded-lg ${color}
                              ${hasEvents ? 'cursor-pointer hover:ring-2 hover:ring-primary transition-all' : ''}
                              flex items-center justify-center
                            `}
                            onClick={() => hasEvents && cellEvents.length === 1 && onEventClick(cellEvents[0])}
                          >
                            {hasEvents && (
                              <span className="text-xs text-white font-medium">
                                {cellEvents.length}
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        {hasEvents && (
                          <TooltipContent 
                            side="right" 
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-0 max-w-sm"
                          >
                            <div className="p-3">
                              <div className="text-xs text-slate-400 mb-2">
                                {hour.toString().padStart(2, '0')}:00 • {regionLabels[region]}
                              </div>
                              <div className="space-y-2">
                                {cellEvents.map(event => (
                                  <div 
                                    key={event.id}
                                    className="text-sm cursor-pointer hover:text-blue-400 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEventClick(event);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className={`w-2 h-2 rounded-full ${
                                        event.impact === 'high' ? 'bg-rose-500' :
                                        event.impact === 'medium' ? 'bg-amber-500' :
                                        'bg-emerald-500'
                                      }`} />
                                      <span className="text-foreground">{event.name}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground ml-4">
                                      {event.country} • {event.consensus}{event.unit}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Hotspot Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {/* Calculate hotspots */}
          {(() => {
            const hotspots = Object.entries(heatMapData)
              .map(([key, events]) => ({
                key,
                events,
                intensity: getIntensity(events),
                hour: parseInt(key.split('-')[0]),
                region: key.split('-')[1] as Region
              }))
              .filter(h => h.intensity >= 2)
              .sort((a, b) => b.intensity - a.intensity)
              .slice(0, 3);

            return hotspots.map((hotspot, index) => (
              <div key={hotspot.key} className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Hotspot #{index + 1}</span>
                </div>
                <div className="text-foreground font-medium mb-1">
                  {hotspot.hour.toString().padStart(2, '0')}:00 • {regionLabels[hotspot.region]}
                </div>
                <div className="text-xs text-muted-foreground">
                  {hotspot.events.length} events • High volatility expected
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </ScrollArea>
  );
}

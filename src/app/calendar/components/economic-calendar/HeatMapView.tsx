import { EconomicEvent, Region } from './types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeatMapViewProps {
  events: EconomicEvent[];
  onEventClick: (event: EconomicEvent) => void;
}

export function HeatMapView({ events, onEventClick }: HeatMapViewProps) {
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
    if (intensity === 0) return 'bg-slate-900';
    if (intensity >= 2.5) return 'bg-red-600';
    if (intensity >= 2) return 'bg-red-500';
    if (intensity >= 1.5) return 'bg-orange-500';
    if (intensity >= 1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const regionLabels = {
    US: 'United States',
    EU: 'European Union',
    UK: 'United Kingdom',
    Asia: 'Asia Pacific',
    EM: 'Emerging Markets'
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg text-white">Heat Map View</h3>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-400">Intensity:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-xs text-slate-400">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-xs text-slate-400">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-500 rounded" />
              <span className="text-xs text-slate-400">High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-600 rounded" />
              <span className="text-xs text-slate-400">Extreme</span>
            </div>
          </div>
        </div>

        {/* Heat Map Grid */}
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <TooltipProvider>
            <div className="min-w-max">
              {/* Header Row */}
              <div className="flex mb-2">
                <div className="w-32 flex-shrink-0" /> {/* Empty corner */}
                {hours.map(hour => (
                  <div key={hour} className="w-12 text-center">
                    <div className="text-xs text-slate-400">
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
                    <span className="text-sm text-slate-300">{regionLabels[region]}</span>
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
                              w-12 h-12 m-0.5 rounded ${color}
                              ${hasEvents ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all' : ''}
                              flex items-center justify-center
                            `}
                            onClick={() => hasEvents && cellEvents.length === 1 && onEventClick(cellEvents[0])}
                          >
                            {hasEvents && (
                              <span className="text-xs text-white/90">
                                {cellEvents.length}
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        {hasEvents && (
                          <TooltipContent 
                            side="right" 
                            className="bg-slate-800 border-slate-700 p-0 max-w-sm"
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
                                        event.impact === 'high' ? 'bg-red-500' :
                                        event.impact === 'medium' ? 'bg-orange-500' :
                                        'bg-green-500'
                                      }`} />
                                      <span className="text-white">{event.name}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 ml-4">
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
              <div key={hotspot.key} className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-slate-400">Hotspot #{index + 1}</span>
                </div>
                <div className="text-white mb-1">
                  {hotspot.hour.toString().padStart(2, '0')}:00 • {regionLabels[hotspot.region]}
                </div>
                <div className="text-xs text-slate-400">
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

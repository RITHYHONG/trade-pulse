import { EconomicEvent, Region } from './types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame, Clock, MapPin, Zap } from 'lucide-react';
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

  const getIntensityStyles = (intensity: number) => {
    if (intensity === 0) return {
      bg: 'bg-gradient-to-br from-slate-800/40 to-slate-900/40 dark:from-slate-700/20 dark:to-slate-800/20',
      border: 'border-slate-600/20',
      text: 'text-muted-foreground',
      glow: ''
    };
    if (intensity >= 2.5) return {
      bg: 'bg-gradient-to-br from-red-500 to-rose-600',
      border: 'border-red-400/60',
      text: 'text-white font-bold',
      glow: 'shadow-lg shadow-red-500/40'
    };
    if (intensity >= 2) return {
      bg: 'bg-gradient-to-br from-orange-500 to-red-500',
      border: 'border-orange-400/50',
      text: 'text-white font-semibold',
      glow: 'shadow-md shadow-orange-500/30'
    };
    if (intensity >= 1.5) return {
      bg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      border: 'border-amber-400/50',
      text: 'text-white font-medium',
      glow: 'shadow-md shadow-amber-500/25'
    };
    if (intensity >= 1) return {
      bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      border: 'border-yellow-400/50',
      text: 'text-slate-900 font-medium',
      glow: 'shadow-sm shadow-yellow-500/20'
    };
    return {
      bg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      border: 'border-emerald-400/50',
      text: 'text-white font-medium',
      glow: 'shadow-sm shadow-emerald-500/20'
    };
  };

  const regionLabels = {
    US: 'United States',
    EU: 'European Union',
    UK: 'United Kingdom',
    Asia: 'Asia Pacific',
    EM: 'Emerging Markets'
  };

  const intensityLegend = [
    { label: 'Low', color: 'bg-gradient-to-r from-emerald-400 to-teal-500', intensity: 0.5 },
    { label: 'Medium', color: 'bg-gradient-to-r from-yellow-400 to-amber-500', intensity: 1 },
    { label: 'High', color: 'bg-gradient-to-r from-orange-500 to-red-500', intensity: 1.5 },
    { label: 'Extreme', color: 'bg-gradient-to-r from-red-500 to-rose-600', intensity: 2.5 }
  ];

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
            <div>
              <h3 className="text-lg font-semibold text-foreground">Heat Map View</h3>
              <p className="text-xs text-muted-foreground">Loading market volatility data...</p>
            </div>
          </div>

          <div className="bg-card/50 p-5 rounded-xl border border-border/30 backdrop-blur-sm overflow-x-auto">
            <div className="min-w-max">
              <div className="flex mb-4">
                <div className="w-32 flex-shrink-0" />
                {hours.map(hour => (
                  <div key={hour} className="w-12 text-center">
                    <div className="h-3 w-10 bg-muted/50 rounded-md mx-auto animate-pulse" />
                  </div>
                ))}
              </div>

              {regions.map(region => (
                <div key={region} className="flex mb-2">
                  <div className="w-32 flex-shrink-0 flex items-center pr-4">
                    <div className="h-4 w-24 bg-muted/50 rounded-md animate-pulse" />
                  </div>
                  {hours.map(hour => (
                    <div key={hour} className="w-12 h-12 m-0.5 rounded-lg bg-muted/50 animate-pulse" />
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
          <div>
            <h3 className="text-lg font-semibold text-foreground">Heat Map View</h3>
            <p className="text-xs text-muted-foreground">Market volatility by time and region</p>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Intensity:</span>
            <div className="flex items-center gap-3">
              {intensityLegend.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full ring-1 ring-border/50`} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heat Map Grid */}
        <div className="bg-card/50 p-5 rounded-xl border border-border/30 backdrop-blur-sm overflow-x-auto">
          <TooltipProvider>
            <div className="min-w-max">
              {/* Header Row */}
              <div className="flex mb-4">
                <div className="w-32 flex-shrink-0" /> {/* Empty corner */}
                {hours.map(hour => (
                  <div key={hour} className="w-12 text-center">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {hour.toString().padStart(2, '0')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {regions.map(region => (
                <div key={region} className="flex mb-2">
                  {/* Region Label */}
                  <div className="w-32 flex-shrink-0 flex items-center pr-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{regionLabels[region]}</span>
                    </div>
                  </div>

                  {/* Hour Cells */}
                  {hours.map(hour => {
                    const key = `${hour}-${region}`;
                    const cellEvents = heatMapData[key] || [];
                    const intensity = getIntensity(cellEvents);
                    const styles = getIntensityStyles(intensity);
                    const hasEvents = cellEvents.length > 0;

                    return (
                      <Tooltip key={hour}>
                        <TooltipTrigger asChild>
                          <div
                            className={`
                              w-12 h-12 m-0.5 rounded-lg ${styles.bg} ${styles.border} border
                              ${hasEvents ? 'cursor-pointer hover:scale-110 hover:ring-2 hover:ring-primary/50 transition-all duration-200' : ''}
                              flex items-center justify-center ${styles.glow}
                              ${hasEvents ? 'shadow-lg' : ''}
                            `}
                            onClick={() => hasEvents && cellEvents.length === 1 && onEventClick(cellEvents[0])}
                          >
                            {hasEvents && (
                              <span className={`text-xs font-bold ${styles.text}`}>
                                {cellEvents.length}
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        {hasEvents && (
                          <TooltipContent
                            side="right"
                            className="bg-card/95 backdrop-blur-xl border border-border/50 p-0 max-w-sm shadow-2xl"
                          >
                            <div className="p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">
                                  {hour.toString().padStart(2, '0')}:00 • {regionLabels[region]}
                                </span>
                              </div>
                              <div className="space-y-3">
                                {cellEvents.map(event => (
                                  <div
                                    key={event.id}
                                    className="p-3 bg-muted/30 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEventClick(event);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className={`w-2 h-2 rounded-full ${
                                        event.impact === 'high' ? 'bg-rose-500' :
                                        event.impact === 'medium' ? 'bg-amber-500' :
                                        'bg-emerald-500'
                                      }`} />
                                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        {event.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <span>{event.country}</span>
                                      <span>•</span>
                                      <span className="font-medium text-foreground">{event.consensus}{event.unit}</span>
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
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Volatility Hotspots</h3>
              <p className="text-xs text-muted-foreground">High-impact time periods</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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

              return hotspots.length > 0 ? hotspots.map((hotspot, index) => (
                <div
                  key={hotspot.key}
                  className="bg-card/50 p-4 rounded-xl border border-border/30 backdrop-blur-sm hover:bg-card/70 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                      <Flame className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/5">
                      Hotspot #{index + 1}
                    </Badge>
                  </div>
                  <div className="text-foreground font-medium mb-2 group-hover:text-primary transition-colors">
                    {hotspot.hour.toString().padStart(2, '0')}:00 • {regionLabels[hotspot.region]}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{hotspot.events.length} events</span>
                    <span>•</span>
                    <span>High volatility expected</span>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 bg-muted/30 p-6 rounded-xl border border-border/30 text-center">
                  <div className="text-muted-foreground">
                    <Flame className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No volatility hotspots detected</p>
                    <p className="text-xs mt-1">Market conditions appear calm</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

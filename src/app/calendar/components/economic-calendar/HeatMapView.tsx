import { EconomicEvent, Region } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HeatMapViewProps {
  events: EconomicEvent[];
  onEventClick: (event: EconomicEvent) => void;
  isLoading?: boolean;
}

export function HeatMapView({ events, onEventClick, isLoading = false }: HeatMapViewProps) {
  // Group events by hour and region
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const regions: Region[] = ['US', 'EU', 'UK', 'Asia', 'EM'];

  const impactStyles = {
    high: 'bg-rose-500 border-rose-500/30',
    medium: 'bg-amber-500 border-amber-500/30',
    low: 'bg-emerald-500 border-emerald-500/30'
  };

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
    if (intensity === 0) return 'bg-muted/10';
    if (intensity >= 2.5) return 'bg-rose-500/90 shadow-sm shadow-rose-500/20';
    if (intensity >= 2) return 'bg-rose-500/70';
    if (intensity >= 1.5) return 'bg-amber-500/70';
    if (intensity >= 1) return 'bg-amber-500/50';
    return 'bg-emerald-500/50';
  };

  const regionLabels = {
    US: 'United States',
    EU: 'European Union',
    UK: 'United Kingdom',
    Asia: 'Asia Pacific',
    EM: 'Emerging Markets'
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-xl" />
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 min-w-[800px]">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Economic Calendar Heatmap</h3>
          <p className="text-sm text-muted-foreground">Visualize event density and impact across regions and time</p>
        </div>

        {/* Legend */}
        <div className="mb-6 flex items-center justify-center gap-6 bg-card/30 p-3 rounded-lg border border-border/40">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Intensity Levels</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-emerald-500/50 rounded-sm border border-emerald-500/30" />
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-amber-500/50 rounded-sm border border-amber-500/30" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-rose-500/70 rounded-sm border border-rose-500/30" />
              <span className="text-xs text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-rose-500/90 rounded-sm border border-rose-500/30 shadow-sm shadow-rose-500/20" />
              <span className="text-xs text-muted-foreground">Extreme</span>
            </div>
          </div>
        </div>

        {/* Heat Map Grid */}
        <div className="bg-card/50 rounded-xl p-6 border border-border/40 overflow-x-auto">
          <TooltipProvider>
            <div className="min-w-max">
              {/* Header Row */}
              <div className="flex mb-2">
                <div className="w-32 flex-shrink-0" /> {/* Empty corner */}
                {hours.map(hour => (
                  <div key={hour} className="w-10 text-center">
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {hour.toString().padStart(2, '0')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {regions.map(region => (
                <div key={region} className="flex mb-1.5 items-center">
                  {/* Region Label */}
                  <div className="w-32 flex-shrink-0 flex items-center pr-4">
                    <span className="text-xs font-medium text-foreground/80">{regionLabels[region]}</span>
                  </div>

                  {/* Hour Cells */}
                  {hours.map(hour => {
                    const key = `${hour}-${region}`;
                    const cellEvents = heatMapData[key] || [];
                    const intensity = getIntensity(cellEvents);
                    const color = getIntensityColor(intensity);
                    const hasEvents = cellEvents.length > 0;

                    return (
                      <Tooltip key={hour} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.15, zIndex: 10 }}
                            className={cn(
                              "w-10 h-10 m-0.5 rounded-md transition-all duration-300 flex items-center justify-center border border-transparent hover:border-border/50 relative overflow-hidden group/cell",
                              color,
                              hasEvents ? "cursor-pointer hover:shadow-lg hover:shadow-black/10" : "opacity-40"
                            )}
                            onClick={() => hasEvents && cellEvents.length === 1 && onEventClick(cellEvents[0])}
                          >
                            {/* Shimmer Effect for High Intensity */}
                            {intensity >= 2 && (
                              <motion.div
                                animate={{
                                  x: ["-100%", "200%"]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "linear"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                              />
                            )}

                            {hasEvents && (
                              <span className="text-[10px] text-white/90 font-bold relative z-10">
                                {cellEvents.length}
                              </span>
                            )}
                          </motion.div>
                        </TooltipTrigger>
                        {hasEvents && (
                          <TooltipContent
                            side="top"
                            className="bg-popover/95 backdrop-blur-sm border-border p-0 w-64 shadow-xl rounded-xl overflow-hidden"
                          >
                            <div className="p-3 bg-muted/30 border-b border-border/50">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-foreground">
                                  {regionLabels[region]}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  {hour.toString().padStart(2, '0')}:00
                                </span>
                              </div>
                            </div>
                            <div className="p-2 space-y-1">
                              {cellEvents.map(event => (
                                <div
                                  key={event.id}
                                  className="p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEventClick(event);
                                  }}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{event.name}</span>
                                    <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5",
                                      impactStyles[event.impact].split(' ')[0]
                                    )} />
                                  </div>
                                  <div className="text-[10px] text-muted-foreground mt-1 flex justify-between">
                                    <span>{event.country}</span>
                                    <span className="font-mono">Exp: {event.consensus}{event.unit}</span>
                                  </div>
                                </div>
                              ))}
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

        {/* Hotspot Summary - Minimalist Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div key={hotspot.key} className="bg-card/40 p-4 rounded-xl border border-border/40 hover:bg-card/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">High Volatility Area</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-mono font-medium text-foreground">{hotspot.hour.toString().padStart(2, '0')}:00</span>
                  <span className="text-sm text-foreground">{regionLabels[hotspot.region]}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {hotspot.events.length} high-impact events clustered
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </ScrollArea>
  );
}

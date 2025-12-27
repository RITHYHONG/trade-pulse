import { EconomicEvent } from './types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TimelineViewProps {
  events: EconomicEvent[];
  onEventClick: (event: EconomicEvent) => void;
  isLoading?: boolean;
}

export function TimelineView({ events, onEventClick, isLoading = false }: TimelineViewProps) {
  // Group events by hour
  const eventsByHour = events.reduce((acc, event) => {
    const hour = event.datetime.getHours();
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(event);
    return acc;
  }, {} as Record<number, EconomicEvent[]>);

  // Create timeline hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const impactStyles = {
    high: 'bg-rose-500 border-rose-500/30',
    medium: 'bg-amber-500 border-amber-500/30',
    low: 'bg-emerald-500 border-emerald-500/30'
  };

  const impactBorder = {
    high: 'border-rose-500/30',
    medium: 'border-amber-500/30',
    low: 'border-emerald-500/30'
  };

  const sentimentGlow = {
    bullish: 'group-hover/card:shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover/card:border-emerald-500/30',
    bearish: 'group-hover/card:shadow-[0_0_15px_rgba(244,63,94,0.1)] group-hover/card:border-rose-500/30',
    neutral: 'group-hover/card:shadow-[0_0_15px_rgba(229,87,63,0.1)] group-hover/card:border-primary/30'
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4">
            <div className="w-16 h-4 bg-muted/20 animate-pulse rounded" />
            <div className="flex-1 h-24 bg-muted/20 animate-pulse rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6 max-w-4xl mx-auto relative">
        {/* Current Time Indicator Line */}
        <div className="absolute left-[79px] top-6 bottom-6 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent z-0 pointer-events-none" />

        {/* Timeline Grid */}
        <div className="space-y-1 relative z-10">
          {hours.map(hour => {
            const hourEvents = eventsByHour[hour] || [];
            const hasEvents = hourEvents.length > 0;

            if (!hasEvents) return null; // Skip empty hours for minimal look

            return (
              <div key={hour} className="flex items-start gap-4 md:gap-6 group">
                {/* Time Label */}
                <div className="w-16 flex-shrink-0 pt-4 text-right">
                  <div className="text-sm font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                </div>

                {/* Timeline Track */}
                <div className="flex-1 pb-8 relative border-l border-border/40 pl-6 md:pl-8">
                  {/* Active Dot */}
                  <div className="absolute -left-[5px] top-[22px] w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary transition-colors border-2 border-background" />

                  {/* Events */}
                  <div className="space-y-3">
                    {hourEvents.map((event, eventIdx) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: eventIdx * 0.1 }}
                        onClick={() => onEventClick(event)}
                        className={cn(
                          "relative bg-card hover:bg-card/80 border border-border/40 rounded-xl p-4 cursor-pointer transition-all duration-300 group/card overflow-hidden",
                          sentimentGlow[event.historicalData.directionBias],
                          "hover:-translate-y-0.5"
                        )}
                      >
                        {/* Dynamic Background Glow */}
                        <div className={cn(
                          "absolute inset-0 opacity-10 transition-opacity duration-500",
                          impactStyles[event.impact].split(' ')[0]
                        )} />
                        <div className={cn(
                          "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl opacity-100 transition-opacity",
                          impactStyles[event.impact].split(' ')[0]
                        )} />

                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", impactStyles[event.impact].split(' ')[0])} />
                              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                {event.impact} Impact
                              </span>
                              <span className="text-[10px] text-muted-foreground px-1">•</span>
                              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                {event.country}
                              </span>
                            </div>

                            <h4 className="font-semibold text-foreground group-hover/card:text-primary transition-colors">
                              {event.name}
                            </h4>

                            <div className="flex items-center gap-3 pt-1">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-mono">
                                  {event.datetime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-[10px] h-5 bg-secondary/50 font-normal">
                                {event.category}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Expected Move</div>
                            <div className="text-sm font-mono font-medium text-foreground">
                              ±{event.tradingSetup.expectedMove}%
                            </div>
                            <div className="mt-2 flex justify-end">
                              <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/50 group-hover/card:text-primary transition-colors" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}

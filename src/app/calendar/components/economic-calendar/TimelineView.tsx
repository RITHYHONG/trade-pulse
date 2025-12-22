import { EconomicEvent } from './types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, MapPin } from 'lucide-react';

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

  const impactColor = {
    high: 'bg-rose-500',
    medium: 'bg-amber-500',
    low: 'bg-emerald-500'
  };

  const impactBorder = {
    high: 'border-rose-500',
    medium: 'border-amber-500',
    low: 'border-emerald-500'
  };

  const regionColor = {
    US: 'bg-blue-500',
    EU: 'bg-amber-500',
    UK: 'bg-purple-500',
    Asia: 'bg-pink-500',
    EM: 'bg-emerald-500'
  };

  if (isLoading) {
    const hours = [8, 9, 10, 11, 12];
    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Timeline View</h3>
          </div>

          <div className="space-y-1">
            {hours.map(hour => (
              <div key={hour} className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0 pt-2">
                    <div className="h-4 w-12 bg-muted rounded-md animate-pulse" />
                </div>
                <div className="flex-1 min-h-[60px] relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1" />
                  <div className="pl-6 py-2">
                    <div className="h-8rounded-md p-3 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        {/* Timeline Header */}
        <div className="mb-6 flex items-center gap-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">Timeline View</h3>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-xs text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="space-y-1">
          {hours.map(hour => {
            const hourEvents = eventsByHour[hour] || [];
            const hasEvents = hourEvents.length > 0;

            return (
              <div key={hour} className="flex items-start gap-4">
                {/* Time Label */}
                <div className="w-20 flex-shrink-0 pt-2">
                  <div className={`text-sm ${hasEvents ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                </div>

                {/* Timeline Track */}
                <div className="flex-1 min-h-[60px] relative">
                  {/* Background line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-border" />

                  {/* Events */}
                  {hasEvents && (
                    <div className="pl-6 space-y-2 py-2">
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick(event)}
                          className={`
                            relative bg-card border-l-4 ${impactBorder[event.impact]}
                            rounded-r-xl p-3 cursor-pointer border border-border
                            hover:bg-muted/50 transition-all hover:shadow-md
                            group
                          `}
                        >
                          {/* Connection dot */}
                          <div className={`absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${impactColor[event.impact]} ring-4 ring-background`} />

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={`${regionColor[event.region]} text-xs`}>
                                  {event.region}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-border">
                                  {event.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {event.datetime.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                              <h4 className="text-foreground mb-1 group-hover:text-primary transition-colors">
                                {event.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{event.country}</span>
                                <span>•</span>
                                <span>Expected: {event.consensus}{event.unit}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground mb-1">Expected Move</div>
                              <div className="text-lg text-primary font-semibold">
                                ±{event.tradingSetup.expectedMove}%
                              </div>
                            </div>
                          </div>

                          {/* Strategy Tag */}
                          <div className="mt-2 pt-2 border-t border-border">
                            <div className="text-xs text-muted-foreground">
                              {event.tradingSetup.strategyTag}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}

import { EconomicEvent } from './types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, MapPin, Target, Activity, Zap } from 'lucide-react';

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

  const getImpactStyles = (impact: string) => {
    return {
      high: {
        bg: 'bg-gradient-to-br from-rose-500/15 to-red-600/15',
        border: 'border-rose-500',
        text: 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]',
        dot: 'bg-gradient-to-br from-rose-400 to-red-500 shadow-lg shadow-rose-500/50',
        ring: 'ring-rose-500/30'
      },
      medium: {
        bg: 'bg-gradient-to-br from-amber-500/15 to-orange-500/15',
        border: 'border-amber-500',
        text: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]',
        dot: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/50',
        ring: 'ring-amber-500/30'
      },
      low: {
        bg: 'bg-gradient-to-br from-emerald-500/15 to-teal-500/15',
        border: 'border-emerald-500',
        text: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]',
        dot: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/50',
        ring: 'ring-emerald-500/30'
      }
    }[impact] || {
      bg: 'bg-muted/50',
      border: 'border-border',
      text: 'text-muted-foreground',
      dot: 'bg-muted',
      ring: 'ring-border/50'
    };
  };

  const getRegionStyles = (region: string) => {
    return {
      US: {
        bg: 'bg-gradient-to-br from-blue-500/15 to-cyan-500/15',
        border: 'border-blue-500/30',
        text: 'text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]'
      },
      EU: {
        bg: 'bg-gradient-to-br from-yellow-500/15 to-amber-500/15',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400 drop-shadow-[0_0_6px_rgba(234,179,8,0.4)]'
      },
      UK: {
        bg: 'bg-gradient-to-br from-purple-500/15 to-violet-500/15',
        border: 'border-purple-500/30',
        text: 'text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]'
      },
      Asia: {
        bg: 'bg-gradient-to-br from-pink-500/15 to-rose-500/15',
        border: 'border-pink-500/30',
        text: 'text-pink-400 drop-shadow-[0_0_6px_rgba(236,72,153,0.4)]'
      },
      EM: {
        bg: 'bg-gradient-to-br from-emerald-500/15 to-teal-500/15',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]'
      }
    }[region] || {
      bg: 'bg-muted/50',
      border: 'border-border/50',
      text: 'text-muted-foreground'
    };
  };

  const impactLegend = [
    { label: 'High', color: 'bg-rose-500', impact: 'high' },
    { label: 'Medium', color: 'bg-amber-500', impact: 'medium' },
    { label: 'Low', color: 'bg-emerald-500', impact: 'low' }
  ];

  if (isLoading) {
    const hours = [8, 9, 10, 11, 12];
    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Timeline View</h3>
              <p className="text-xs text-muted-foreground">Loading economic events timeline...</p>
            </div>
          </div>

          <div className="space-y-4">
            {hours.map(hour => (
              <div key={hour} className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0 pt-2">
                  <div className="h-4 w-12 bg-muted/50 rounded-md animate-pulse" />
                </div>
                <div className="flex-1 min-h-[60px] relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-border/50 rounded-full" />
                  <div className="pl-6 py-2">
                    <div className="h-12 bg-muted/30 rounded-lg p-3 animate-pulse" />
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
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Timeline View</h3>
            <p className="text-xs text-muted-foreground">Economic events by time</p>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Impact:</span>
            <div className="flex items-center gap-3">
              {impactLegend.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color} ring-1 ring-border/50`} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="space-y-4">
          {hours.map(hour => {
            const hourEvents = eventsByHour[hour] || [];
            const hasEvents = hourEvents.length > 0;

            return (
              <div key={hour} className="flex items-start gap-4">
                {/* Time Label */}
                <div className="w-20 flex-shrink-0 pt-2">
                  <div className={`text-sm font-medium ${hasEvents ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                </div>

                {/* Timeline Track */}
                <div className="flex-1 min-h-[60px] relative">
                  {/* Background line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-border/50 rounded-full" />

                  {/* Events */}
                  {hasEvents && (
                    <div className="pl-6 space-y-3 py-2">
                      {hourEvents.map(event => {
                        const impactStyles = getImpactStyles(event.impact);
                        const regionStyles = getRegionStyles(event.region);

                        return (
                          <div
                            key={event.id}
                            onClick={() => onEventClick(event)}
                            className={`
                              relative bg-card/50 backdrop-blur-sm border-l-4 ${impactStyles.border}
                              rounded-xl p-4 cursor-pointer shadow-sm
                              hover:bg-card/70 hover:shadow-lg hover:scale-[1.02] transition-all duration-200
                              group border border-border/30
                            `}
                          >
                            {/* Connection dot */}
                            <div className={`absolute -left-[21px] top-6 w-4 h-4 rounded-full ${impactStyles.dot} ring-4 ring-background ${impactStyles.ring} shadow-lg`} />

                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`${regionStyles.bg} ${regionStyles.text} border-0 font-medium`}>
                                    {event.region}
                                  </Badge>
                                  <Badge variant="outline" className="border-border/50 bg-background/50 text-xs">
                                    {event.category}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{event.datetime.toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}</span>
                                  </div>
                                </div>
                                <h4 className="text-foreground font-semibold mb-2 group-hover:text-primary transition-colors">
                                  {event.name}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.country}</span>
                                  </div>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    <span>Expected: {event.consensus}{event.unit}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-2">
                                  <Activity className="w-4 h-4 text-amber-400" />
                                  <span className="text-xs text-muted-foreground font-medium">Expected Move</span>
                                </div>
                                <div className="text-xl font-bold text-amber-400 flex items-center gap-1">
                                  <Zap className="w-4 h-4" />
                                  ±{event.tradingSetup.expectedMove}%
                                </div>
                              </div>
                            </div>

                            {/* Strategy Tag */}
                            <div className="mt-3 pt-3 border-t border-border/30">
                              <div className="flex items-center gap-2">
                                <div className="p-1 rounded-md bg-primary/10 text-primary">
                                  <Activity className="w-3 h-3" />
                                </div>
                                <span className="text-sm text-muted-foreground font-medium">
                                  {event.tradingSetup.strategyTag}
                                </span>
                                <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 ml-auto">
                                  {event.tradingSetup.confidenceScore}% confidence
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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

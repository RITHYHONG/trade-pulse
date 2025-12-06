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
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-green-500'
  };

  const impactBorder = {
    high: 'border-red-500',
    medium: 'border-orange-500',
    low: 'border-green-500'
  };

  const regionColor = {
    US: 'bg-blue-600',
    EU: 'bg-yellow-600',
    UK: 'bg-purple-600',
    Asia: 'bg-red-600',
    EM: 'bg-green-600'
  };

  if (isLoading) {
    const hours = [8, 9, 10, 11, 12];
    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg text-white">Timeline View</h3>
          </div>

          <div className="space-y-1">
            {hours.map(hour => (
              <div key={hour} className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0 pt-2">
                  <div className="h-4 w-12 bg-slate-700 rounded-md animate-pulse" />
                </div>
                <div className="flex-1 min-h-[60px] relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800" />
                  <div className="pl-6 py-2">
                    <div className="h-8 bg-slate-800 rounded-md p-3 animate-pulse" />
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
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg text-white">Timeline View</h3>
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-slate-400">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-xs text-slate-400">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-slate-400">Low</span>
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
                  <div className={`text-sm ${hasEvents ? 'text-white' : 'text-slate-600'}`}>
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                </div>

                {/* Timeline Track */}
                <div className="flex-1 min-h-[60px] relative">
                  {/* Background line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800" />

                  {/* Events */}
                  {hasEvents && (
                    <div className="pl-6 space-y-2 py-2">
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick(event)}
                          className={`
                            relative bg-slate-900 border-l-4 ${impactBorder[event.impact]}
                            rounded-r-lg p-3 cursor-pointer
                            hover:bg-slate-800 transition-all hover:shadow-lg
                            group
                          `}
                        >
                          {/* Connection dot */}
                          <div className={`absolute -left-[29px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${impactColor[event.impact]} ring-4 ring-slate-950`} />

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={`${regionColor[event.region]} text-xs`}>
                                  {event.region}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-slate-700">
                                  {event.category}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {event.datetime.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                              <h4 className="text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {event.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <MapPin className="w-3 h-3" />
                                <span>{event.country}</span>
                                <span>•</span>
                                <span>Expected: {event.consensus}{event.unit}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-slate-500 mb-1">Expected Move</div>
                              <div className="text-lg text-orange-400">
                                ±{event.tradingSetup.expectedMove}%
                              </div>
                            </div>
                          </div>

                          {/* Strategy Tag */}
                          <div className="mt-2 pt-2 border-t border-slate-800">
                            <div className="text-xs text-slate-400">
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

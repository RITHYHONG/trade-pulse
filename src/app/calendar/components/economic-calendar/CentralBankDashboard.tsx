import { CentralBankEvent } from './types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building2, Calendar, User, TrendingUp, Clock, Target } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CentralBankDashboardProps {
  events: CentralBankEvent[];
}

export function CentralBankDashboard({ events }: CentralBankDashboardProps) {
  const upcomingEvents = events
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
    .slice(0, 4);

  const getTypeStyles = (type: string) => {
    return {
      meeting: {
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        border: 'border-rose-200 dark:border-rose-500/20',
        icon: 'text-rose-600 dark:text-rose-400',
        glow: 'shadow-sm hover:shadow-md'
      },
      speech: {
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-200 dark:border-blue-500/20',
        icon: 'text-blue-600 dark:text-blue-400',
        glow: 'shadow-sm hover:shadow-md'
      },
      minutes: {
        bg: 'bg-violet-50 dark:bg-violet-500/10',
        border: 'border-violet-200 dark:border-violet-500/20',
        icon: 'text-violet-600 dark:text-violet-400',
        glow: 'shadow-sm hover:shadow-md'
      }
    }[type] || {
      bg: 'bg-muted/50',
      border: 'border-border',
      icon: 'text-muted-foreground',
      glow: ''
    };
  };

  const getTypeIcon = (type: string) => {
    return {
      meeting: Building2,
      speech: User,
      minutes: Calendar
    }[type] || Calendar;
  };

  const getProbabilityColor = (action: 'cut' | 'hold' | 'hike') => {
    return {
      cut: 'text-emerald-600 dark:text-emerald-400',
      hold: 'text-blue-600 dark:text-blue-400',
      hike: 'text-rose-600 dark:text-rose-400'
    }[action];
  };

  const getProbabilityBg = (action: 'cut' | 'hold' | 'hike') => {
    return {
      cut: 'bg-emerald-50 dark:bg-emerald-500/10',
      hold: 'bg-blue-50 dark:bg-blue-500/10',
      hike: 'bg-rose-50 dark:bg-rose-500/10'
    }[action];
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Central Bank Watch</h3>
              <p className="text-xs text-muted-foreground">Policy decisions & speeches</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-primary/10 border-primary/30 text-primary px-3 py-1"
          >
            <Clock className="w-3 h-3 mr-1.5" />
            {events.length} Upcoming
          </Badge>
        </div>

        {/* Event Cards */}
        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const TypeIcon = getTypeIcon(event.type);
            const typeStyles = getTypeStyles(event.type);
            const hasProbabilities = event.rateProbabilities.cut + event.rateProbabilities.hold + event.rateProbabilities.hike > 0;

            return (
              <div
                key={event.id}
                className={`
                  group relative p-5 rounded-xl border transition-all duration-200
                  ${typeStyles.bg} ${typeStyles.border} ${typeStyles.glow}
                  hover:shadow-lg
                `}
              >

                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    p-3 rounded-xl transition-all duration-200
                    ${typeStyles.bg} ${typeStyles.icon} ring-1 ring-border/20
                  `}>
                    <TypeIcon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground truncate">
                            {event.bank}
                          </span>
                          <Badge
                            className={`
                              text-xs uppercase tracking-wider font-medium
                              ${typeStyles.bg} ${typeStyles.icon} border-0
                            `}
                          >
                            {event.type}
                          </Badge>
                        </div>

                        {event.speaker && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                            <User className="w-3.5 h-3.5" />
                            <span className="truncate">{event.speaker}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground mb-1">Time</div>
                        <div className="text-sm font-medium text-foreground">
                          {event.datetime.toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.datetime.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Rate Decision Probabilities */}
                    {hasProbabilities && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Rate Decision Probabilities
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {event.rateProbabilities.cut > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className={`font-medium ${getProbabilityColor('cut')}`}>
                                  Rate Cut
                                </span>
                                <span className="font-semibold text-foreground">
                                  {event.rateProbabilities.cut}%
                                </span>
                              </div>
                              <div className="relative">
                                <Progress
                                  value={event.rateProbabilities.cut}
                                  className="h-2 bg-muted"
                                />
                                <div className={`absolute inset-0 rounded-full ${getProbabilityBg('cut')} opacity-20`} />
                              </div>
                            </div>
                          )}

                          {event.rateProbabilities.hold > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className={`font-medium ${getProbabilityColor('hold')}`}>
                                  Hold Steady
                                </span>
                                <span className="font-semibold text-foreground">
                                  {event.rateProbabilities.hold}%
                                </span>
                              </div>
                              <div className="relative">
                                <Progress
                                  value={event.rateProbabilities.hold}
                                  className="h-2 bg-muted"
                                />
                                <div className={`absolute inset-0 rounded-full ${getProbabilityBg('hold')} opacity-20`} />
                              </div>
                            </div>
                          )}

                          {event.rateProbabilities.hike > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className={`font-medium ${getProbabilityColor('hike')}`}>
                                  Rate Hike
                                </span>
                                <span className="font-semibold text-foreground">
                                  {event.rateProbabilities.hike}%
                                </span>
                              </div>
                              <div className="relative">
                                <Progress
                                  value={event.rateProbabilities.hike}
                                  className="h-2 bg-muted"
                                />
                                <div className={`absolute inset-0 rounded-full ${getProbabilityBg('hike')} opacity-20`} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key Topics */}
                    {event.keyTopics.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Key Topics
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {event.keyTopics.map((topic, topicIndex) => (
                            <Badge
                              key={topicIndex}
                              variant="outline"
                              className="text-xs border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {upcomingEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-1">No Upcoming Events</h4>
            <p className="text-xs text-muted-foreground">Central bank events will appear here when scheduled.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

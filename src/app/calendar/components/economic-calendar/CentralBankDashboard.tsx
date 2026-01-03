import React, { useMemo } from 'react';
import { CentralBankEvent } from './types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building2, Calendar, User, TrendingUp, Clock, Target, ChefHat } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CentralBankDashboardProps {
  events: CentralBankEvent[];
}

export const CentralBankDashboard = React.memo(({ events }: CentralBankDashboardProps) => {
  const upcomingEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
      .slice(0, 3);
  }, [events]);

  const getTypeStyles = (type: string) => {
    return {
      meeting: {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20',
        icon: 'text-rose-500'
      },
      speech: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        icon: 'text-blue-500'
      },
      minutes: {
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        icon: 'text-violet-500'
      }
    }[type] || {
      bg: 'bg-muted/50',
      border: 'border-border',
      icon: 'text-muted-foreground'
    };
  };

  const getProbabilityColor = (action: 'cut' | 'hold' | 'hike') => {
    return {
      cut: 'text-emerald-500',
      hold: 'text-blue-500',
      hike: 'text-rose-500'
    }[action];
  };

  const getProbabilityBg = (action: 'cut' | 'hold' | 'hike') => {
    return {
      cut: 'bg-emerald-500',
      hold: 'bg-blue-500',
      hike: 'bg-rose-500'
    }[action];
  };

  return (
    <div className="bg-card/40 rounded-xl border border-border/40 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground tracking-tight">CENTRAL BANKS</h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Policy Tracking</p>
          </div>
        </div>
        <Badge variant="outline" className="h-5 text-[0.7rem] font-mono border-primary/20 text-primary bg-primary/5 px-1.5">
          {events.length} NEXT
        </Badge>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map((event) => {
          const typeStyles = getTypeStyles(event.type);
          const hasProbabilities = event.rateProbabilities.cut + event.rateProbabilities.hold + event.rateProbabilities.hike > 0;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                typeStyles.bg, typeStyles.border
              )}
            >
              {/* Dynamic Bias Glow */}
              <div
                className={cn(
                  "absolute inset-0 opacity-10 transition-opacity duration-1000",
                  event.type === 'meeting' ? "bg-rose-500" :
                    event.type === 'speech' ? "bg-blue-500" :
                      "bg-violet-500"
                )}
              />
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.8rem] font-bold text-foreground uppercase tracking-tight">{event.bank}</span>
                      <Badge variant="outline" className={cn("h-4 text-[0.7rem] font-bold uppercase border-transparent bg-background/40", typeStyles.icon)}>
                        {event.type}
                      </Badge>
                    </div>
                    {event.speaker && (
                      <div className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground font-medium truncate">
                        <User className="w-3 h-3" />
                        {event.speaker}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[0.7rem] font-bold text-foreground leading-tight">
                      {event.datetime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-[0.8rem] text-muted-foreground font-mono">
                      {event.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="relative z-10">

                  {hasProbabilities && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-3 h-3 text-primary/60" />
                        <span className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-widest">Rate Odds</span>
                      </div>
                      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-background/30 border border-border/10">
                        {event.rateProbabilities.cut > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${event.rateProbabilities.cut}%` }} className={cn("h-full", getProbabilityBg('cut'))} />}
                        {event.rateProbabilities.hold > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${event.rateProbabilities.hold}%` }} className={cn("h-full", getProbabilityBg('hold'))} />}
                        {event.rateProbabilities.hike > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${event.rateProbabilities.hike}%` }} className={cn("h-full", getProbabilityBg('hike'))} />}
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                        {event.rateProbabilities.cut > 0 && <span className={getProbabilityColor('cut')}>CUT {event.rateProbabilities.cut}%</span>}
                        {event.rateProbabilities.hold > 0 && <span className={getProbabilityColor('hold')}>HOLD {event.rateProbabilities.hold}%</span>}
                        {event.rateProbabilities.hike > 0 && <span className={getProbabilityColor('hike')}>HIKE {event.rateProbabilities.hike}%</span>}
                      </div>
                    </div>
                  )}

                  {event.keyTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 text-[0.7rem]">
                      {event.keyTopics.slice(0, 3).map((topic, i) => (
                        <Badge key={i} variant="secondary" className="h-4 text-[0.5rem] border-border/20 bg-background/20 font-medium whitespace-nowrap">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {upcomingEvents.length === 0 && (
        <div className="text-center py-8">
          <span className="text-[10px] font-medium text-muted-foreground">No upcoming events found</span>
        </div>
      )}
    </div>
  );
});

CentralBankDashboard.displayName = 'CentralBankDashboard';

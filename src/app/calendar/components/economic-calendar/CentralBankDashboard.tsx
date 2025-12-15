import { CentralBankEvent } from './types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Building2, Calendar, User, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
interface CentralBankDashboardProps {
  events: CentralBankEvent[];
}

export function CentralBankDashboard({ events }: CentralBankDashboardProps) {
  const upcomingEvents = events
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
    .slice(0, 4);

  const getTypeColor = (type: string) => {
    return {
      meeting: 'bg-red-600',
      speech: 'bg-blue-600',
      minutes: 'bg-purple-600'
    }[type] || 'bg-slate-600';
  };

  const getTypeIcon = (type: string) => {
    return {
      meeting: Building2,
      speech: User,
      minutes: Calendar
    }[type] || Calendar;
  };

  return (
    <ScrollArea className="h-full">
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg text-slate-900 dark:text-white">Central Bank Watch</h3>
        <Badge variant="outline" className="ml-auto border-slate-200 dark:border-slate-700">
          {events.length} Upcoming
        </Badge>
      </div>

      <div className="space-y-4">
        {upcomingEvents.map(event => {
          const TypeIcon = getTypeIcon(event.type);
          const typeColor = getTypeColor(event.type);
          const hasProbabilities = event.rateProbabilities.cut + event.rateProbabilities.hold + event.rateProbabilities.hike > 0;

          return (
            <Card key={event.id} className="border-slate-200 dark:border-slate-800 p-4 hover:border-slate-50 dark:hover:border-slate-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`${typeColor} p-2 rounded-lg`}>
                  <TypeIcon className="w-5 h-5 text-slate-900 dark:text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-slate-900 dark:text-white">{event.bank}</span>
                    <Badge className={typeColor}>
                      {event.type}
                    </Badge>
                  </div>

                  {event.speaker && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Speaker: {event.speaker}
                    </div>
                  )}

                  <div className="text-xs text-slate-500 mb-3">
                    {event.datetime.toLocaleString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  {hasProbabilities && (
                    <div className="space-y-2 mb-3">
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">Rate Decision Probabilities</div>
                      
                      {event.rateProbabilities.cut > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-400">Cut</span>
                            <span className="text-slate-900 dark:text-white">{event.rateProbabilities.cut}%</span>
                          </div>
                          <Progress value={event.rateProbabilities.cut} className="h-1.5 bg-slate-800" />
                        </div>
                      )}

                      {event.rateProbabilities.hold > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-400">Hold</span>
                            <span className="text-slate-900 dark:text-white">{event.rateProbabilities.hold}%</span>
                          </div>
                          <Progress value={event.rateProbabilities.hold} className="h-1.5 bg-slate-800" />
                        </div>
                      )}

                      {event.rateProbabilities.hike > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-red-400">Hike</span>
                            <span className="text-slate-900 dark:text-white">{event.rateProbabilities.hike}%</span>
                          </div>
                          <Progress value={event.rateProbabilities.hike} className="h-1.5 bg-slate-800" />
                        </div>
                      )}
                    </div>
                  )}

                  {event.keyTopics.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-400 mb-2">Key Topics</div>
                      <div className="flex flex-wrap gap-1">
                        {event.keyTopics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-slate-700">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
    </ScrollArea>
  );
}

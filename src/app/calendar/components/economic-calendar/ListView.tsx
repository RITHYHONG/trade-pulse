import { Fragment, useState } from 'react';
import { EconomicEvent } from './types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Bell,
  Star,
  BarChart2
} from 'lucide-react';

interface ListViewProps {
  events: EconomicEvent[];
  onEventClick: (event: EconomicEvent) => void;
  isLoading?: boolean;
}

export function ListView({ events, onEventClick, isLoading = false }: ListViewProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'time' | 'impact' | 'name'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const impactScore = {
    high: 3,
    medium: 2,
    low: 1
  };

  const sortedEvents = [...events].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'time') {
      comparison = a.datetime.getTime() - b.datetime.getTime();
    } else if (sortBy === 'impact') {
      comparison = impactScore[b.impact] - impactScore[a.impact];
    } else if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: 'time' | 'impact' | 'name') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortIcon = sortOrder === 'asc' ? ChevronUp : ChevronDown;

  const impactColor = {
    high: 'bg-rose-500',
    medium: 'bg-amber-500',
    low: 'bg-emerald-500'
  };

  const sentimentIcon = {
    bullish: TrendingUp,
    bearish: TrendingDown,
    neutral: Activity
  };

  if (isLoading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-center">Consensus</TableHead>
                  <TableHead className="text-center">Previous</TableHead>
                  <TableHead className="text-center">Expected Move</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell>
                      <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-48 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-4 w-12 bg-muted rounded-md animate-pulse mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-4 w-12 bg-muted rounded-md animate-pulse mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-4 w-12 bg-muted rounded-md animate-pulse mx-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 w-8 bg-muted rounded-md animate-pulse ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort('time')}
                >
                  <div className="flex items-center gap-2">
                    Time
                    {sortBy === 'time' && <SortIcon className="w-4 h-4" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort('impact')}
                >
                  <div className="flex items-center gap-2">
                    Impact
                    {sortBy === 'impact' && <SortIcon className="w-4 h-4" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Event
                    {sortBy === 'name' && <SortIcon className="w-4 h-4" />}
                  </div>
                </TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-center">Consensus</TableHead>
                <TableHead className="text-center">Previous</TableHead>
                <TableHead className="text-center">Expected Move</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEvents.map(event => {
                const SentimentIcon = sentimentIcon[event.historicalData.directionBias];
                const isExpanded = expandedRow === event.id;
                return (
                  <Fragment key={event.id}>
                    <TableRow 
                      key={event.id}
                      className="border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setExpandedRow(isExpanded ? null : event.id)}
                    >
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="w-8 h-8"
                          aria-label={isExpanded ? "Collapse row" : "Expand row"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {event.datetime.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-xs text-slate-500">
                          {event.datetime.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${impactColor[event.impact]}`} />
                          <Badge 
                            className={impactColor[event.impact]}
                          >
                            {event.impact.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-foreground mb-1">{event.name}</div>
                        <Badge variant="outline" className="text-xs border-border">
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{event.country}</div>
                        <Badge variant="outline" className="text-xs border-border mt-1">
                          {event.region}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-foreground">
                          {event.consensus}{event.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-muted-foreground">
                          {event.previous}{event.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-orange-400">
                          ±{event.tradingSetup.expectedMove}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="w-8 h-8 hover:text-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(event);
                            }}
                            aria-label="View event details"
                          >
                            <BarChart2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="w-8 h-8 hover:text-amber-500"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Star event"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="w-8 h-8 hover:text-emerald-500"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Set alert"
                          >
                            <Bell className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <TableRow key={`${event.id}-expanded`} className="border-border bg-muted/30">
                        <TableCell colSpan={9} className="p-6">
                          <div className="grid grid-cols-3 gap-6">
                            {/* Historical Analysis */}
                            <div>
                              <h4 className="text-sm text-muted-foreground mb-3">Historical Analysis</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Avg Move:</span>
                                  <span className="text-foreground">±{event.historicalData.avgMove}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Direction:</span>
                                  <div className="flex items-center gap-2">
                                    <SentimentIcon className="w-3 h-3" />
                                    <span className="text-foreground">{event.historicalData.directionBias}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Success Rate:</span>
                                  <span className="text-foreground">{event.historicalData.biasSuccessRate}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Peak Impact:</span>
                                  <span className="text-foreground">{event.historicalData.peakImpactMinutes}min</span>
                                </div>
                              </div>
                            </div>

                            {/* Consensus Data */}
                            <div>
                              <h4 className="text-sm text-muted-foreground mb-3">Consensus Intelligence</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Surprise Prob:</span>
                                  <span className="text-foreground">{event.consensusIntelligence.surpriseProbability}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Revision:</span>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      event.consensusIntelligence.revisionMomentum === 'up' 
                                        ? 'border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                        : event.consensusIntelligence.revisionMomentum === 'down'
                                        ? 'border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400'
                                        : 'border-border'
                                    }
                                  >
                                    {event.consensusIntelligence.revisionMomentum}
                                  </Badge>
                                </div>
                                {event.consensusIntelligence.whisperNumber && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Whisper:</span>
                                    <span className="text-amber-600 dark:text-amber-400">
                                      {event.consensusIntelligence.whisperNumber}{event.unit}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Trading Strategy */}
                            <div>
                              <h4 className="text-sm text-muted-foreground mb-3">Trading Strategy</h4>
                              <div className="space-y-2">
                                <div className="text-sm text-foreground mb-2">
                                  {event.tradingSetup.strategyTag}
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Confidence:</span>
                                  <Badge className="bg-primary">
                                    {event.tradingSetup.confidenceScore}%
                                  </Badge>
                                </div>
                                <div className="mt-3">
                                  <div className="text-xs text-muted-foreground mb-2">Correlated Assets:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {event.tradingSetup.correlatedAssets.slice(0, 4).map((asset) => (
                                      <Badge key={asset} variant="outline" className="text-xs border-border">
                                        {asset}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScrollArea>
  );
}

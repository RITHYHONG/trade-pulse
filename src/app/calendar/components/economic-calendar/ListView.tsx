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
  BarChart2,
  Clock,
  Target,
  Brain,
  ArrowUpDown
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

  const getImpactStyles = (impact: string) => {
    return {
      high: {
        bg: 'bg-gradient-to-br from-rose-500/15 to-red-600/15',
        border: 'border-rose-500/30',
        text: 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]',
        dot: 'bg-gradient-to-br from-rose-400 to-red-500 shadow-lg shadow-rose-500/50'
      },
      medium: {
        bg: 'bg-gradient-to-br from-amber-500/15 to-orange-500/15',
        border: 'border-amber-500/30',
        text: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]',
        dot: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/50'
      },
      low: {
        bg: 'bg-gradient-to-br from-emerald-500/15 to-teal-500/15',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]',
        dot: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/50'
      }
    }[impact] || {
      bg: 'bg-muted/50',
      border: 'border-border',
      text: 'text-muted-foreground',
      dot: 'bg-muted'
    };
  };

  const getSentimentStyles = (sentiment: string) => {
    return {
      bullish: {
        icon: TrendingUp,
        color: 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]'
      },
      bearish: {
        icon: TrendingDown,
        color: 'text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
      },
      neutral: {
        icon: Activity,
        color: 'text-slate-400 drop-shadow-[0_0_6px_rgba(148,163,184,0.4)]'
      }
    }[sentiment] || {
      icon: Activity,
      color: 'text-muted-foreground'
    };
  };

  if (isLoading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">List View</h3>
              <p className="text-xs text-muted-foreground">Loading economic events...</p>
            </div>
          </div>

          <div className="bg-card/50 p-5 rounded-xl border border-border/30 backdrop-blur-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-muted/30">
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
                  <TableRow key={i} className="border-border/30">
                    <TableCell>
                      <div className="h-4 w-4 bg-muted/50 rounded-full animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-muted/50 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-muted/50 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-48 bg-muted/50 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-muted/50 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-4 w-12 bg-muted/50 rounded-md animate-pulse mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-4 w-12 bg-muted/50 rounded-md animate-pulse mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="h-4 w-12 bg-muted/50 rounded-md animate-pulse mx-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 w-8 bg-muted/50 rounded-md animate-pulse ml-auto" />
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
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">List View</h3>
            <p className="text-xs text-muted-foreground">Comprehensive economic events overview</p>
          </div>
        </div>

        <div className="bg-card/50 p-5 rounded-xl border border-border/30 backdrop-blur-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-muted/30">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                  onClick={() => handleSort('time')}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">Time</span>
                    {sortBy === 'time' && <SortIcon className="w-4 h-4 text-primary" />}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                  onClick={() => handleSort('impact')}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">Impact</span>
                    {sortBy === 'impact' && <SortIcon className="w-4 h-4 text-primary" />}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">Event</span>
                    {sortBy === 'name' && <SortIcon className="w-4 h-4 text-primary" />}
                  </div>
                </TableHead>
                <TableHead className="font-medium text-foreground">Country</TableHead>
                <TableHead className="text-center font-medium text-foreground">Consensus</TableHead>
                <TableHead className="text-center font-medium text-foreground">Previous</TableHead>
                <TableHead className="text-center font-medium text-foreground">Expected Move</TableHead>
                <TableHead className="text-right font-medium text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEvents.map(event => {
                const sentimentStyles = getSentimentStyles(event.historicalData.directionBias);
                const impactStyles = getImpactStyles(event.impact);
                const SentimentIcon = sentimentStyles.icon;
                const isExpanded = expandedRow === event.id;
                return (
                  <Fragment key={event.id}>
                    <TableRow
                      className="border-border/30 hover:bg-muted/30 cursor-pointer transition-all duration-200 group"
                      onClick={() => setExpandedRow(isExpanded ? null : event.id)}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 rounded-lg hover:bg-muted/50 transition-colors"
                          aria-label={isExpanded ? "Collapse row" : "Expand row"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-primary" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-primary" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">
                          {event.datetime.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.datetime.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${impactStyles.dot}`} />
                          <Badge className={`${impactStyles.bg} ${impactStyles.text} border-0 font-medium`}>
                            {event.impact.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-foreground font-medium mb-1 group-hover:text-primary transition-colors">{event.name}</div>
                        <Badge variant="outline" className="border-border/50 bg-background/50 text-xs">
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">{event.country}</div>
                        <Badge variant="outline" className="border-border/50 bg-background/50 text-xs mt-1">
                          {event.region}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-foreground font-semibold">
                          {event.consensus}{event.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-muted-foreground">
                          {event.previous}{event.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-amber-400 font-medium flex items-center justify-center gap-1">
                          <Activity className="w-3.5 h-3.5" />
                          ±{event.tradingSetup.expectedMove}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
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
                            className="w-8 h-8 rounded-lg hover:bg-yellow-500/10 hover:text-yellow-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Star event"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
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
                      <TableRow className="border-border/30 bg-muted/20">
                        <TableCell colSpan={9} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Historical Analysis */}
                            <div className="bg-card/50 p-4 rounded-xl border border-border/30 backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                  <Clock className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-semibold text-foreground">Historical Analysis</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Avg Move:</span>
                                  <span className="text-foreground font-medium">±{event.historicalData.avgMove}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Direction:</span>
                                  <div className="flex items-center gap-2">
                                    <SentimentIcon className={`w-4 h-4 ${sentimentStyles.color}`} />
                                    <span className={`font-medium ${sentimentStyles.color}`}>
                                      {event.historicalData.directionBias}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Success Rate:</span>
                                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                                    {event.historicalData.biasSuccessRate}%
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Peak Impact:</span>
                                  <span className="text-foreground font-medium">{event.historicalData.peakImpactMinutes}min</span>
                                </div>
                              </div>
                            </div>

                            {/* Consensus Data */}
                            <div className="bg-card/50 p-4 rounded-xl border border-border/30 backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                  <Target className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-semibold text-foreground">Consensus Intelligence</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Surprise Prob:</span>
                                  <span className="text-foreground font-medium">{event.consensusIntelligence.surpriseProbability}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Revision:</span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      event.consensusIntelligence.revisionMomentum === 'up'
                                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                                        : event.consensusIntelligence.revisionMomentum === 'down'
                                        ? 'border-rose-500/30 text-rose-400 bg-rose-500/5'
                                        : 'border-border/50 bg-background/50'
                                    }
                                  >
                                    {event.consensusIntelligence.revisionMomentum === 'up' ? (
                                      <>
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Upward
                                      </>
                                    ) : event.consensusIntelligence.revisionMomentum === 'down' ? (
                                      <>
                                        <TrendingDown className="w-3 h-3 mr-1" />
                                        Downward
                                      </>
                                    ) : (
                                      <>
                                        <ArrowUpDown className="w-3 h-3 mr-1" />
                                        Stable
                                      </>
                                    )}
                                  </Badge>
                                </div>
                                {event.consensusIntelligence.whisperNumber && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Whisper:</span>
                                    <span className="text-amber-400 font-medium flex items-center gap-1">
                                      <Star className="w-3.5 h-3.5" />
                                      {event.consensusIntelligence.whisperNumber}{event.unit}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Trading Strategy */}
                            <div className="bg-card/50 p-4 rounded-xl border border-border/30 backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                  <Brain className="w-4 h-4" />
                                </div>
                                <h4 className="text-sm font-semibold text-foreground">Trading Strategy</h4>
                              </div>
                              <div className="space-y-3">
                                <div className="text-sm text-foreground font-medium mb-2">
                                  {event.tradingSetup.strategyTag}
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Confidence:</span>
                                  <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
                                    {event.tradingSetup.confidenceScore}%
                                  </Badge>
                                </div>
                                <div className="mt-3">
                                  <div className="text-xs text-muted-foreground mb-2 font-medium">Correlated Assets:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {event.tradingSetup.correlatedAssets.slice(0, 4).map((asset) => (
                                      <Badge key={asset} variant="outline" className="border-border/50 bg-background/50 text-xs hover:bg-muted/50 transition-colors">
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

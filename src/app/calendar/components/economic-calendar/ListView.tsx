import React, { Fragment, useState, useMemo } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ListViewProps {
  events: EconomicEvent[];
  onEventClick: (event: EconomicEvent) => void;
  isLoading?: boolean;
}

export const ListView = React.memo(({ events, onEventClick, isLoading = false }: ListViewProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'time' | 'impact' | 'name'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const impactScore = {
    high: 3,
    medium: 2,
    low: 1
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
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
  }, [events, sortBy, sortOrder]);

  const handleSort = (column: 'time' | 'impact' | 'name') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const SortIcon = sortOrder === 'asc' ? ChevronUp : ChevronDown;

  const impactStyles = {
    high: 'bg-rose-500 shadow-rose-500/20',
    medium: 'bg-amber-500 shadow-amber-500/20',
    low: 'bg-emerald-500 shadow-emerald-500/20'
  };

  const sentimentIcon = {
    bullish: TrendingUp,
    bearish: TrendingDown,
    neutral: Activity
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full bg-muted/20 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground transition-colors w-[120px]"
                onClick={() => handleSort('time')}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                  Time
                  {sortBy === 'time' && <SortIcon className="w-3.5 h-3.5" />}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground transition-colors w-[100px]"
                onClick={() => handleSort('impact')}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                  Impact
                  {sortBy === 'impact' && <SortIcon className="w-3.5 h-3.5" />}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                  Event
                  {sortBy === 'name' && <SortIcon className="w-3.5 h-3.5" />}
                </div>
              </TableHead>
              <TableHead className="text-center w-[100px]">
                <span className="text-xs font-semibold uppercase tracking-wider">Consensus</span>
              </TableHead>
              <TableHead className="text-center w-[100px]">
                <span className="text-xs font-semibold uppercase tracking-wider">Previous</span>
              </TableHead>
              <TableHead className="text-right w-[120px]">
                <span className="text-xs font-semibold uppercase tracking-wider">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvents.map(event => {
              const SentimentIcon = sentimentIcon[event.historicalData.directionBias];
              const isExpanded = expandedRow === event.id;

              return (
                <Fragment key={event.id}>
                  <TableRow
                    className={cn(
                      "border-border/40 transition-colors cursor-pointer group",
                      isExpanded ? "bg-muted/30 hover:bg-muted/30" : "hover:bg-muted/20"
                    )}
                    onClick={() => setExpandedRow(isExpanded ? null : event.id)}
                  >
                    <TableCell className="py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 text-muted-foreground/60 group-hover:text-foreground transition-colors"
                        aria-label={isExpanded ? "Collapse row" : "Expand row"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-medium text-foreground">
                          {event.datetime.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </span>
                        <span className="text-[0.7rem] text-muted-foreground uppercase">
                          {event.datetime.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", impactStyles[event.impact])} />
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide opacity-80">
                          {event.impact}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-0.5">
                        <div className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                          {event.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[0.7rem] font-mono text-muted-foreground px-1.5 py-0.5 rounded-md bg-secondary/50 border border-border/50">
                            {event.country}
                          </span>
                          <span className="text-[0.7rem] text-muted-foreground">
                            {event.region}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <span className="text-sm font-mono text-muted-foreground">
                        {event.consensus}{event.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-3">
                      <span className="text-sm font-mono text-muted-foreground/60">
                        {event.previous}{event.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 hover:text-primary hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 hover:text-amber-500 hover:bg-amber-500/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 hover:text-emerald-500 hover:bg-emerald-500/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Row */}
                  {isExpanded && (
                    <TableRow className="bg-muted/30 border-b border-border/40 hover:bg-muted/30">
                      <TableCell colSpan={7} className="p-0">
                        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">

                          {/* Analysis Card */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                              <Activity className="w-3.5 h-3.5" />
                              <h4 className="text-xs font-semibold uppercase tracking-wider">Historical Performance</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 rounded-lg bg-background border border-border/50">
                                <div className="text-[0.7rem] text-muted-foreground mb-1">Avg Move</div>
                                <div className="text-sm font-mono font-medium">±{event.historicalData.avgMove}%</div>
                              </div>
                              <div className="p-3 rounded-lg bg-background border border-border/50">
                                <div className="text-[0.7rem] text-muted-foreground mb-1">Direction Bias</div>
                                <div className={cn(
                                  "flex items-center gap-1.5 text-sm font-bold capitalize",
                                  event.historicalData.directionBias === 'bullish' ? 'text-emerald-500' :
                                    event.historicalData.directionBias === 'bearish' ? 'text-rose-500' :
                                      'text-muted-foreground'
                                )}>
                                  <SentimentIcon className="w-3.5 h-3.5" />
                                  {event.historicalData.directionBias}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Consensus Card */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                              <ArrowRight className="w-3.5 h-3.5" />
                              <h4 className="text-xs font-semibold uppercase tracking-wider">Consensus Views</h4>
                            </div>
                            <div className="p-3 rounded-lg bg-background border border-border/50 space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Surprise Prob</span>
                                <Badge variant="outline" className="font-mono text-[0.7rem] bg-primary/5 text-primary border-primary/20">
                                  {event.consensusIntelligence.surpriseProbability}%
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Whisper Number</span>
                                <span className="font-mono font-bold text-amber-500">
                                  {event.consensusIntelligence.whisperNumber ? `${event.consensusIntelligence.whisperNumber}${event.unit}` : '--'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Strategy Card */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <h4 className="text-xs font-semibold uppercase tracking-wider">Strategy</h4>
                            </div>
                            <div className="p-3 rounded-lg bg-background border border-border/50 flex flex-col justify-between h-[88px]">
                              <div className="text-sm font-medium">{event.tradingSetup.strategyTag}</div>
                              <div className="flex items-center gap-2 mt-auto">
                                {event.tradingSetup.correlatedAssets.slice(0, 3).map(asset => (
                                  <Badge key={asset} variant="secondary" className="bg-secondary/50 text-[0.7rem] font-normal border-transparent">
                                    {asset}
                                  </Badge>
                                ))}
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
    </ScrollArea>
  );
});

ListView.displayName = 'ListView';

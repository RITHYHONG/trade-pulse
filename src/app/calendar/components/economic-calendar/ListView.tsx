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
}

export function ListView({ events, onEventClick }: ListViewProps) {
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
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-green-500'
  };

  const sentimentIcon = {
    bullish: TrendingUp,
    bearish: TrendingDown,
    neutral: Activity
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-900">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={() => handleSort('time')}
                >
                  <div className="flex items-center gap-2">
                    Time
                    {sortBy === 'time' && <SortIcon className="w-4 h-4" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-800 transition-colors"
                  onClick={() => handleSort('impact')}
                >
                  <div className="flex items-center gap-2">
                    Impact
                    {sortBy === 'impact' && <SortIcon className="w-4 h-4" />}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-800 transition-colors"
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
                      className="border-slate-800 hover:bg-slate-800 cursor-pointer transition-colors"
                      onClick={() => setExpandedRow(isExpanded ? null : event.id)}
                    >
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="w-8 h-8"
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
                        <div className="text-white mb-1">{event.name}</div>
                        <Badge variant="outline" className="text-xs border-slate-700">
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{event.country}</div>
                        <Badge variant="outline" className="text-xs border-slate-700 mt-1">
                          {event.region}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-white">
                          {event.consensus}{event.unit}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-slate-400">
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
                            className="w-8 h-8 hover:text-blue-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEventClick(event);
                            }}
                          >
                            <BarChart2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="w-8 h-8 hover:text-yellow-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="w-8 h-8 hover:text-green-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Bell className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <TableRow key={`${event.id}-expanded`} className="border-slate-800 bg-slate-800/50">
                        <TableCell colSpan={9} className="p-6">
                          <div className="grid grid-cols-3 gap-6">
                            {/* Historical Analysis */}
                            <div>
                              <h4 className="text-sm text-slate-400 mb-3">Historical Analysis</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Avg Move:</span>
                                  <span className="text-white">±{event.historicalData.avgMove}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Direction:</span>
                                  <div className="flex items-center gap-2">
                                    <SentimentIcon className="w-3 h-3" />
                                    <span className="text-white">{event.historicalData.directionBias}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Success Rate:</span>
                                  <span className="text-white">{event.historicalData.biasSuccessRate}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Peak Impact:</span>
                                  <span className="text-white">{event.historicalData.peakImpactMinutes}min</span>
                                </div>
                              </div>
                            </div>

                            {/* Consensus Data */}
                            <div>
                              <h4 className="text-sm text-slate-400 mb-3">Consensus Intelligence</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Surprise Prob:</span>
                                  <span className="text-white">{event.consensusIntelligence.surpriseProbability}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Revision:</span>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      event.consensusIntelligence.revisionMomentum === 'up' 
                                        ? 'border-green-700 text-green-400'
                                        : event.consensusIntelligence.revisionMomentum === 'down'
                                        ? 'border-red-700 text-red-400'
                                        : 'border-slate-700'
                                    }
                                  >
                                    {event.consensusIntelligence.revisionMomentum}
                                  </Badge>
                                </div>
                                {event.consensusIntelligence.whisperNumber && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Whisper:</span>
                                    <span className="text-amber-400">
                                      {event.consensusIntelligence.whisperNumber}{event.unit}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Trading Strategy */}
                            <div>
                              <h4 className="text-sm text-slate-400 mb-3">Trading Strategy</h4>
                              <div className="space-y-2">
                                <div className="text-sm text-white mb-2">
                                  {event.tradingSetup.strategyTag}
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-400">Confidence:</span>
                                  <Badge className="bg-blue-600">
                                    {event.tradingSetup.confidenceScore}%
                                  </Badge>
                                </div>
                                <div className="mt-3">
                                  <div className="text-xs text-slate-400 mb-2">Correlated Assets:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {event.tradingSetup.correlatedAssets.slice(0, 4).map((asset) => (
                                      <Badge key={asset} variant="outline" className="text-xs border-slate-700">
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

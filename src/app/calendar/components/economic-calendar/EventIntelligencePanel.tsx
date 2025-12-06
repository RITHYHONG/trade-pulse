import { X, TrendingUp, TrendingDown, Activity, Target, BarChart3, Brain, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { EconomicEvent } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface EventIntelligencePanelProps {
  event: EconomicEvent | null;
  onClose: () => void;
}

export function EventIntelligencePanel({ event, onClose }: EventIntelligencePanelProps) {
  if (!event) return null;

  const impactColor = {
    high: 'bg-red-500',
    medium: 'bg-orange-500',
    low: 'bg-green-500'
  }[event.impact];

  const sentimentColor = {
    bullish: 'text-green-400',
    bearish: 'text-red-400',
    neutral: 'text-slate-400'
  }[event.historicalData.directionBias];

  const sentimentIcon = {
    bullish: TrendingUp,
    bearish: TrendingDown,
    neutral: Activity
  }[event.historicalData.directionBias];

  const SentimentIcon = sentimentIcon;

  // Prepare distribution data for chart
  const distributionData = event.consensusIntelligence.estimateDistribution.map((value, index) => ({
    name: value.toString(),
    value: Math.random() * 10 + 5, // Mock frequency
    isConsensus: value === event.consensus
  }));

  return (
    <div className="fixed right-0 top-0 h-full w-[600px] bg-slate-950 border-l border-slate-800 text-white shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={impactColor}>
                {event.impact.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="border-slate-700">
                {event.category}
              </Badge>
            </div>
            <h2 className="text-xl mb-1">{event.name}</h2>
            <p className="text-sm text-slate-400">
              {event.country} • {event.datetime.toLocaleString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-800" aria-label="Close panel">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Consensus</div>
            <div className="text-lg">{event.consensus}{event.unit}</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Previous</div>
            <div className="text-lg">{event.previous}{event.unit}</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <div className="text-xs text-slate-400 mb-1">Expected Move</div>
            <div className="text-lg text-orange-400">±{event.tradingSetup.expectedMove}%</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Historical Impact Analysis */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg">Historical Impact Analysis</h3>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Average Absolute Move</span>
              <span className="text-lg">±{event.historicalData.avgMove}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Directional Bias</span>
              <div className="flex items-center gap-2">
                <SentimentIcon className={`w-4 h-4 ${sentimentColor}`} />
                <span className={sentimentColor}>
                  {event.historicalData.directionBias.toUpperCase()}
                </span>
                <Badge variant="outline" className="border-slate-700">
                  {event.historicalData.biasSuccessRate}% accuracy
                </Badge>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Peak Impact Time</span>
                <span>{event.historicalData.peakImpactMinutes} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Fade Time</span>
                <span>{event.historicalData.fadeTimeHours} hours</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-200">
                  Historical data shows peak volatility within {event.historicalData.peakImpactMinutes} minutes, 
                  followed by mean reversion over {event.historicalData.fadeTimeHours}h period.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consensus Intelligence */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg">Consensus Intelligence</h3>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Surprise Probability</span>
              <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                <Progress value={event.consensusIntelligence.surpriseProbability} className="flex-1" />
                <span className="text-lg">{event.consensusIntelligence.surpriseProbability}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Revision Momentum</span>
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
                {event.consensusIntelligence.revisionMomentum === 'up' ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Upward
                  </>
                ) : event.consensusIntelligence.revisionMomentum === 'down' ? (
                  <>
                    <TrendingDown className="w-4 h-4 mr-1" />
                    Downward
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-1" />
                    Stable
                  </>
                )}
              </Badge>
            </div>

            {event.consensusIntelligence.whisperNumber && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Whisper Number</span>
                <span className="text-lg text-amber-400">
                  {event.consensusIntelligence.whisperNumber}{event.unit}
                </span>
              </div>
            )}

            {/* Distribution Chart */}
            {distributionData.length > 0 && (
              <div className="mt-4">
                <div className="text-xs text-slate-400 mb-2">Estimate Distribution</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isConsensus ? '#3b82f6' : '#64748b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        {/* Trading Strategy Suggestions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-green-400" />
            <h3 className="text-lg">AI Trading Insights</h3>
          </div>

          <div className="bg-gradient-to-br from-green-950/30 to-blue-950/30 p-4 rounded-lg border border-green-900/30">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">Strategy Confidence</span>
                  <Badge variant="outline" className="border-green-700 text-green-400">
                    {event.tradingSetup.confidenceScore}%
                  </Badge>
                </div>
                <p className="text-lg mb-3">{event.tradingSetup.strategyTag}</p>
                <div className="text-sm text-slate-400">
                  Expected volatility: ±{event.tradingSetup.expectedMove}% on primary pairs
                </div>
              </div>
            </div>

            <Separator className="bg-slate-800 my-4" />

            <div>
              <div className="text-sm text-slate-400 mb-2">Correlated Assets</div>
              <div className="flex flex-wrap gap-2">
                {event.tradingSetup.correlatedAssets.map((asset, index) => (
                  <Badge key={index} variant="outline" className="border-slate-700">
                    {asset}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Affected Markets */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg">Affected Markets</h3>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              {event.affectedAssets.map((asset, index) => (
                <div 
                  key={index}
                  className="px-3 py-2 bg-slate-800 rounded border border-slate-700 hover:border-blue-600 transition-colors cursor-pointer"
                >
                  <div className="text-sm">{asset}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Set Alert
          </Button>
          <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800">
            Add to Watchlist
          </Button>
        </div>
      </div>
    </div>
  );
}

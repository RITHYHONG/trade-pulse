import { X, TrendingUp, TrendingDown, Activity, Target, BarChart3, Brain, AlertCircle, ArrowRight, Sparkles, Clock, Zap } from 'lucide-react';
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

  const getImpactStyles = (impact: string) => {
    return {
      high: {
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        border: 'border-rose-200 dark:border-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        glow: 'shadow-sm hover:shadow-md'
      },
      medium: {
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-200 dark:border-amber-500/20',
        text: 'text-amber-600 dark:text-amber-400',
        glow: 'shadow-sm hover:shadow-md'
      },
      low: {
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        glow: 'shadow-sm hover:shadow-md'
      }
    }[impact] || {
      bg: 'bg-muted/50',
      border: 'border-border',
      text: 'text-muted-foreground',
      glow: ''
    };
  };

  const getSentimentStyles = (sentiment: string) => {
    return {
      bullish: {
        icon: TrendingUp,
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/20'
      },
      bearish: {
        icon: TrendingDown,
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        border: 'border-rose-200 dark:border-rose-500/20'
      },
      neutral: {
        icon: Activity,
        color: 'text-muted-foreground',
        bg: 'bg-muted/30',
        border: 'border-border/50'
      }
    }[sentiment] || {
      icon: Activity,
      color: 'text-muted-foreground',
      bg: 'bg-muted/50',
      border: 'border-border/50'
    };
  };

  const impactStyles = getImpactStyles(event.impact);
  const sentimentStyles = getSentimentStyles(event.historicalData.directionBias);
  const SentimentIcon = sentimentStyles.icon;

  // Prepare distribution data for chart
  const distributionData = event.consensusIntelligence.estimateDistribution.map((value) => ({
    name: value.toString(),
    value: Math.random() * 10 + 5, // Mock frequency
    isConsensus: value === event.consensus
  }));

  return (
    <div className="fixed right-0 top-0 h-full w-[600px] bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl ${impactStyles.bg} ${impactStyles.text} ring-1 ring-border/20`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`${impactStyles.bg} ${impactStyles.text} border-0 font-medium`}>
                    {event.impact.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="border-border/50 bg-background/50">
                    {event.category}
                  </Badge>
                </div>
                <h2 className="text-xl font-semibold text-foreground">{event.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span>{event.country}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{event.datetime.toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl hover:bg-muted/50 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/30 p-4 rounded-xl border border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Consensus</div>
            <div className="text-2xl font-bold text-foreground">{event.consensus}{event.unit}</div>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Previous</div>
            <div className="text-2xl font-bold text-foreground">{event.previous}{event.unit}</div>
          </div>
          <div className="bg-muted/30 p-4 rounded-xl border border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Expected Move</div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              ±{event.tradingSetup.expectedMove}%
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Historical Impact Analysis */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Historical Impact Analysis</h3>
              <p className="text-xs text-muted-foreground">Past performance patterns</p>
            </div>
          </div>

          <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Average Absolute Move</span>
              <span className="text-xl font-bold text-foreground">±{event.historicalData.avgMove}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Directional Bias</span>
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${sentimentStyles.bg} ${sentimentStyles.color}`}>
                  <SentimentIcon className="w-4 h-4" />
                </div>
                <span className={`font-medium ${sentimentStyles.color}`}>
                  {event.historicalData.directionBias.toUpperCase()}
                </span>
                <Badge variant="outline" className={`${sentimentStyles.border} ${sentimentStyles.color} bg-background/50`}>
                  {event.historicalData.biasSuccessRate}% accuracy
                </Badge>
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Peak Impact Time</div>
                <div className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {event.historicalData.peakImpactMinutes} min
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fade Time</div>
                <div className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  {event.historicalData.fadeTimeHours}h
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  Historical data shows peak volatility within <span className="font-medium text-foreground">{event.historicalData.peakImpactMinutes} minutes</span>,
                  followed by mean reversion over <span className="font-medium text-foreground">{event.historicalData.fadeTimeHours}h</span> period.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consensus Intelligence */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Consensus Intelligence</h3>
              <p className="text-xs text-muted-foreground">Market expectations analysis</p>
            </div>
          </div>

          <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Surprise Probability</span>
              <div className="flex items-center gap-3 flex-1 max-w-[200px]">
                <Progress
                  value={event.consensusIntelligence.surpriseProbability}
                  className="flex-1 h-2"
                />
                <span className="text-lg font-bold text-foreground">
                  {event.consensusIntelligence.surpriseProbability}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Revision Momentum</span>
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
                    <TrendingUp className="w-4 h-4 mr-1.5" />
                    Upward
                  </>
                ) : event.consensusIntelligence.revisionMomentum === 'down' ? (
                  <>
                    <TrendingDown className="w-4 h-4 mr-1.5" />
                    Downward
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-1.5" />
                    Stable
                  </>
                )}
              </Badge>
            </div>

            {event.consensusIntelligence.whisperNumber && (
              <div className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Whisper Number</span>
                <span className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {event.consensusIntelligence.whisperNumber}{event.unit}
                </span>
              </div>
            )}

            {/* Distribution Chart */}
            {distributionData.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Estimate Distribution
                  </span>
                </div>
                <div className="bg-background/50 p-3 rounded-lg border border-border/30">
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={distributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {distributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.isConsensus ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Trading Strategy Suggestions */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Trading Insights</h3>
              <p className="text-xs text-muted-foreground">Smart strategy recommendations</p>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-emerald-500/5 via-primary/5 to-cyan-500/5 p-5 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

            <div className="relative flex items-start gap-4 mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Strategy Confidence</span>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5">
                    {event.tradingSetup.confidenceScore}%
                  </Badge>
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">{event.tradingSetup.strategyTag}</p>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Expected volatility: ±{event.tradingSetup.expectedMove}% on primary pairs
                </div>
              </div>
            </div>

            <Separator className="bg-border/30 my-4" />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Correlated Assets
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.tradingSetup.correlatedAssets.map((asset, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-border/50 bg-background/50 hover:bg-background transition-colors"
                  >
                    {asset}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Affected Markets */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Affected Markets</h3>
              <p className="text-xs text-muted-foreground">Assets impacted by this event</p>
            </div>
          </div>

          <div className="bg-card/50 p-4 rounded-xl border border-border/30 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-3">
              {event.affectedAssets.map((asset, index) => (
                <div
                  key={index}
                  className="px-4 py-3 bg-background/50 rounded-lg border border-border/30 hover:border-primary/50 hover:bg-background transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {asset}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30 hover:scale-[1.02]">
            <Target className="w-4 h-4 mr-2" />
            Set Alert
          </Button>
          <Button
            variant="outline"
            className="border-border/50 hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02]"
          >
            <Activity className="w-4 h-4 mr-2" />
            Add to Watchlist
          </Button>
        </div>
      </div>
    </div>
  );
}

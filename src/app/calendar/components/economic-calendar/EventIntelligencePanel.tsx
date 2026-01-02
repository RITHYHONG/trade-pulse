import React, { useRef, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Activity, Target, Bell, Brain, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EconomicEvent } from './types';
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EventIntelligencePanelProps {
  event: EconomicEvent | null;
  onClose: () => void;
}

export function EventIntelligencePanel({ event, onClose }: EventIntelligencePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!event) return null;

  const getImpactStyles = (impact: string) => {
    return {
      high: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-500',
        border: 'border-rose-500/20'
      },
      medium: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-500',
        border: 'border-amber-500/20'
      },
      low: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500',
        border: 'border-emerald-500/20'
      }
    }[impact] || {
      bg: 'bg-muted/50',
      text: 'text-muted-foreground',
      border: 'border-border'
    };
  };

  const getSentimentStyles = (sentiment: string) => {
    return {
      bullish: {
        icon: TrendingUp,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
      },
      bearish: {
        icon: TrendingDown,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
      },
      neutral: {
        icon: Activity,
        color: 'text-muted-foreground',
        bg: 'bg-muted/50',
      }
    }[sentiment] || {
      icon: Activity,
      color: 'text-muted-foreground',
      bg: 'bg-muted/50',
    };
  };

  const impactStyles = getImpactStyles(event.impact);
  const sentimentStyles = getSentimentStyles(event.historicalData.directionBias);

  const distributionData = event.consensusIntelligence.estimateDistribution.map((val, idx, arr) => ({
    name: val.toString(),
    value: idx === 0 || idx === arr.length - 1 ? 2 : Math.random() * 8 + 10,
    isConsensus: val === event.consensus
  })).sort((a, b) => parseFloat(a.name) - parseFloat(b.name));

  return (
    <>
      <div className="fixed inset-0 bg-background/40 z-40 animate-in fade-in duration-300" onClick={onClose} />
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-[600px] bg-card border-l border-border shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300"
      >

        {/* Header Section */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/40 p-6 z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1.5 flex-1 mr-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={cn("text-[10px] font-mono uppercase tracking-wider h-5", impactStyles.bg, impactStyles.text, impactStyles.border)}>
                  {event.impact} Impact
                </Badge>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  {event.category}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight tracking-tight">{event.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground/80">{event.country}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <Clock className="w-3.5 h-3.5" />
                <span>{event.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-full hover:bg-muted/50 -mt-1 -mr-2 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Consensus', value: `${event.consensus}${event.unit}`, sub: 'Market View' },
              { label: 'Previous', value: `${event.previous}${event.unit}`, sub: 'Last Record', muted: true },
              { label: 'Vol. Exp', value: `±${event.tradingSetup.expectedMove}%`, sub: 'Expected Move', highlight: 'text-amber-500' },
            ].map((stat, i) => (
              <div key={i} className="p-3 bg-secondary/20 rounded-xl border border-border/20 text-center relative overflow-hidden group">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{stat.label}</div>
                <div className={cn("text-lg font-mono font-bold tracking-tighter", stat.muted ? "text-muted-foreground/60" : "text-foreground", stat.highlight)}>{stat.value}</div>
                <div className="text-muted-foreground/40 font-medium uppercase mt-1">{stat.sub}</div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-10 flex-1">

          {/* Probability Distribution Graph Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Expectation Curve
                </h3>
                <p className="text-muted-foreground font-medium uppercase tracking-tight opacity-70">Probability Distribution Density</p>
              </div>
              <Badge variant="secondary" className="font-mono bg-primary/20 text-primary border-primary/30 shadow-sm shadow-primary/10">
                {event.consensusIntelligence.surpriseProbability}% Surprise Prob
              </Badge>
            </div>

            <div className="h-48 w-full rounded-2xl border border-border/40 p-4 relative group overflow-hidden">
              {/* Shifting Gradient Background */}
              <div
                className={cn(
                  "absolute inset-0 opacity-10 transition-colors duration-1000",
                  event.historicalData.directionBias === 'bullish' ? "bg-emerald-500" :
                    event.historicalData.directionBias === 'bearish' ? "bg-rose-500" :
                      "bg-primary"
                )}
              />
              <motion.div
                animate={{
                  x: [0, 20, 0],
                  opacity: [0.05, 0.15, 0.05]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className={cn(
                  "absolute inset-[-50%] blur-3xl opacity-10",
                  event.historicalData.directionBias === 'bullish' ? "bg-gradient-to-r from-emerald-500 via-transparent to-emerald-500" :
                    event.historicalData.directionBias === 'bearish' ? "bg-gradient-to-r from-rose-500 via-transparent to-rose-500" :
                      "bg-gradient-to-r from-primary via-transparent to-primary"
                )}
              />

              <div className="relative h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={distributionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={event.historicalData.directionBias === 'bullish' ? '#10b981' : event.historicalData.directionBias === 'bearish' ? '#f43f5e' : 'hsl(var(--primary))'}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={event.historicalData.directionBias === 'bullish' ? '#10b981' : event.historicalData.directionBias === 'bearish' ? '#f43f5e' : 'hsl(var(--primary))'}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                      cursor={{
                        stroke: event.historicalData.directionBias === 'bullish' ? '#10b981' : event.historicalData.directionBias === 'bearish' ? '#f43f5e' : 'hsl(var(--primary))',
                        strokeWidth: 1,
                        strokeDasharray: '4 4'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={event.historicalData.directionBias === 'bullish' ? '#10b981' : event.historicalData.directionBias === 'bearish' ? '#f43f5e' : 'hsl(var(--primary))'}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      animationDuration={2000}
                      className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    />
                    <ReferenceLine
                      x={event.consensus.toString()}
                      stroke="hsl(var(--foreground))"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      label={{
                        value: 'CONSENSUS',
                        position: 'top',
                        fill: 'hsl(var(--foreground))',
                        fontSize: 8,
                        fontWeight: 'bold',
                        letterSpacing: 1
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute bottom-2 left-6 right-6 flex justify-between font-bold text-muted-foreground uppercase tracking-widest opacity-50">
                <span>{event.consensus - (event.tradingSetup.expectedMove || 1)}{event.unit}</span>
                <span>{event.consensus + (event.tradingSetup.expectedMove || 1)}{event.unit}</span>
              </div>
            </div>
          </section>

          <Separator className="bg-border/40" />

          {/* AI Strategy & Confidence */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest">AI Intelligence Insight</h3>
            </div>

            <div className="relative border border-primary/20 rounded-2xl p-6 overflow-hidden group">
              {/* Strategic Background Shimmer */}
              <div
                className={cn(
                  "absolute inset-0 opacity-10 transition-colors duration-1000",
                  event.historicalData.directionBias === 'bullish' ? "bg-emerald-500" :
                    event.historicalData.directionBias === 'bearish' ? "bg-rose-500" :
                      "bg-primary"
                )}
              />
              <motion.div
                animate={{
                  x: ["-20%", "20%", "-20%"],
                  opacity: [0.03, 0.08, 0.03]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={cn(
                  "absolute inset-0 blur-3xl",
                  event.historicalData.directionBias === 'bullish' ? "bg-emerald-500" :
                    event.historicalData.directionBias === 'bearish' ? "bg-rose-500" :
                      "bg-primary"
                )}
              />

              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Brain className="w-32 h-32" />
              </div>

              <div className="relative z-10 space-y-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60">Strategic Bias</div>
                    <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                      {event.tradingSetup.strategyTag}
                      <Badge variant="outline" className="h-5 bg-primary/10 text-primary border-primary/20">
                        {event.tradingSetup.confidenceScore}% CONFIDENCE
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-sm text-foreground/80 leading-relaxed font-medium">
                  Analysis of current trends suggests a <span className={cn("font-bold underline decoration-2 underline-offset-4", sentimentStyles.color)}>{event.historicalData.directionBias} outlook</span>.
                  Peak market volatility is historically clustered within <span className="text-foreground font-bold">{event.historicalData.peakImpactMinutes} minutes</span> post-release.
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <div className="text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60 text-[0.7rem]">Cross Correlation</div>
                    <div className="flex flex-wrap gap-1.5 min-h-[20px]">
                      {event.tradingSetup.correlatedAssets.length > 0 ? (
                        event.tradingSetup.correlatedAssets.map((asset) => (
                          <Badge key={asset} variant="secondary" className="font-bold h-5 bg-background/50 border border-border/10 hover:bg-primary/5 hover:text-primary transition-all cursor-default">
                            {asset}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground/40 font-italic italic">No correlations identified</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60 text-[0.7rem]">Whisper Num</div>
                    <div className="font-mono font-bold text-lg text-amber-500 tracking-tighter">
                      {event.consensusIntelligence.whisperNumber ? `${event.consensusIntelligence.whisperNumber}${event.unit}` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Market Metrics */}
          <section className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, label: 'Avg Absolute Move', value: `±${event.historicalData.avgMove}%`, color: 'text-primary' },
              { icon: Clock, label: 'Mean Fade Time', value: `${event.historicalData.fadeTimeHours}h`, color: 'text-primary' },
            ].map((metric, i) => (
              <div key={metric.label} className="p-4 rounded-2xl border border-border/40 bg-card/40 space-y-2 group hover:bg-card/60 transition-colors">
                <div className="flex items-center gap-2 font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  <metric.icon className={cn("w-3.5 h-3.5", metric.color)} />
                  {metric.label}
                </div>
                <div className="text-xl font-mono font-bold tracking-tighter">{metric.value}</div>
              </div>
            ))}
          </section>
        </div>

        {/* Action Tray */}
        <div className="p-6 border-t border-border/40 bg-background/50 backdrop-blur-md mt-auto">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-widest border-border/60 hover:bg-secondary/20 group transition-all">
              Watchlist
              <Activity className="w-3.5 h-3.5 ml-2 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
            </Button>
            <Button className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98]">
              <Bell className="w-3.5 h-3.5 mr-2" />
              Set Intelligence Alert
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}

import React, { useRef, useEffect, useMemo, memo } from 'react';
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
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { timeFormatter } from '@/lib/formatters';

// --- Pure Helper Functions (Moved Outside Component) ---
const getImpactStyles = (impact: string) => {
  switch (impact) {
    case 'high': return { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20' };
    case 'medium': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
    case 'low': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
    default: return { bg: 'bg-muted/50', text: 'text-muted-foreground', border: 'border-border' };
  }
};

const getSentimentStyles = (sentiment: string) => {
  switch (sentiment) {
    case 'bullish': return { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    case 'bearish': return { icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10' };
    default: return { icon: Activity, color: 'text-muted-foreground', bg: 'bg-muted/50' };
  }
};

// --- Memoized Chart Component ---
interface ChartDataPoint {
  name: string;
  value: number;
  isConsensus?: boolean;
}

const ProbabilityChart = memo(({ data, directionBias, consensus, prefersReducedMotion }: {
  data: ChartDataPoint[],
  directionBias: string,
  consensus: number,
  prefersReducedMotion: boolean
}) => {
  // Use cyan (#22d3ee) for neutral to ensure visibility on dark backgrounds
  const color = directionBias === 'bullish' ? '#10b981' : directionBias === 'bearish' ? '#f43f5e' : '#22d3ee';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
          }}
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorValue)"
          animationDuration={prefersReducedMotion ? 0 : 1500}
        />
        <ReferenceLine
          x={consensus.toString()}
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
  );
});

ProbabilityChart.displayName = 'ProbabilityChart';

interface EventIntelligencePanelProps {
  event: EconomicEvent | null;
  onClose: () => void;
}

export function EventIntelligencePanel({ event, onClose }: EventIntelligencePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!event) return;

    const panel = panelRef.current;
    if (!panel) return;

    const getFocusableElements = () => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ];
      return Array.from(panel.querySelectorAll(focusableSelectors.join(','))) as HTMLElement[];
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [event, onClose]);

  useEffect(() => {
    let previousOverflow: string | undefined;
    
    const handleClickOutside = (e: MouseEvent) => {
      // Only close if we have a current ref and the click was outside
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Only add listener if event exists (panel is open)
    if (event) {
      document.addEventListener('mousedown', handleClickOutside);
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (previousOverflow !== undefined) {
        document.body.style.overflow = previousOverflow;
      } else {
        document.body.style.overflow = '';
      }
    };
  }, [onClose, event]);

  // Optimized Data Calculation
  const optimizedData = useMemo(() => {
    if (!event) return [];

    return event.consensusIntelligence.estimateDistribution.map((val, idx, arr) => {
      // Deterministic pseudo-random generation based on value and index
      // This ensures the chart shape is consistent for the same event data
      const seed = val * (idx + 137);
      const pseudoRandom = (Math.abs(Math.sin(seed)) * 8) + 10;

      return {
        name: val.toString(),
        value: idx === 0 || idx === arr.length - 1 ? 2 : pseudoRandom,
        isConsensus: val === event.consensus
      };
    }).sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
  }, [event]);

  if (!event) return null;

  const impactStyles = getImpactStyles(event.impact);
  const sentimentStyles = getSentimentStyles(event.historicalData.directionBias);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-background/40 z-40 backdrop-blur-sm",
          !prefersReducedMotion && "animate-in fade-in duration-300"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-title"
        aria-describedby="event-description"
        className={cn(
          "fixed right-0 top-0 h-full w-[600px] bg-card border-l border-border shadow-2xl z-50 overflow-y-auto",
          !prefersReducedMotion && "animate-in slide-in-from-right duration-300"
        )}
      >
        {/* Header Section */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/40 p-6 z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1.5 flex-1 mr-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={cn("text-[0.7rem] font-mono uppercase tracking-wider h-5", impactStyles.bg, impactStyles.text, impactStyles.border)}>
                  {event.impact} Impact
                </Badge>
                <span className="text-[0.7rem] text-muted-foreground font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <Activity className="w-3 h-3" aria-hidden="true" />
                  {event.category}
                </span>
              </div>
              <h2 id="event-title" className="text-xl md:text-2xl font-bold text-foreground leading-tight tracking-tight">{event.name}</h2>
              <div id="event-description" className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground/80">{event.country}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{timeFormatter.format(event.datetime)}</span>
              </div>
            </div>

            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={cn(
                "h-9 w-9 rounded-full hover:bg-muted/50 -mt-1 -mr-2",
                !prefersReducedMotion && "transition-colors"
              )}
              aria-label="Close event intelligence panel"
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
              <div key={i} className={cn("p-3 bg-secondary/20 rounded-xl border border-border/20 text-center relative overflow-hidden group", !prefersReducedMotion && "transition-opacity")}>
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">{stat.label}</div>
                <div className={cn("text-lg font-mono font-bold tracking-tighter", stat.muted ? "text-muted-foreground/60" : "text-foreground", stat.highlight)}>{stat.value}</div>
                <div className="text-muted-foreground/40 font-medium uppercase mt-1">{stat.sub}</div>
                <div className={cn("absolute inset-0 bg-primary/5 opacity-0", !prefersReducedMotion && "group-hover:opacity-100 transition-opacity")} />
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
                  <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                  Expectation Curve
                </h3>
                <p className="text-muted-foreground font-medium uppercase tracking-tight opacity-70">Probability Distribution Density</p>
              </div>
              <Badge variant="secondary" className="font-mono bg-primary/20 text-primary border-primary/30 shadow-sm shadow-primary/10">
                {event.consensusIntelligence.surpriseProbability}% Surprise Prob
              </Badge>
            </div>

            <div className="h-48 w-full rounded-2xl border border-border/40 p-4 relative group overflow-hidden">
              {/* Shifting Gradient Background - Optimized with CSS */}
              <div
                className={cn(
                  "absolute inset-0 opacity-10",
                  !prefersReducedMotion && "transition-colors duration-1000"
                )}
                style={{ backgroundColor: event.historicalData.directionBias === 'bullish' ? '#10b981' :
                  event.historicalData.directionBias === 'bearish' ? '#f43f5e' : 'hsl(var(--primary))' }}
              />
              {/* CSS Animation Replacement for Motion */}
              <div
                className={cn(
                  "absolute inset-[-50%] blur-3xl opacity-10",
                  !prefersReducedMotion && "animate-pulse"
                )}
                style={{
                  background: event.historicalData.directionBias === 'bullish' ?
                    'linear-gradient(to right, #10b981, transparent, #10b981)' :
                    event.historicalData.directionBias === 'bearish' ?
                      'linear-gradient(to right, #f43f5e, transparent, #f43f5e)' :
                      'linear-gradient(to right, #22d3ee, transparent, #22d3ee)'
                }}
              />

              <div className="relative h-full w-full">
                <ProbabilityChart
                  data={optimizedData}
                  directionBias={event.historicalData.directionBias}
                  consensus={event.consensus}
                  prefersReducedMotion={prefersReducedMotion}
                />
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
              <Brain className="w-4 h-4 text-primary" aria-hidden="true" />
              <h3 className="text-xs font-bold uppercase tracking-widest">AI Intelligence Insight</h3>
            </div>

            <div className="relative border border-primary/20 rounded-2xl p-6 overflow-hidden group">
              {/* Strategic Background Shimmer - Optimized with CSS */}
              <div
                className={cn(
                  "absolute inset-0 opacity-10",
                  !prefersReducedMotion && "transition-colors duration-1000"
                )}
                style={{ backgroundColor: event.historicalData.directionBias === 'bullish' ? '#10b981' :
                  event.historicalData.directionBias === 'bearish' ? '#f43f5e' : '#22d3ee' }}
              />
              <div
                className={cn(
                  "absolute inset-0 blur-3xl opacity-5",
                  !prefersReducedMotion && "animate-pulse"
                )}
                style={{
                  backgroundColor: event.historicalData.directionBias === 'bullish' ? '#10b981' :
                    event.historicalData.directionBias === 'bearish' ? '#f43f5e' : '#22d3ee'
                }}
              />

              <div className={cn("absolute top-0 right-0 p-6 opacity-5 pointer-events-none", !prefersReducedMotion && "group-hover:scale-110 transition-transform duration-700")}>
                <Brain className="w-32 h-32" />
              </div>

              <div className="relative z-10 space-y-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-60">Strategic Bias</div>
                    <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                      {event.tradingSetup.strategyTag}
                      <Badge variant="outline" className="h-auto bg-primary/10 text-primary border-primary/20">
                        {event.tradingSetup.confidenceScore}% CONFIDENCE
                      </Badge>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <TrendingUp className="w-5 h-5" aria-hidden="true" />
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
            ].map((metric) => (
              <div key={metric.label} className={cn("p-4 rounded-2xl border border-border/40 bg-card/40 space-y-2 group hover:bg-card/60", !prefersReducedMotion && "transition-colors")}>
                <div className="flex items-center gap-2 font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  <metric.icon className={cn("w-3.5 h-3.5", metric.color)} aria-hidden="true" />
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
            <Button variant="outline" className={cn("w-full h-11 rounded-xl font-bold text-xs uppercase tracking-widest border-border/60 hover:bg-secondary/20 group", !prefersReducedMotion && "transition-all")} aria-label="Add event to watchlist">
              Watchlist
              <Activity className="w-3.5 h-3.5 ml-2 opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" aria-hidden="true" />
            </Button>
            <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-xs font-bold text-foreground" aria-label="Set intelligence alert for this event">
              <Bell className="w-3.5 h-3.5 mr-2" aria-hidden="true" />
              Set Intelligence Alert
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}

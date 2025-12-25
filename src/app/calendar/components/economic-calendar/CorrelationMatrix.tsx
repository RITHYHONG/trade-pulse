import { Network, TrendingUp, ArrowRight, Activity, Zap, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Correlation {
  event1: string;
  event2: string;
  strength: number; // -1 to 1
  leadLag: 'leads' | 'lags' | 'simultaneous';
  lagMinutes?: number;
}

const mockCorrelations: Correlation[] = [
  { event1: 'US NFP', event2: 'USD/JPY', strength: 0.85, leadLag: 'simultaneous' },
  { event1: 'USD/JPY', event2: 'Nikkei 225', strength: 0.72, leadLag: 'leads', lagMinutes: 5 },
  { event1: 'Nikkei 225', event2: 'Gold', strength: -0.65, leadLag: 'simultaneous' },
  { event1: 'US CPI', event2: 'DXY', strength: 0.78, leadLag: 'simultaneous' },
  { event1: 'DXY', event2: 'Gold', strength: -0.82, leadLag: 'simultaneous' },
  { event1: 'Gold', event2: 'Treasury Yields', strength: -0.68, leadLag: 'lags', lagMinutes: 15 },
  { event1: 'ECB Rate', event2: 'EUR/USD', strength: 0.88, leadLag: 'simultaneous' },
  { event1: 'EUR/USD', event2: 'DAX', strength: 0.71, leadLag: 'leads', lagMinutes: 10 },
];

export function CorrelationMatrix() {
  const getCorrelationStyles = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.8) {
      return strength > 0
        ? {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          text: 'text-emerald-500',
          dot: 'bg-emerald-500'
        }
        : {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          text: 'text-rose-500',
          dot: 'bg-rose-500'
        };
    }
    if (abs >= 0.6) {
      return strength > 0
        ? {
          bg: 'bg-emerald-500/5',
          border: 'border-emerald-500/15',
          text: 'text-emerald-500',
          dot: 'bg-emerald-400'
        }
        : {
          bg: 'bg-rose-500/5',
          border: 'border-rose-500/15',
          text: 'text-rose-500',
          dot: 'bg-rose-400'
        };
    }
    return {
      bg: 'bg-muted/30',
      border: 'border-border/50',
      text: 'text-muted-foreground',
      dot: 'bg-muted-foreground'
    };
  };

  const getStrengthLabel = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.8) return 'Very Strong';
    if (abs >= 0.6) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    return 'Weak';
  };

  const correlationChains = [
    ['US NFP', 'USD/JPY', 'Nikkei 225', 'Gold'],
    ['US CPI', 'DXY', 'Gold', 'Treasury Yields'],
    ['ECB Rate', 'EUR/USD', 'DAX']
  ];

  return (
    <div className="bg-card/40 rounded-xl p-4 md:p-6 border border-border/40 shadow-sm space-y-6">
      {/* Header - Compact for Sidebar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground tracking-tight">CROSS-MARKET</h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Live Analysis</p>
          </div>
        </div>
        <Badge variant="outline" className="h-5 text-[9px] font-mono border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-1.5">
          ACTIVE
        </Badge>
      </div>

      {/* Correlation Chains with Horizontal Scroll */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Impact Chains
          </span>
        </div>

        <div className="space-y-3">
          {correlationChains.map((chain, chainIndex) => (
            <ScrollArea key={chainIndex} className="w-full">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border/20 min-w-max">
                {chain.map((item, index) => {
                  const correlation = mockCorrelations.find(
                    c => (c.event1 === chain[index] && c.event2 === chain[index + 1]) ||
                      (c.event2 === chain[index] && c.event1 === chain[index + 1])
                  );

                  return (
                    <div key={index} className="flex items-center">
                      <div className="px-3 py-2 bg-background/50 rounded-lg border border-border/40 hover:border-primary/40 transition-colors">
                        <div className="text-[11px] font-semibold text-foreground whitespace-nowrap">
                          {item}
                        </div>
                      </div>

                      {index < chain.length - 1 && correlation && (
                        <div className="mx-2 flex items-center gap-1.5">
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 cursor-help group">
                                  <ArrowRight className={cn("w-3 h-3 transition-transform group-hover:translate-x-0.5", getCorrelationStyles(correlation.strength).text)} />
                                  <div className={cn("w-2 h-2 rounded-full", getCorrelationStyles(correlation.strength).dot)} />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="text-[10px] p-2 bg-popover/95 font-medium border-border/40">
                                <div>{correlation.strength > 0 ? '+' : ''}{correlation.strength.toFixed(2)} ({getStrengthLabel(correlation.strength)})</div>
                                {correlation.lagMinutes && <div className="text-muted-foreground opacity-70">{correlation.lagMinutes}m lag</div>}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="h-1.5" />
            </ScrollArea>
          ))}
        </div>
      </div>

      {/* Detailed List - Better for Vertically constrained Sidebars */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Key Relationships
          </span>
        </div>

        <div className="space-y-2">
          {mockCorrelations.slice(0, 5).map((corr, index) => {
            const styles = getCorrelationStyles(corr.strength);
            return (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-200",
                  styles.bg, styles.border
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-foreground/80">{corr.event1}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-foreground/80">{corr.event2}</span>
                  </div>
                  <span className={cn("text-[10px] font-mono font-bold", styles.text)}>
                    {corr.strength > 0 ? '+' : ''}{corr.strength.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[9px] text-muted-foreground font-medium uppercase tracking-tight">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary/60" />
                    {getStrengthLabel(corr.strength)}
                  </div>
                  {corr.lagMinutes && (
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-primary/60" />
                      {corr.lagMinutes}m {corr.leadLag}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simplified Legend */}
      <div className="pt-4 border-t border-border/30 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-medium text-muted-foreground">Pos Corr</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[9px] font-medium text-muted-foreground">Neg Corr</span>
        </div>
      </div>
    </div>
  );
}

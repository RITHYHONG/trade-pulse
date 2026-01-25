import { useMemo, memo } from 'react';
import { Network, TrendingUp, ArrowRight, Activity, Zap, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Correlation {
  event1: string;
  event2: string;
  strength: number; // -1 to 1
  leadLag: 'leads' | 'lags' | 'simultaneous';
  lagMinutes?: number;
}

// --- Static Helpers & Config ---
const CORRELATION_CHAINS = [
  ['US NFP', 'USD/JPY', 'Nikkei 225', 'Gold'],
  ['US CPI', 'DXY', 'Gold', 'Treasury Yields'],
  ['ECB Rate', 'EUR/USD', 'DAX']
];

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

// --- Child Components ---

const ChainLink = memo(({ item, isLast, correlation }: { item: string, isLast: boolean, correlation?: Correlation }) => {
  // Styles derived only when correlation exists
  const styles = correlation ? getCorrelationStyles(correlation.strength) : null;

  return (
    <div className="flex items-center">
      <div className="px-3 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/40 hover:border-primary/40 transition-colors relative z-10 shadow-sm flex items-center">
        <div className="text-[11px] font-semibold text-foreground whitespace-nowrap mx-auto">
          {item}
        </div>
      </div>

      {!isLast && correlation && styles && (
        <div className="mx-2 flex items-center gap-1.5">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help group">
                  <ArrowRight className={cn("w-3 h-3 transition-transform group-hover:translate-x-0.5", styles.text)} />
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", styles.dot)} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-[0.7rem] p-2 bg-popover/95 font-medium border-border/40">
                <div>{correlation.strength > 0 ? '+' : ''}{correlation.strength.toFixed(2)} ({getStrengthLabel(correlation.strength)})</div>
                {correlation.lagMinutes && <div className="text-muted-foreground opacity-70">{correlation.lagMinutes}m lag</div>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
});
ChainLink.displayName = 'ChainLink';


const RelationshipItem = memo(({ corr, index }: { corr: Correlation, index: number }) => {
  const styles = getCorrelationStyles(corr.strength);
  return (
    <div
      className={cn(
        "p-3 rounded-xl border transition-all duration-300 relative overflow-hidden group/item",
        styles.bg, styles.border
      )}
    >
      {/* Micro Pulse - CSS Native */}
      <div
        className={cn("absolute inset-0 opacity-0 group-hover/item:opacity-10 transition-opacity animate-pulse", styles.dot)}
        style={{ animationDuration: '3s' }}
      />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[0.7rem] font-bold text-foreground/80">{corr.event1}</span>
          <ArrowRight className="w-2.5 h-2.5 text-muted-foreground" />
          <span className="text-[0.7rem] font-bold text-foreground/80">{corr.event2}</span>
        </div>
        <span className={cn("text-[0.7rem] font-mono font-bold", styles.text)}>
          {corr.strength > 0 ? '+' : ''}{corr.strength.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center gap-3 text-[0.8rem] text-muted-foreground font-medium uppercase tracking-tight">
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
});
RelationshipItem.displayName = 'RelationshipItem';

// --- Main Component ---

export const CorrelationMatrix = memo(({ correlations = [] }: { correlations?: Correlation[] }) => {
  // Optimization: Pre-compute correlation map for O(1) lookup
  const correlationMap = useMemo(() => {
    const map = new Map<string, Correlation>();
    correlations.forEach(c => {
      const key = [c.event1, c.event2].sort().join('|');
      map.set(key, c);
    });
    return map;
  }, [correlations]);

  const topCorrelations = useMemo(() => correlations.slice(0, 5), [correlations]);

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
            <p className="text-[0.7rem] text-muted-foreground font-medium uppercase tracking-wider">Live Analysis</p>
          </div>
        </div>
        <Badge variant="outline" className="h-5 text-[0.8rem] font-mono border-emerald-500/30 text-emerald-500 bg-emerald-500/5 px-1.5">
          ACTIVE
        </Badge>
      </div>

      {/* Correlation Chains with Horizontal Scroll */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
          <span className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-widest">
            Impact Chains
          </span>
        </div>

        <div className="space-y-3">
          {CORRELATION_CHAINS.map((chain, chainIndex) => (
            <ScrollArea key={chainIndex} className="w-full">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border/20 min-w-max relative overflow-hidden group/chain">
                {/* Horizontal Flow Aura - CSS Animation */}
                <motion.div
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent pointer-events-none"
                />
                {chain.map((item, index) => {
                  let correlation: Correlation | undefined;
                  const isLast = index === chain.length - 1;

                  if (!isLast) {
                    const key = [chain[index], chain[index + 1]].sort().join('|');
                    correlation = correlationMap.get(key);
                  }

                  return (
                    <ChainLink
                      key={index}
                      item={item}
                      isLast={isLast}
                      correlation={correlation}
                    />
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="h-1.5" />
            </ScrollArea>
          ))}
        </div>
      </div>

      {/* Detailed List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span className="text-[0.7rem] font-bold text-muted-foreground uppercase tracking-widest">
            Key Relationships
          </span>
        </div>

        <div className="space-y-2">
          {topCorrelations.map((corr, index) => (
            <RelationshipItem key={index} corr={corr} index={index} />
          ))}
        </div>
      </div>

      {/* Simplified Legend */}
      <div className="pt-4 border-t border-border/30 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[0.8rem] font-medium text-muted-foreground">Pos Corr</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[0.8rem] font-medium text-muted-foreground">Neg Corr</span>
        </div>
      </div>
    </div>
  );
});

CorrelationMatrix.displayName = 'CorrelationMatrix';

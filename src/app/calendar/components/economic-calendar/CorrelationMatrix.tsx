import { Network, TrendingUp, ArrowRight, Activity, Zap, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
            bg: 'bg-emerald-50 dark:bg-emerald-500/10',
            border: 'border-emerald-200 dark:border-emerald-500/20',
            text: 'text-emerald-600 dark:text-emerald-400',
            dot: 'bg-emerald-500',
            glow: 'shadow-sm hover:shadow-md'
          }
        : {
            bg: 'bg-rose-50 dark:bg-rose-500/10',
            border: 'border-rose-200 dark:border-rose-500/20',
            text: 'text-rose-600 dark:text-rose-400',
            dot: 'bg-rose-500',
            glow: 'shadow-sm hover:shadow-md'
          };
    }
    if (abs >= 0.6) {
      return strength > 0
        ? {
            bg: 'bg-emerald-50/50 dark:bg-emerald-500/5',
            border: 'border-emerald-200/70 dark:border-emerald-500/15',
            text: 'text-emerald-600 dark:text-emerald-400',
            dot: 'bg-emerald-400',
            glow: 'shadow-sm hover:shadow-md'
          }
        : {
            bg: 'bg-rose-50/50 dark:bg-rose-500/5',
            border: 'border-rose-200/70 dark:border-rose-500/15',
            text: 'text-rose-600 dark:text-rose-400',
            dot: 'bg-rose-400',
            glow: 'shadow-sm hover:shadow-md'
          };
    }
    if (abs >= 0.4) {
      return strength > 0
        ? {
            bg: 'bg-emerald-50/30 dark:bg-emerald-500/5',
            border: 'border-emerald-200/50 dark:border-emerald-500/10',
            text: 'text-emerald-500 dark:text-emerald-500',
            dot: 'bg-emerald-300 dark:bg-emerald-400',
            glow: 'shadow-sm hover:shadow'
          }
        : {
            bg: 'bg-rose-50/30 dark:bg-rose-500/5',
            border: 'border-rose-200/50 dark:border-rose-500/10',
            text: 'text-rose-500 dark:text-rose-500',
            dot: 'bg-rose-300 dark:bg-rose-400',
            glow: 'shadow-sm hover:shadow'
          };
    }
    return {
      bg: 'bg-muted/30',
      border: 'border-border/50',
      text: 'text-muted-foreground',
      dot: 'bg-muted-foreground',
      glow: ''
    };
  };

  const getStrengthLabel = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.8) return 'Very Strong';
    if (abs >= 0.6) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    return 'Weak';
  };

  // Group correlations into chains
  const correlationChains = [
    ['US NFP', 'USD/JPY', 'Nikkei 225', 'Gold'],
    ['US CPI', 'DXY', 'Gold', 'Treasury Yields'],
    ['ECB Rate', 'EUR/USD', 'DAX']
  ];

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cross-Market Correlation</h3>
            <p className="text-xs text-muted-foreground">Real-time market relationships</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-primary/10 border-primary/30 text-primary px-3 py-1 animate-pulse"
        >
          <Activity className="w-3 h-3 mr-1.5" />
          Live Analysis
        </Badge>
      </div>

      {/* Correlation Chains */}
      <div className="space-y-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Event Impact Chains
          </span>
        </div>

        {correlationChains.map((chain, chainIndex) => (
          <div
            key={chainIndex}
            className="relative p-5 rounded-xl bg-muted/30 border border-border"
          >

            <div className="relative flex items-center justify-between">
              {chain.map((item, index) => {
                const correlation = mockCorrelations.find(
                  c => (c.event1 === chain[index] && c.event2 === chain[index + 1]) ||
                       (c.event2 === chain[index] && c.event1 === chain[index + 1])
                );

                return (
                  <div key={index} className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="px-4 py-3 bg-background/80 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-background transition-all duration-200 cursor-pointer group">
                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {item}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Economic Event
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-popover border-border">
                          <div className="text-xs text-popover-foreground">
                            Click to view historical correlation data
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {index < chain.length - 1 && correlation && (
                      <div className="mx-4 flex items-center gap-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                                <ArrowRight className={`w-4 h-4 ${getCorrelationStyles(correlation.strength).text} group-hover:scale-110 transition-transform`} />
                                <div className={`w-3 h-3 rounded-full ${getCorrelationStyles(correlation.strength).dot} ring-2 ring-transparent group-hover:ring-muted-foreground/20 transition-all`} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-popover border-border">
                              <div className="text-xs space-y-1 text-popover-foreground">
                                <div className="font-medium">
                                  Correlation: {correlation.strength > 0 ? '+' : ''}{correlation.strength.toFixed(2)}
                                </div>
                                <div>Strength: {getStrengthLabel(correlation.strength)}</div>
                                {correlation.lagMinutes && (
                                  <div>Lag: {correlation.lagMinutes} minutes</div>
                                )}
                                <div className="text-muted-foreground">
                                  {correlation.leadLag === 'simultaneous' ? 'Simultaneous' :
                                   correlation.leadLag === 'leads' ? 'Leading indicator' : 'Lagging indicator'}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Correlation Table */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Detailed Correlations
          </span>
        </div>

        <div className="space-y-3">
          {mockCorrelations.map((corr, index) => {
            const styles = getCorrelationStyles(corr.strength);
            return (
              <div
                key={index}
                className={`
                  group relative p-4 rounded-xl border transition-all duration-200
                  ${styles.bg} ${styles.border} ${styles.glow}
                `}
              >

                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="text-xs border-border/50 bg-background/50 hover:bg-background transition-colors"
                      >
                        {corr.event1}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <Badge
                        variant="outline"
                        className="text-xs border-border/50 bg-background/50 hover:bg-background transition-colors"
                      >
                        {corr.event2}
                      </Badge>
                    </div>
                    <Badge className={`${styles.bg} ${styles.text} border-0 font-semibold text-xs px-2 py-1`}>
                      {corr.strength > 0 ? '+' : ''}{corr.strength.toFixed(2)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                      <span className="text-muted-foreground">Strength:</span>
                      <span className={`font-medium ${styles.text}`}>
                        {getStrengthLabel(corr.strength)}
                      </span>
                    </div>

                    {corr.lagMinutes && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-primary" />
                          <span className="text-muted-foreground">
                            {corr.leadLag === 'leads' ? 'Leads' : 'Lags'} by:
                          </span>
                          <span className="font-medium text-foreground">{corr.lagMinutes}min</span>
                        </div>
                      </>
                    )}

                    {corr.leadLag === 'simultaneous' && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                        <div className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-primary" />
                          <span className="text-muted-foreground">Simultaneous impact</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Correlation Strength Legend
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            <span className="text-xs text-muted-foreground">Strong Positive (0.8+)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
            <span className="text-xs text-muted-foreground">Moderate Positive (0.4+)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
            <span className="text-xs text-muted-foreground">Strong Negative (-0.8)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-400 ring-2 ring-rose-400/20" />
            <span className="text-xs text-muted-foreground">Moderate Negative (-0.4)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

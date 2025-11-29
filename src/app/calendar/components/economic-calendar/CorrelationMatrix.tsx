import { Network, TrendingUp, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
  const getStrengthColor = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.8) return strength > 0 ? 'bg-green-600' : 'bg-red-600';
    if (abs >= 0.6) return strength > 0 ? 'bg-green-500' : 'bg-red-500';
    if (abs >= 0.4) return strength > 0 ? 'bg-green-400' : 'bg-red-400';
    return 'bg-slate-600';
  };

  const getStrengthLabel = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.8) return 'Very Strong';
    if (abs >= 0.6) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    return 'Weak';
  };

  const getStrengthTextColor = (strength: number) => {
    const abs = Math.abs(strength);
    if (abs >= 0.8) return strength > 0 ? 'text-green-400' : 'text-red-400';
    if (abs >= 0.6) return strength > 0 ? 'text-green-500' : 'text-red-500';
    return 'text-slate-400';
  };

  // Group correlations into chains
  const correlationChains = [
    ['US NFP', 'USD/JPY', 'Nikkei 225', 'Gold'],
    ['US CPI', 'DXY', 'Gold', 'Treasury Yields'],
    ['ECB Rate', 'EUR/USD', 'DAX']
  ];

  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Network className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg text-white">Cross-Market Correlation</h3>
        <Badge variant="outline" className="ml-auto text-gray-400 bg-white/5 border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 px-4 py-1.5"
                    >
          Live Analysis
        </Badge>
      </div>

      {/* Correlation Chains */}
      <div className="space-y-6 mb-6">
        <div className="text-sm text-slate-400 mb-3">Event Impact Chains</div>
        {correlationChains.map((chain, chainIndex) => (
          <Card key={chainIndex} className="bg-slate-950 border-slate-800 p-4">
            <div className="flex items-center justify-between">
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
                          <div className="px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 hover:border-blue-600 transition-colors cursor-pointer">
                            <div className="text-sm text-white">{item}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-800 border-slate-700">
                          <div className="text-xs">
                            Click to view historical correlation data
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {index < chain.length - 1 && correlation && (
                      <div className="mx-3 flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2">
                                <ArrowRight className={`w-4 h-4 ${getStrengthTextColor(correlation.strength)}`} />
                                <div className={`w-2 h-2 rounded-full ${getStrengthColor(correlation.strength)}`} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-slate-800 border-slate-700">
                              <div className="text-xs space-y-1">
                                <div>Correlation: {correlation.strength.toFixed(2)}</div>
                                <div>Strength: {getStrengthLabel(correlation.strength)}</div>
                                {correlation.lagMinutes && (
                                  <div>Lag: {correlation.lagMinutes} minutes</div>
                                )}
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
          </Card>
        ))}
      </div>

      {/* Correlation Table */}
      <div>
        <div className="text-sm text-slate-400 mb-3">Detailed Correlations</div>
        <div className="space-y-2">
          {mockCorrelations.map((corr, index) => (
            <div 
              key={index}
              className="bg-slate-950 border border-slate-800 rounded-lg p-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-slate-700">
                    {corr.event1}
                  </Badge>
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <Badge variant="outline" className="text-xs border-slate-700">
                    {corr.event2}
                  </Badge>
                </div>
                <Badge className={getStrengthColor(corr.strength)}>
                  {corr.strength > 0 ? '+' : ''}{corr.strength.toFixed(2)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Strength:</span>
                  <span className={getStrengthTextColor(corr.strength)}>
                    {getStrengthLabel(corr.strength)}
                  </span>
                </div>
                {corr.lagMinutes && (
                  <>
                    <span className="text-slate-700">•</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">
                        {corr.leadLag === 'leads' ? 'Leads' : 'Lags'} by:
                      </span>
                      <span className="text-slate-400">{corr.lagMinutes}min</span>
                    </div>
                  </>
                )}
                {corr.leadLag === 'simultaneous' && (
                  <>
                    <span className="text-slate-700">•</span>
                    <span className="text-slate-500">Simultaneous impact</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 mb-2">Correlation Strength</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-xs text-slate-500">Strong Positive (0.8+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500">Moderate Positive (0.4+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span className="text-xs text-slate-500">Strong Negative (-0.8)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-xs text-slate-500">Moderate Negative (-0.4)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

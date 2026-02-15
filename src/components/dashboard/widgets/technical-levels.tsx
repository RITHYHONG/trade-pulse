"use client";

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const DATA = [
      { symbol: "EURUSD", bias: "Bearish", sentiment: 32, level: "1.0850", change: "-0.45%" },
      { symbol: "GBPUSD", bias: "Neutral", sentiment: 48, level: "1.2640", change: "+0.12%" },
      { symbol: "XAUUSD", bias: "Bullish", sentiment: 85, level: "2045.20", change: "+1.20%" },
      { symbol: "US30", bias: "Bullish", sentiment: 72, level: "38500", change: "+0.65%" },
      { symbol: "BTCUSD", bias: "Bullish", sentiment: 91, level: "65400", change: "+3.40%" },
];

export function TechnicalLevelsWidget() {
      return (
            <div className="rounded-xl border border-border bg-card p-0 shadow-sm h-full overflow-hidden">
                  <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
                        <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                              <h3 className="font-semibold text-sm">Technical Bias</h3>
                        </div>
                        <span className="text-xs text-muted-foreground">H4 Timeframe</span>
                  </div>

                  <div className="divide-y divide-border">
                        {DATA.map((item) => (
                              <div key={item.symbol} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-default group">
                                    <div className="flex items-center gap-3">
                                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-bold text-[10px] text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                {item.symbol.substring(0, 2)}
                                          </div>
                                          <div>
                                                <p className="text-sm font-semibold">{item.symbol}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                      <span className="text-xs text-muted-foreground">Key Level:</span>
                                                      <span className="text-xs font-mono">{item.level}</span>
                                                </div>
                                          </div>
                                    </div>

                                    <div className="text-right">
                                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mb-1
                            ${item.bias === 'Bullish' ? 'bg-emerald-500/10 text-emerald-500' :
                                                      item.bias === 'Bearish' ? 'bg-destructive/10 text-destructive' : 'bg-gray-500/10 text-gray-500'}`
                                          }>
                                                {item.bias === 'Bullish' && <ArrowUpRight className="h-3 w-3" />}
                                                {item.bias === 'Bearish' && <ArrowDownRight className="h-3 w-3" />}
                                                {item.bias === 'Neutral' && <Minus className="h-3 w-3" />}
                                                {item.bias}
                                          </div>
                                          <p className={`text-xs font-medium ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-destructive'}`}>
                                                {item.change}
                                          </p>
                                    </div>
                              </div>
                        ))}
                  </div>
                  <div className="p-3 text-center border-t border-border bg-muted/20">
                        <button className="text-xs font-medium text-primary hover:underline">View All Analysis</button>
                  </div>
            </div>
      );
}

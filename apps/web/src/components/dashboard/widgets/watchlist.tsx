"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Basic interface for watchlist items
interface WatchlistItem {
      symbol: string;
      price: number;
      change: number;
      changePercent: number;
      name?: string;
}

interface WatchlistWidgetProps {
      instruments: WatchlistItem[];
      isLoading?: boolean;
}

export function WatchlistWidget({ instruments, isLoading }: WatchlistWidgetProps) {
      const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
      if (isLoading) return <div className="h-96 rounded-xl bg-muted/20 animate-pulse" />;

      // Fill with dummy data if empty for visualization
      const data = instruments.length > 0 ? instruments : [
            { symbol: "EURUSD", price: 1.0845, change: -0.0023, changePercent: -0.21, name: "Euro / US Dollar" },
            { symbol: "GBPUSD", price: 1.2630, change: 0.0012, changePercent: 0.10, name: "British Pound" },
            { symbol: "USDJPY", price: 151.20, change: 0.45, changePercent: 0.30, name: "US Dollar / Yen" },
            { symbol: "XAUUSD", price: 2035.50, change: 12.40, changePercent: 0.61, name: "Gold" },
            { symbol: "BTCUSD", price: 65120.00, change: 1250.00, changePercent: 1.95, name: "Bitcoin" },
            { symbol: "SPX500", price: 5105.20, change: -15.50, changePercent: -0.30, name: "S&P 500" },
      ];

      return (
            <Card className="h-full border-border bg-card shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <LineChart className="h-5 w-5" />
                              </div>
                              <div>
                                    <h3 className="font-bold text-lg">Market Watch</h3>
                                    <p className="text-xs text-muted-foreground">Live Quotes</p>
                              </div>
                        </div>
                  </div>

                  <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm text-left" aria-label="Live market watchlist">
                              <caption className="sr-only">Live market watchlist with current prices and change percentages.</caption>
                              <thead className="text-xs text-muted-foreground bg-muted/30 uppercase font-medium">
                                    <tr>
                                          <th className="px-6 py-3">Symbol</th>
                                          <th className="text-right px-6 py-3">Price</th>
                                          <th className="text-right px-6 py-3">Change</th>
                                    </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                    {data.map((item) => {
                                    const isSelected = item.symbol === selectedSymbol || (selectedSymbol === null && data[0]?.symbol === item.symbol);
                                    return (
                                          <tr
                                                key={item.symbol}
                                                tabIndex={0}
                                                role="button"
                                                aria-label={`Select ${item.symbol} details`}
                                                aria-selected={isSelected}
                                                onClick={() => setSelectedSymbol(item.symbol)}
                                                onKeyDown={(event) => {
                                                      if (event.key === 'Enter' || event.key === ' ') {
                                                            event.preventDefault();
                                                            setSelectedSymbol(item.symbol);
                                                      }
                                                }}
                                                className={cn(
                                                      "transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                                      isSelected ? "bg-primary/10" : "hover:bg-muted/30",
                                                )}
                                          >
                                                <td className="px-6 py-4">
                                                      <div className="font-bold text-foreground">{item.symbol}</div>
                                                      <div className="text-xs text-muted-foreground">{item.name}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-medium">
                                                      {item.price.toFixed(item.symbol.includes('JPY') ? 2 : item.symbol.includes('BTC') ? 0 : 4)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                      <div className={cn("inline-flex items-center gap-1 font-medium px-2 py-0.5 rounded-full text-xs",
                                                            item.change >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                                                      )}>
                                                            {item.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                                            {Math.abs(item.changePercent).toFixed(2)}%
                                                      </div>
                                                </td>
                                          </tr>
                                    );
                              })}
                              </tbody>
                        </table>
                  </div>
                  <div className="mt-5 rounded-xl border border-border bg-muted/50 p-5">
                        <h4 className="text-sm font-semibold">Selected Instrument</h4>
                        {data.length > 0 ? (
                              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                                    <p className="font-medium text-foreground">{data.find((item) => item.symbol === selectedSymbol)?.name ?? data[0].name}</p>
                                    <p>Price: ${data.find((item) => item.symbol === selectedSymbol)?.price.toFixed(4) ?? data[0].price.toFixed(4)}</p>
                                    <p>Change: {data.find((item) => item.symbol === selectedSymbol)?.change.toFixed(2) ?? data[0].change.toFixed(2)} ({data.find((item) => item.symbol === selectedSymbol)?.changePercent.toFixed(2) ?? data[0].changePercent.toFixed(2)}%)</p>
                                    <p>Sector: {data.find((item) => item.symbol === selectedSymbol)?.sector ?? data[0].sector}</p>
                              </div>
                        ) : (
                              <p className="text-sm text-muted-foreground">Select a symbol to view more details.</p>
                        )}
                  </div>
            </Card>
      );
}


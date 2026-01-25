"use client";

import { useState, useEffect, useCallback } from 'react';
import { type MarketItem } from '@/lib/market-data-service';
import { Marquee } from '@/components/ui/marquee';

interface NewsTickerProps {
  isLoading?: boolean;
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const FALLBACK_MARKET_DATA: MarketItem[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change: 125.20, changePercent: 0.19, type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3450.25, change: -12.40, changePercent: -0.36, type: 'crypto' },
  { symbol: 'EUR/USD', name: 'Euro', price: 1.0854, change: 0.0012, changePercent: 0.11, type: 'currency' },
  { symbol: 'GBP/USD', name: 'British Pound', price: 1.2642, change: -0.0008, changePercent: -0.06, type: 'currency' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: 1.25, changePercent: 0.66, type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.20, change: 14.30, changePercent: 1.66, type: 'stock' },
];

export function NewsTicker({ isLoading }: NewsTickerProps) {
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [tickerSentiments, setTickerSentiments] = useState<Record<string, { score: number, sentiment: string }>>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setDataLoading(true);
        setError(null);
        const response = await fetch('/api/market/all-data');
        if (!response.ok) throw new Error('Failed to fetch market data from proxy');
        const data = await response.json();
        if (data && data.length > 0) {
          setMarketData(data);

          // Fetch sentiment for displayed tickers
          const tickers = data.map((item: MarketItem) => item.symbol);
          try {
            const sentResponse = await fetch('/api/market/ticker-sentiment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tickers })
            });
            const sentData = await sentResponse.json();
            if (sentData.sentiment) {
              setTickerSentiments(sentData.sentiment);
            }
          } catch (e) {
            console.error('Failed to fetch individual sentiments', e);
          }
        } else if (marketData.length === 0) {
          // Only use fallback if we don't have any data yet
          setMarketData(FALLBACK_MARKET_DATA);
        }
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to load live market data');
        if (marketData.length === 0) {
          setMarketData(FALLBACK_MARKET_DATA);
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [marketData.length]);

  // Format helper functions
  const formatPrice = useCallback((price: number, type: string) => {
    if (type === 'crypto' || type === 'stock') {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return price.toFixed(4);
  }, []);

  const formatChange = useCallback((change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  }, []);

  // Loading state
  if (isLoading || dataLoading || marketData.length === 0) {
    return (
      <section className="py-3 bg-muted/50 border-y border-border overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 overflow-hidden relative">
              <div className="flex gap-8 animate-pulse">
                <div className="h-4 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 bg-muted rounded w-28"></div>
                <div className="h-4 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-3 bg-muted/50 border-y border-border overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 text-muted-foreground text-sm">
              {error} - Using cached data
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-3 bg-muted/50 border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">

          {/* Scrolling Content */}
          <div className="flex-1 overflow-hidden relative">
            <Marquee
              pauseOnHover={true}
              repeat={6}
              className="[--duration:60s] [--gap:2rem]"
            >
              {marketData.map((item, index) => (
                <div
                  key={`${item.symbol}-${index}`}
                  className="inline-flex items-center gap-3 flex-shrink-0"
                >
                  {/* Symbol and Name */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      {item.symbol}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.name}
                    </span>
                  </div>

                  {/* Price */}
                  <span className="text-foreground text-sm font-semibold">
                    {formatPrice(item.price, item.type)}
                  </span>

                  {/* Change Indicator */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm tabular-nums ${item.change >= 0
                      ? 'text-green-600 bg-green-50 dark:bg-green-950/20'
                      : 'text-red-600 bg-red-50 dark:bg-red-950/20'
                      }`}>
                      {formatChange(item.change, item.changePercent)}
                    </span>

                    {tickerSentiments[item.symbol] && (
                      <span className={`text-[9px] font-bold uppercase px-1 py-0.5 rounded-sm border ${tickerSentiments[item.symbol].sentiment === 'Bullish'
                        ? 'text-primary border-primary/20 bg-primary/5'
                        : tickerSentiments[item.symbol].sentiment === 'Bearish'
                          ? 'text-rose-500 border-rose-500/20 bg-rose-500/5'
                          : 'text-muted-foreground border-border/40 bg-muted/5'
                        }`}>
                        {tickerSentiments[item.symbol].sentiment} {tickerSentiments[item.symbol].score}%
                      </span>
                    )}
                  </div>

                  {/* Dot separator */}
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { MarketItem };

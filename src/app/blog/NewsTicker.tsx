"use client";

import { useState, useEffect, useRef } from 'react';
import { getAllMarketData, type MarketItem } from '@/lib/market-data-service';

interface NewsTickerProps {
  isLoading?: boolean;
}

export function NewsTicker({ isLoading }: NewsTickerProps) {
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setDataLoading(true);
        setError(null);
        const data = await getAllMarketData();
        setMarketData(data);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError('Failed to load market data');
      } finally {
        setDataLoading(false);
      }
    };

    fetchMarketData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!scrollRef.current || marketData.length === 0) return;

    const scrollElement = scrollRef.current;
    let position = 0;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      position -= speed;

      // Reset position when we've scrolled through half the content
      if (Math.abs(position) >= scrollElement.scrollWidth / 2) {
        position = 0;
      }

      scrollElement.style.transform = `translateX(${position}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleMouseLeave = () => {
      animate();
    };

    scrollElement.addEventListener('mouseenter', handleMouseEnter);
    scrollElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      scrollElement.removeEventListener('mouseenter', handleMouseEnter);
      scrollElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [marketData]);

  if (isLoading || dataLoading || marketData.length === 0) {
    return (
      <section className="py-3 bg-muted/50 border-y border-border overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-semibold">
              Market Pulse
            </div>
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

  if (error) {
    return (
      <section className="py-3 bg-muted/50 border-y border-border overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-semibold">
              Market Pulse
            </div>
            <div className="flex-1 text-muted-foreground text-sm">
              {error} - Using cached data
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Create multiple duplicated data for ultra-smooth endless scrolling
  const duplicatedData = Array(6).fill(marketData).flat();

  const formatPrice = (price: number, type: string) => {
    if (type === 'crypto' || type === 'stock') {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return price.toFixed(4);
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  return (
    <section className="py-3 bg-muted/50 border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Label */}
          <div className="flex-shrink-0 bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-semibold">
            Market Pulse
          </div>

          {/* Scrolling Content */}
          <div className="flex-1 overflow-hidden relative">
            <div
              ref={scrollRef}
              className="flex gap-8 whitespace-nowrap"
              style={{ width: 'max-content' }}
            >
              {duplicatedData.map((item, index) => (
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
                  <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                    item.change >= 0
                      ? 'text-green-600 bg-green-50 dark:bg-green-950/20'
                      : 'text-red-600 bg-red-50 dark:bg-red-950/20'
                  }`}>
                    {formatChange(item.change, item.changePercent)}
                  </span>

                  {/* Dot separator */}
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    item.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// lib/market-data-service.ts
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function getCryptoPrices() {
  const response = await fetch(
    `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`
  );
  return response.json();
}

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, Minus, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SentimentData {
      category: string;
      score: number;
      label: string;
      brief: string;
}

const DEFAULT_SENTIMENTS: SentimentData[] = [
  {
    category: "Global Market",
    score: 72,
    label: "Bullish",
    brief: "Premarket indicators show high-volume institutional buying demand."
  },
  {
    category: "Tech Sector",
    score: 68,
    label: "Bullish",
    brief: "AI semiconductor momentum continues to outpace index volatility."
  },
  {
    category: "Crypto Sector",
    score: 55,
    label: "Neutral",
    brief: "Bitcoin tests $67k resistance, altcoins remain range-bound."
  }
];

export function MarketSentimentWidget() {
      const [sentiments, setSentiments] = useState<SentimentData[]>(DEFAULT_SENTIMENTS);
      const [isLoading, setIsLoading] = useState(false);
      const [currentIndex, setCurrentIndex] = useState(0);

      useEffect(() => {
            async function fetchSentiment() {
                  try {
                        const response = await fetch('/api/dashboard/sentiment');
                        if (!response.ok) throw new Error("API Network issue");
                        const data = await response.json();
                        if (data.sentiment && data.sentiment.length > 0) {
                              setSentiments(data.sentiment);
                        }
                  } catch (error) {
                        console.error('Failed to fetch sentiment:', error);
                  } finally {
                        setIsLoading(false);
                  }
            }

            fetchSentiment();
            const interval = setInterval(fetchSentiment, 300000); // Refresh every 5 minutes to scale under landing page load
            return () => clearInterval(interval);
      }, []);

      useEffect(() => {
            if (sentiments.length > 0) {
                  // Ensure index remains in bounds if sentiments array shrinks
                  setCurrentIndex((prev) => (prev >= sentiments.length ? 0 : prev));

                  const interval = setInterval(() => {
                        setCurrentIndex((prev) => (prev + 1) % sentiments.length);
                  }, 5000); // Rotate every 5 seconds
                  return () => clearInterval(interval);
            }
      }, [sentiments]);

      if (isLoading) {
            return (
                  <div className="flex items-center gap-2 bg-card/30 backdrop-blur-md px-4 py-2 rounded-full border border-border/40 w-fit">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-none">AI Market Pulse...</span>
                  </div>
            );
      }

      const current = sentiments[currentIndex];
      if (!current) return null;

      const getStatusColor = (label: string) => {
            const lowerLabel = label.toLowerCase();
            if (lowerLabel.includes('bullish')) return 'text-success bg-success/10 border-success/20';
            if (lowerLabel.includes('bearish')) return 'text-destructive bg-destructive/10 border-destructive/20';
            return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      };

      const Icon = current.score > 60 ? TrendingUp : current.score < 40 ? TrendingDown : Minus;

      return (
            <AnimatePresence mode="wait">
                  <motion.div
                        key={current.category}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex items-center gap-3 bg-card/40 backdrop-blur-xl px-4 py-2 rounded-full border border-border/40 shadow-xl shadow-primary/5 group"
                  >
                        <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                              <BrainCircuit className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter opacity-70">
                                          {current.category} Pulse
                                    </span>
                                    <Badge
                                          variant="outline"
                                          className={cn("h-4 px-1.5 text-[9px] font-bold border-0 font-mono", getStatusColor(current.label))}
                                    >
                                          {current.score}% {current.label}
                                    </Badge>
                              </div>
                              <p className="text-[11px] font-medium text-foreground/90 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                                    {current.brief}
                              </p>
                        </div>

                        <div className={cn("p-1.5 rounded-full", getStatusColor(current.label))}>
                              <Icon className="w-3.5 h-3.5" />
                        </div>
                  </motion.div>
            </AnimatePresence>
      );
}

"use client";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Zap, Newspaper, CalendarDays, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogMarketWrap() {
      const [summary, setSummary] = useState<string>('');
      const [isLoading, setIsLoading] = useState(true);
      const [timestamp, setTimestamp] = useState<string>('');

      useEffect(() => {
            async function fetchSummary() {
                  try {
                        const response = await fetch('/api/dashboard/ai-summary');
                        const data = await response.json();
                        if (data.summary) {
                              setSummary(data.summary);
                              setTimestamp(data.timestamp);
                        }
                  } catch (error) {
                        console.error('Failed to fetch market summary:', error);
                  } finally {
                        setIsLoading(false);
                  }
            }

            fetchSummary();
      }, []);

      if (isLoading) {
            return (
                  <div className="container mx-auto px-4 py-12">
                        <div className="bg-card/50 rounded-3xl p-8 border border-border/40 space-y-4">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-8 w-64" />
                              <div className="space-y-2 pt-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                              </div>
                        </div>
                  </div>
            );
      }

      // Split summary into paragraphs if it's not already
      const paragraphs = summary.split('\n\n').filter(p => p.trim());

      return (
            <div className="container mx-auto px-4 py-12">
                  <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-card via-card to-background rounded-3xl p-6 md:p-10 border border-primary/20 shadow-2xl relative overflow-hidden group"
                  >
                        {/* Background Sparkle Decoration */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                              <div className="flex-1 space-y-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                          <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                                <Sparkles className="w-5 h-5" />
                                          </div>
                                          <Badge variant="outline" className="h-5 bg-background/50 border-primary/20 text-primary font-mono text-[0.65rem] tracking-widest uppercase">
                                                AI Intelligence
                                          </Badge>
                                          <div className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground font-bold uppercase tracking-widest">
                                                <CalendarDays className="w-3 h-3" />
                                                {timestamp ? new Date(timestamp).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : 'Today'}
                                          </div>
                                    </div>

                                    <div className="space-y-2">
                                          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                                Daily <span className="text-primary italic">Market Wrap</span>
                                          </h2>
                                          <p className="text-muted-foreground font-medium">Institutional-grade intelligence for the current trading session.</p>
                                    </div>

                                    <div className="grid gap-6 text-foreground/85 leading-relaxed">
                                          {paragraphs.map((para, i) => (
                                                <div key={i} className="flex gap-4 group/para">
                                                      <div className="flex flex-col items-center pt-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/para:bg-primary transition-colors" />
                                                            {i < paragraphs.length - 1 && <div className="w-px flex-1 bg-border/40 my-2" />}
                                                      </div>
                                                      <p className="text-[0.95rem] md:text-lg font-medium">
                                                            {para}
                                                      </p>
                                                </div>
                                          ))}
                                    </div>
                              </div>

                              <div className="w-full md:w-72 space-y-4">
                                    <div className="p-5 rounded-2xl bg-background/60 border border-border/40 backdrop-blur-sm space-y-4 shadow-inner">
                                          <h4 className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                                <TrendingUp className="w-3.5 h-3.5 text-success" />
                                                Session Focus
                                          </h4>
                                          <div className="space-y-3">
                                                {[
                                                      { label: 'Market Sentiment', value: 'Bullish Bias', icon: Zap },
                                                      { label: 'Key Narrative', value: 'Macro Resilience', icon: Newspaper },
                                                      { label: 'Risk Factor', value: 'Yield Volatility', icon: Target },
                                                ].map((item, i) => (
                                                      <div key={i} className="space-y-1">
                                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter opacity-70 flex items-center gap-1.5">
                                                                  <item.icon className="w-2.5 h-2.5" />
                                                                  {item.label}
                                                            </div>
                                                            <div className="text-xs font-bold text-foreground">{item.value}</div>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>

                                    <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-border/40">
                                          <img
                                                src="https://images.unsplash.com/photo-1611974717483-9b664a069e2a?auto=format&fit=crop&q=80&w=400"
                                                alt="Market Pulse"
                                                className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/80">Monitor Active</span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </motion.div>
            </div>
      );
}

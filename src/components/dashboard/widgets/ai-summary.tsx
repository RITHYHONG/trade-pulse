"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ExternalLink, Sparkles, TrendingUp, Newspaper } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Interface matching the one used in news-api.ts
interface MarketNewsItem {
      id: string;
      title: string;
      summary: string;
      source: string;
      publishedAt: string;
      sentiment: "positive" | "negative" | "neutral";
      url: string;
      image?: string;
}

interface AISummaryWidgetProps {
      news: MarketNewsItem[];
      isLoading?: boolean;
}

export function AISummaryWidget({ news, isLoading }: AISummaryWidgetProps) {
      if (isLoading) {
            return (
                  <Card className="h-full border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                              <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="space-y-4">
                              {[1, 2, 3].map((i) => (
                                    <div key={i} className="space-y-2">
                                          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                                          <div className="h-3 w-full bg-muted animate-pulse rounded" />
                                    </div>
                              ))}
                        </div>
                  </Card>
            );
      }

      // Calculate sentiment score (simple)
      const positive = news.filter(n => n.sentiment === 'positive').length;
      const negative = news.filter(n => n.sentiment === 'negative').length;
      const sentimentScore = positive > negative ? "Bullish" : negative > positive ? "Bearish" : "Neutral";
      const sentimentColor = positive > negative ? "text-emerald-500" : negative > positive ? "text-destructive" : "text-amber-500";

      return (
            <Card className="h-full border-border bg-card shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-border bg-gradient-to-r from-background to-muted/20">
                        <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                          <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                          <h3 className="font-bold text-lg">Market Pulse AI</h3>
                                          <p className="text-xs text-muted-foreground">Real-time analysis</p>
                                    </div>
                              </div>
                              <div className={cn("px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset",
                                    sentimentScore === "Bullish" ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20" :
                                          sentimentScore === "Bearish" ? "bg-destructive/10 text-destructive ring-destructive/20" :
                                                "bg-amber-500/10 text-amber-500 ring-amber-500/20")}>
                                    {sentimentScore}
                              </div>
                        </div>

                        {news.length > 0 && (
                              <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex gap-2">
                                          <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                          <p className="text-sm font-medium leading-relaxed">
                                                {news[0].summary}
                                          </p>
                                    </div>
                              </div>
                        )}
                  </div>

                  <ScrollArea className="flex-1 p-0">
                        <div className="divide-y divide-border">
                              {news.slice(0, 5).map((item) => (
                                    <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors group">
                                          <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                                            <span className="font-medium text-foreground">{item.source}</span>
                                                            <span>•</span>
                                                            <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
                                                      </div>
                                                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block group-hover:text-primary transition-colors">
                                                            <h4 className="text-sm font-semibold leading-snug">{item.title}</h4>
                                                      </a>
                                                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                            {item.summary}
                                                      </p>
                                                </div>
                                                <div className={cn("shrink-0 h-2 w-2 rounded-full mt-2",
                                                      item.sentiment === 'positive' ? "bg-emerald-500" :
                                                            item.sentiment === 'negative' ? "bg-destructive" : "bg-muted-foreground")}
                                                />
                                          </div>
                                    </div>
                              ))}
                        </div>
                        <div className="p-4 border-t border-border bg-muted/10 text-center">
                              <Link href="/news" className="text-xs font-medium text-primary hover:underline flex items-center justify-center gap-1">
                                    View All Market News <ExternalLink className="h-3 w-3" />
                              </Link>
                        </div>
                  </ScrollArea>
            </Card>
      );
}

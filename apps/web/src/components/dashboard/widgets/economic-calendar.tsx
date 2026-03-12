"use client";

import { Card } from "@/components/ui/card";
import { CalendarDays, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Minimal interface for display
interface EconomicEvent {
      id: string;
      name: string;
      country: string;
      datetime: Date;
      impact: "low" | "medium" | "high";
      actual?: number;
      consensus?: number;
      previous?: number;
      unit: string;
}

interface EconomicCalendarWidgetProps {
      events: EconomicEvent[];
      isLoading?: boolean;
}

export function EconomicCalendarWidget({ events, isLoading }: EconomicCalendarWidgetProps) {
      if (isLoading) return <div className="h-64 rounded-xl bg-muted/20 animate-pulse" />;

      const highImpactEvents = events
            .filter(e => e.impact === 'high' || e.impact === 'medium')
            .slice(0, 5);

      return (
            <Card className="h-full border-border bg-card shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-border flex items-center gap-2">
                        <div className="p-1.5 rounded bg-primary/10 text-primary">
                              <CalendarDays className="h-4 w-4" />
                        </div>
                        <h3 className="font-semibold text-sm">Economic Calendar</h3>
                  </div>

                  <div className="flex-1 overflow-auto">
                        {highImpactEvents.length === 0 ? (
                              <div className="p-6 text-center text-muted-foreground text-sm">
                                    No high impact events soon.
                              </div>
                        ) : (
                              <div className="divide-y divide-border">
                                    {highImpactEvents.map((event) => (
                                          <div key={event.id} className="p-3 hover:bg-muted/30 transition-colors flex items-center gap-3">
                                                <div className="flex flex-col items-center justify-center h-10 w-10 rounded bg-muted text-xs font-medium shrink-0">
                                                      <span className="text-muted-foreground">{format(new Date(event.datetime), "HH:mm")}</span>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                      <div className="flex items-center gap-2 mb-0.5">
                                                            <span className={cn("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
                                                                  event.impact === 'high' ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"
                                                            )}>
                                                                  {event.impact}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                  <MapPin className="h-3 w-3" /> {event.country}
                                                            </span>
                                                      </div>
                                                      <p className="text-sm font-medium truncate">{event.name}</p>
                                                </div>

                                                <div className="text-right shrink-0">
                                                      <div className="text-xs font-mono">
                                                            <span className="text-muted-foreground">Fcst: </span>
                                                            <span className="text-foreground">{event.consensus}{event.unit}</span>
                                                      </div>
                                                </div>
                                          </div>
                                    ))}
                              </div>
                        )}
                  </div>
            </Card>
      );
}

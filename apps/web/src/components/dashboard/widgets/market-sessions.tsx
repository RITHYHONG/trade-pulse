"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, Globe } from "lucide-react";

const SESSIONS = [
      { name: "Sydney", start: 22, end: 7, color: "bg-amber-500" }, // UTC hours approx
      { name: "Tokyo", start: 0, end: 9, color: "bg-sky-500" },
      { name: "London", start: 8, end: 17, color: "bg-indigo-500" },
      { name: "New York", start: 13, end: 22, color: "bg-emerald-500" },
];

export function MarketSessionsWidget() {
      const [currentHour, setCurrentHour] = useState(0);
      const [currentMinute, setCurrentMinute] = useState(0);

      useEffect(() => {
            const updateTime = () => {
                  const now = new Date();
                  // Using UTC for market hours standardization
                  setCurrentHour(now.getUTCHours());
                  setCurrentMinute(now.getUTCMinutes());
            };
            updateTime();
            const interval = setInterval(updateTime, 60000);
            return () => clearInterval(interval);
      }, []);

      const getProgress = (start: number, end: number) => {
            // Simplified logic for session progress
            // Handle day wrap (e.g. Sydney starts 22h, ends 7h)
            let isActive = false;
            let progress = 0;

            // Normalizing time for display logic
            let now = currentHour + currentMinute / 60;

            // Check if simple range or overnight range
            if (start < end) {
                  isActive = now >= start && now < end;
                  if (isActive) progress = ((now - start) / (end - start)) * 100;
            } else {
                  // Overnight
                  isActive = now >= start || now < end;
                  if (isActive) {
                        let duration = (24 - start) + end;
                        let elapsed = now >= start ? now - start : (24 - start) + now;
                        progress = (elapsed / duration) * 100;
                  }
            }

            return { isActive, progress };
      };

      return (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Globe className="h-4 w-4" />
                              </div>
                              <div>
                                    <h3 className="font-semibold text-sm text-foreground">Market Sessions</h3>
                                    <p className="text-xs text-muted-foreground">UTC Timezone</p>
                              </div>
                        </div>
                        <div className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {currentHour.toString().padStart(2, '0')}:{currentMinute.toString().padStart(2, '0')} UTC
                        </div>
                  </div>

                  <div className="space-y-4">
                        {SESSIONS.map((session) => {
                              const { isActive, progress } = getProgress(session.start, session.end);
                              return (
                                    <div key={session.name} className="space-y-1.5">
                                          <div className="flex justify-between text-xs">
                                                <span className={cn("font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground")}>
                                                      {session.name}
                                                </span>
                                                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full transition-all",
                                                      isActive ? "bg-emerald-500/10 text-emerald-500 font-semibold" : "bg-muted text-muted-foreground")}>
                                                      {isActive ? "OPEN" : "CLOSED"}
                                                </span>
                                          </div>
                                          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden relative">
                                                <div
                                                      className={cn("h-full rounded-full transition-all duration-1000", session.color, isActive ? "opacity-100" : "opacity-30")}
                                                      style={{ width: isActive ? `${progress}%` : '100%' }}
                                                />
                                          </div>
                                    </div>
                              )
                        })}
                  </div>
            </div>
      );
}

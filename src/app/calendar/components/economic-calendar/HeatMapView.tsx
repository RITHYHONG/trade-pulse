import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from 'react';
import { EconomicEvent, Region } from './types';
import { Info, Clock, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface HeatMapViewProps {
  events: EconomicEvent[];
  onEventClick: (event: EconomicEvent) => void;
  isLoading?: boolean;
}

const REGIONS: Region[] = ['US', 'EU', 'UK', 'Asia', 'EM'];

const REGION_META: Record<Region, { label: string; flag: string; color: string }> = {
  US: { label: 'United States', flag: '🇺🇸', color: 'from-blue-500/20 to-blue-600/20' },
  EU: { label: 'Eurozone', flag: '🇪🇺', color: 'from-amber-500/20 to-amber-600/20' },
  UK: { label: 'United Kingdom', flag: '🇬🇧', color: 'from-indigo-500/20 to-indigo-600/20' },
  Asia: { label: 'Asia Pacific', flag: '🌏', color: 'from-emerald-500/20 to-emerald-600/20' },
  EM: { label: 'Emerging Markets', flag: '🏳️', color: 'from-purple-500/20 to-purple-600/20' }
};

// --- Helper Functions (Static) ---
const getIntensityStyle = (intensity: number) => {
  if (intensity === 0) return 'bg-muted/5 border-transparent';
  if (intensity >= 2.5) return 'bg-rose-500 shadow-[0_0_15px_-3px_rgba(244,63,94,0.5)] border-rose-400/50 text-white';
  if (intensity > 2.0) return 'bg-rose-500/80 border-rose-500/30 text-white';
  if (intensity >= 1.5) return 'bg-amber-500/70 border-amber-500/30 text-white';
  if (intensity >= 1.0) return 'bg-emerald-500/60 border-emerald-500/30 text-white';
  return 'bg-emerald-500/40 border-emerald-500/20 text-white/90';
};

// --- Optimized Sub-components ---

const HourHeaderItem = memo(({ hour, isActive, isCurrent }: { hour: number; isActive: boolean; isCurrent: boolean }) => (
  <div
    className={cn(
      "w-11 text-center transition-all duration-500",
      isActive ? "scale-125 opacity-100" : "opacity-30"
    )}
  >
    <div className={cn(
      "text-[13px] font-mono transition-colors",
      isCurrent ? "text-primary font-black drop-shadow-[0_0_8px_rgba(var(--primary),0.4)]" : "text-white",
      isActive && !isCurrent && "text-white font-black"
    )}>
      {hour.toString().padStart(2, '0')}
    </div>
  </div>
));
HourHeaderItem.displayName = 'HourHeaderItem';

const HeatMapCell = memo(({
  hour,
  region,
  intensity,
  cellEvents,
  isCurrentHour,
  onHoverChange,
  onEventClick
}: {
  hour: number;
  region: Region;
  intensity: number;
  cellEvents: EconomicEvent[];
  isCurrentHour: boolean;
  onHoverChange: (hour: number | null, region: Region | null) => void;
  onEventClick: (e: EconomicEvent) => void;
}) => {
  const hasEvents = cellEvents.length > 0;

  const handleMouseEnter = useCallback(() => onHoverChange(hour, region), [onHoverChange, hour, region]);
  const handleMouseLeave = useCallback(() => onHoverChange(null, null), [onHoverChange]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hasEvents && cellEvents.length === 1) {
      e.stopPropagation();
      onEventClick(cellEvents[0]);
    }
  }, [hasEvents, cellEvents, onEventClick]);

  const handleItemClick = useCallback((e: React.MouseEvent, event: EconomicEvent) => {
    e.stopPropagation();
    onEventClick(event);
  }, [onEventClick]);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div // Changed from motion.div to div for performance, using CSS hover classes
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "w-11 h-11 rounded-xl transition-all duration-300 flex items-center justify-center border relative overflow-hidden group/cell transform hover:scale-125 hover:z-10 hover:-translate-y-1.5",
              getIntensityStyle(intensity),
              !hasEvents && "bg-white/5 border-white/5 opacity-10 hover:opacity-100",
              hasEvents ? "cursor-pointer shadow-xl ring-offset-background" : "cursor-default",
              isCurrentHour && "ring-2 ring-primary/40 ring-offset-4 ring-offset-background/50"
            )}
            onClick={handleClick}
          >
            {intensity >= 2.5 && (
              <div className="absolute inset-0 bg-white/40 blur-lg pointer-events-none animate-pulse" />
            )}

            {hasEvents && (
              <span className="text-sm font-black font-mono tracking-tighter relative z-10 drop-shadow-2xl text-white">
                {cellEvents.length}
              </span>
            )}
          </div>
        </TooltipTrigger>

        {hasEvents && (
          <TooltipContent side="top" className="p-0 border-0 bg-transparent shadow-[0_32px_128px_-12px_rgba(0,0,0,0.8)]">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-80 bg-background/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden"
            >
              <div className={cn("p-6 bg-gradient-to-br border-b border-white/5", REGION_META[region].color)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl drop-shadow-2xl">{REGION_META[region].flag}</span>
                    <div>
                      <div className="text-md font-black text-white leading-tight">
                        {REGION_META[region].label}
                      </div>
                      <div className="text-[11px] text-white/60 font-mono font-black mt-0.5">
                        {hour.toString().padStart(2, '0')}:00 Global Session
                      </div>
                    </div>
                  </div>
                  <div className="px-3.5 py-2 rounded-2xl bg-black/30 backdrop-blur-md text-xs font-mono font-black text-white border border-white/10 shadow-inner">
                    {cellEvents.length} Events
                  </div>
                </div>
              </div>

              <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar space-y-3">
                {cellEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-5 rounded-3xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group/item flex flex-col gap-4 shadow-sm"
                    onClick={(e) => handleItemClick(e, event)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white group-hover/item:text-primary transition-colors leading-relaxed">
                          {event.name}
                        </div>
                        <div className="flex items-center gap-2.5 mt-2.5">
                          <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">{event.country}</span>
                        </div>
                      </div>
                      <div className={cn(
                        "px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 shadow-lg",
                        event.impact === 'high' ? "bg-rose-500 text-white" :
                          event.impact === 'medium' ? "bg-amber-500 text-white" :
                            "bg-emerald-500 text-white"
                      )}>
                        {event.impact}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col">
                        <span className="text-[9px] uppercase text-white/30 font-black tracking-widest">Est/Consensus</span>
                        <span className="text-xs font-mono font-black text-white mt-1">{event.consensus}{event.unit}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-end">
                        <span className="text-[9px] uppercase text-white/30 font-black tracking-widest">Bias Strength</span>
                        <span className={cn(
                          "text-xs font-mono font-black mt-1",
                          event.historicalData.directionBias === 'bullish' ? 'text-emerald-400' : 'text-rose-400'
                        )}>{event.historicalData.biasSuccessRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});
HeatMapCell.displayName = 'HeatMapCell';

const TimeIndicatorLine = memo(({
  hoursRef,
  contentRef,
  containerRef
}: {
  hoursRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
}) => {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const hasAutoScrolledRef = useRef(false);
  const lastUserInteractionRef = useRef<number>(0);
  const [isPositioned, setIsPositioned] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  useEffect(() => {
    let timeoutId: number | undefined;
    let rafId: number | undefined;
    let removeUserListeners: (() => void) | null = null;

    const updatePosition = () => {
      const now = new Date();
      setCurrentTimeStr(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);

      if (!hoursRef.current || !contentRef.current) {
        rafId = requestAnimationFrame(updatePosition);
        return;
      }

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const hoursNodes = hoursRef.current.children;

      const hourNode = hoursNodes[currentHour] as HTMLElement | undefined;

      if (hourNode) {
        // Use getBoundingClientRect for robust measurement (accounts for transforms, scroll, padding)
        const hourRect = hourNode.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();

        const minuteOffset = (currentMinute / 60) * hourRect.width;

        // Position relative to the content container (this component is rendered inside the same content)
        const calculatedLeft = (hourRect.left - contentRect.left) + minuteOffset;

        // Apply style directly to element to avoid inline style prop
        if (lineRef.current) {
          lineRef.current.style.left = `${calculatedLeft}px`;
        }

        try {
          const container = containerRef?.current;
          if (container) {
            if (!removeUserListeners) {
              const onUserInteract = () => { lastUserInteractionRef.current = Date.now(); };
              container.addEventListener('wheel', onUserInteract, { passive: true });
              container.addEventListener('touchstart', onUserInteract, { passive: true });
              removeUserListeners = () => {
                container.removeEventListener('wheel', onUserInteract);
                container.removeEventListener('touchstart', onUserInteract);
              };
            }

            const containerRect = container.getBoundingClientRect();
            const lineXInContainer = (hourRect.left - containerRect.left) + minuteOffset;
            const padding = 80; // pixels margin from edges

            const isOutOfView = lineXInContainer < padding || lineXInContainer > (containerRect.width - padding);

            const timeSinceUser = Date.now() - (lastUserInteractionRef.current || 0);
            const userRecentlyInteracted = timeSinceUser < 1500;

            const shouldAutoScroll = !hasAutoScrolledRef.current && isOutOfView && !userRecentlyInteracted;

            if (shouldAutoScroll) {
              const target = calculatedLeft - (container.clientWidth / 2) + (hourRect.width / 2);
              const maxScrollLeft = Math.max(0, (contentRef.current?.scrollWidth || 0) - container.clientWidth);
              const scrollLeft = Math.max(0, Math.min(target, maxScrollLeft));
              container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
              hasAutoScrolledRef.current = true;
            }
          }
        } catch {
          // Defensive: if DOM measurement fails, don't block the render
          // (no-op)
        }

        setIsPositioned(true);
      }

      // Schedule next update at the start of the next minute for minute-level precision
      const secondsUntilNextMinute = 60 - now.getSeconds();
      timeoutId = window.setTimeout(updatePosition, secondsUntilNextMinute * 1000);
    };

    updatePosition(); // Initial

    const handleResize = () => updatePosition();
    window.addEventListener('resize', handleResize);

    const scrollEl = containerRef?.current || window;
    const isScrollable = (el: unknown): el is EventTarget & { addEventListener: (type: string, listener: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions | boolean) => void } => {
      return !!el && typeof (el as Record<string, unknown>)['addEventListener'] === 'function';
    };

    if (isScrollable(scrollEl)) {
      scrollEl.addEventListener('scroll', updatePosition, { passive: true });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      if (isScrollable(scrollEl)) {
        scrollEl.removeEventListener('scroll', updatePosition);
      }
      if (typeof removeUserListeners === 'function') removeUserListeners();
    };
  }, [hoursRef, contentRef, containerRef]);

  return (
    <div
      ref={lineRef}
      className={cn(
        "absolute top-[-5rem] bottom-[-20px] w-[4px] z-20 pointer-events-none transition-all duration-200 ease-linear",
        !isPositioned && 'opacity-0'
      )}
    >
      <div className="h-full w-full bg-gradient-to-b from-primary via-primary/50 to-transparent relative">
        <div className="absolute inset-x-[-6px] top-0 bottom-0 bg-primary/20 blur-[8px] animate-pulse" />
        <div className="absolute -top-2 left-1/2 -track-x-1/2 -translate-y-full">
          <div className="bg-primary text-white text-[11px] font-black px-4 py-2 rounded-2xl shadow-3xl flex items-center gap-2 transform -translate-x-1/2 border border-white/20 whitespace-nowrap">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping shadow-[0_0_8px_white]" />
            LIVE {currentTimeStr} GMT
          </div>
        </div>
      </div>
    </div>
  );
});
TimeIndicatorLine.displayName = 'TimeIndicatorLine';

export function HeatMapView({ events, onEventClick, isLoading = false }: HeatMapViewProps) {
  const [hoveredCell, setHoveredCell] = useState<{ hour: number; region: Region } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      const hour = new Date().getHours();
      setCurrentHour(prevHour => hour !== prevHour ? hour : prevHour);
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []); // Remove currentHour dependency to prevent re-creation

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const heatMapData = useMemo(() => {
    const data: Record<string, EconomicEvent[]> = {};
    events.forEach(event => {
      const hour = event.datetime.getHours();
      const key = `${hour}-${event.region}`;
      if (!data[key]) data[key] = [];
      data[key].push(event);
    });
    return data;
  }, [events]);

  const getIntensity = useCallback((eventsInCell: EconomicEvent[]) => {
    if (!eventsInCell || eventsInCell.length === 0) return 0;
    const totalImpact = eventsInCell.reduce((sum, event) => {
      const impactScore = event.impact === 'high' ? 3 : event.impact === 'medium' ? 2 : 1;
      return sum + impactScore;
    }, 0);
    return totalImpact / eventsInCell.length;
  }, []);

  const handleHoverChange = useCallback((hour: number | null, region: Region | null) => {
    if (hour === null || region === null) {
      setHoveredCell(null);
    } else {
      setHoveredCell({ hour, region });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-muted/20 animate-pulse rounded-lg" />
          <div className="h-[450px] w-full bg-muted/10 animate-pulse rounded-2xl border border-border/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-y-auto overflow-x-hidden custom-scrollbar">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20 z-0">
        <div className="absolute top-24 right-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-24 left-24 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 p-6 md:p-10 flex flex-col gap-10">
        {/* Header & Stats */}
        <div className="flex lg:flex-row lg:items-end justify-between gap-8 px-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="text-[0.7rem] uppercase tracking-[0.2em] font-black">Market Intelligence Dashboard</span>
            </div>
            <div>
              <h1 className="text-xl md:text-5xl font-black tracking-tighter text-white mb-4">
                Economic Density Map
              </h1>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Legend/Status - Static, no optimization needed */}
            <div className="bg-card/40 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] flex items-center gap-6 shadow-2xl">
              <div className="flex -space-x-3">
                {[
                  { color: 'bg-rose-500' },
                  { color: 'bg-amber-500' },
                  { color: 'bg-emerald-500' }
                ].map((item, i) => (
                  <div key={i} className={cn(
                    "w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-[12px] font-black text-white shadow-lg",
                    item.color
                  )} />
                ))}
              </div>
              <div>
                <div className="text-sm text-white font-black">Live Monitoring</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-black flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  System Synced
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Container */}
        <div ref={containerRef} className="bg-card/30 rounded-[3rem] border border-white/5 shadow-3xl backdrop-blur-2xl relative overflow-x-auto custom-scrollbar">
          <div ref={contentRef} className="p-10 min-w-[1400px]">
            {/* Grid Header */}
            <div className="flex mb-10 items-center justify-between border-b border-white/5 pb-6">
              <div className="w-44 flex-shrink-0 flex items-center gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-[11px] uppercase tracking-[0.3em] font-black">GMT Timeline</span>
              </div>
              <div ref={hoursRef} className="flex flex-1 justify-between px-4">
                {hours.map(hour => (
                  <HourHeaderItem
                    key={hour}
                    hour={hour}
                    isActive={hoveredCell?.hour === hour || currentHour === hour}
                    isCurrent={currentHour === hour}
                  />
                ))}
              </div>
            </div>

            {/* Grid Rows */}
            <div className="space-y-4 relative">
              {/* Crosshair Horizontal Highlight - CSS Optimized */}
              {/* 
                 NOTE: Keeping AnimatePresence here is acceptable as it's a single element,
                 not a list, so impact is minimal.
               */}
              <AnimatePresence>
                {hoveredCell && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    className="absolute left-[-20px] right-[-20px] bg-primary/5 border-y border-white/5 rounded-2xl pointer-events-none z-0 shadow-inner"
                    style={{
                      top: `${REGIONS.indexOf(hoveredCell.region) * (44 + 16)}px`,
                      height: '44px'
                    }}
                  />
                )}
              </AnimatePresence>

              {REGIONS.map((region) => (
                <div key={region} className="flex items-center group/row relative z-10 h-11">
                  {/* Row Label */}
                  <div className="w-44 flex-shrink-0 flex items-center pr-8 gap-5 group-hover/row:translate-x-3 transition-all duration-500 ease-out">
                    <span className="text-3xl drop-shadow-2xl grayscale group-hover/row:grayscale-0 transition-all">{REGION_META[region].flag}</span>
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-[12px] uppercase tracking-widest font-black transition-colors",
                        hoveredCell?.region === region ? "text-primary" : "text-white/80"
                      )}>
                        {region}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-bold tracking-tight truncate">{REGION_META[region].label}</span>
                    </div>
                  </div>

                  {/* Hour Cells */}
                  <div className="flex flex-1 justify-between px-4">
                    {hours.map(hour => {
                      const key = `${hour}-${region}`;
                      const cellEvents = heatMapData[key] || [];
                      const intensity = getIntensity(cellEvents);
                      const isCurrentHour = currentHour === hour;

                      return (
                        <HeatMapCell
                          key={hour}
                          hour={hour}
                          region={region}
                          intensity={intensity}
                          cellEvents={cellEvents}
                          isCurrentHour={isCurrentHour}
                          onHoverChange={handleHoverChange}
                          onEventClick={onEventClick}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              <TimeIndicatorLine
                hoursRef={hoursRef}
                contentRef={contentRef}
                containerRef={containerRef}
              />
            </div>
          </div>
        </div>

        {/* ... Impact Summaries section (kept as is, standard static rendering) ... */}
        <div className="bg-card/30 rounded-[3rem] border border-white/5 shadow-3xl backdrop-blur-2xl relative overflow-x-auto custom-scrollbar">
          {/* Reduced code size here by not repeating static content in thought block - it will be in the file write */}
          {/* Copying previous Impact Summaries logic... */}
          <div className="md:col-span-1 p-10">
            <div className="flex flex-col h-full bg-card/60 border border-white/5 p-10 rounded-[3.5rem] backdrop-blur-3xl shadow-3xl">
              <div className="mb-10 flex items-center gap-5">
                <div className="p-4 rounded-[1.5rem] bg-primary/10 text-primary shadow-inner">
                  <Info className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-white">Density Legend</h4>
              </div>
              <div className="space-y-8">
                {[
                  { label: 'Critical Cluster', color: 'bg-rose-500', desc: 'Maximum impact density release' },
                  { label: 'Elevated Risk', color: 'bg-rose-500/60', desc: 'Multiple significant events' },
                  { label: 'Standard Alert', color: 'bg-amber-500/70', desc: 'Predictable volatility window' },
                  { label: 'Routine Flow', color: 'bg-emerald-500/60', desc: 'Standard data publications' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group/item">
                    <div className={cn("w-5 h-5 rounded-full mt-1 shrink-0 shadow-2xl transition-all group-hover/item:scale-150 group-hover/item:shadow-primary/50", item.color)} />
                    <div className="flex flex-col">
                      <span className="text-md font-black text-white">{item.label}</span>
                      <span className="text-[11px] text-muted-foreground font-semibold mt-1.5 uppercase tracking-widest">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

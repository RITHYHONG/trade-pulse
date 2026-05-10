import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CalendarLoadingStateProps {
  isMobile: boolean;
  sidebarOpen: boolean;
  intelPanelOpen: boolean;
}

export function CalendarLoadingState({ isMobile, sidebarOpen, intelPanelOpen }: CalendarLoadingStateProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/10 transition-colors duration-300">
      <div className="flex-none border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div className="hidden sm:block">
              <Skeleton className="h-4 w-32 mb-1.5" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40 w-fit">
              <Skeleton className="w-3.5 h-3.5 rounded-full" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Skeleton className="hidden lg:block h-6 w-20 rounded" />
          </div>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden relative pb-16 md:pb-0">
        {!isMobile && (
          <aside
            className={cn(
              "flex-none border-r border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 ease-in-out z-40 hidden md:block",
              sidebarOpen ? "w-72" : "w-0"
            )}
          >
            <div className="h-full relative flex flex-col bg-card/20 p-4 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[150px] w-full rounded-xl" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          </aside>
        )}

        <div className={cn("flex-1 flex flex-col min-w-0 bg-secondary/10 relative", isMobile && "hidden")}>
          <div className="flex-none px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              {!isMobile && (
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
              )}
              <div className="h-9 bg-muted/40 p-1 flex gap-1 border border-border/20 rounded-xl shrink-0">
                <Skeleton className="h-7 w-[108px] rounded-md" />
                <Skeleton className="h-7 w-[105px] rounded-md" />
                <Skeleton className="h-7 w-[78px] rounded-md" />
              </div>
            </div>
            <div className="hidden lg:flex items-end gap-2 mt-2 md:mt-0">
              <Skeleton className="h-8 w-[133px] rounded-md" />
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-4 md:px-6 pb-6">
            <div className="h-full bg-background/20 rounded-2xl border border-border/40 overflow-hidden shadow-inner flex flex-col">
              <div className="flex-1 p-6 space-y-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-16 h-4 mt-2" />
                    <Skeleton className="flex-1 h-20 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside
          className={cn(
            "flex-none border-l border-border/40 bg-background/30 transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
            intelPanelOpen ? (isMobile ? "fixed inset-x-0 inset-y-0 pb-16 z-40 bg-background" : "w-[320px] xl:w-[380px]") : "w-0"
          )}
        >
          <div className="flex-none p-5 border-b border-border/40 bg-background/40 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            {!isMobile && (
              <Skeleton className="h-7 w-7 rounded-full" />
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center"><Skeleton className="h-3 w-24" /><Skeleton className="h-4 w-16" /></div>
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><Skeleton className="h-3 w-32" /><Skeleton className="h-3 w-3 rounded-full" /></div>
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </aside>

        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-xl border-t border-border/50 flex items-center justify-around z-50">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center justify-center w-full h-full">
                <Skeleton className="w-5 h-5 mb-1 rounded" />
                <Skeleton className="h-2 w-10 rounded" />
              </div>
            ))}
          </nav>
        )}
      </main>
    </div>
  );
}
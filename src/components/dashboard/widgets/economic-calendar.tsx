import { Card } from "@/components/ui/card";
import type { EconomicEvent } from "@/app/calendar/components/economic-calendar/types";

interface EconomicCalendarWidgetProps {
  events: EconomicEvent[];
  isLoading?: boolean;
}

const impactStyles: Record<string, string> = {
  low: "bg-sky-500/10 text-sky-300",
  medium: "bg-amber-500/10 text-amber-300",
  high: "bg-rose-500/10 text-rose-300",
};

export function EconomicCalendarWidget({ events, isLoading = false }: EconomicCalendarWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Economic Calendar</h2>
            <p className="mt-1 text-sm text-slate-300/80">Track high-impact economic releases and plan your trading day.</p>
          </div>
          <span className="text-xs text-slate-400">Eastern Time</span>
        </div>
        <ul className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-start justify-between rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
              <div>
                <div className="h-4 w-28 bg-slate-700 rounded-md animate-pulse mb-2" />
                <div className="h-4 w-40 bg-slate-700 rounded-md animate-pulse mb-2" />
                <div className="h-3 w-56 bg-slate-700 rounded-md animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-slate-700 rounded-full animate-pulse" />
            </li>
          ))}
        </ul>
      </Card>
    );
  }
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Economic Calendar</h2>
          <p className="mt-1 text-sm text-slate-300/80">
            Track high-impact economic releases and plan your trading day.
          </p>
        </div>
        <span className="text-xs text-slate-400">Eastern Time</span>
      </div>

      <ul className="mt-5 space-y-3">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-start justify-between rounded-xl border border-slate-800/70 bg-slate-900/60 p-4"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {event.datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.country}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{event.name}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                <span>Consensus: {event.consensus}{event.unit}</span>
                <span>Previous: {event.previous}{event.unit}</span>
                {event.actual !== undefined && <span>Actual: {event.actual}{event.unit}</span>}
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${impactStyles[event.impact] || impactStyles.low}`}
            >
              {event.impact} impact
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
import Link from "next/link";
import { Card } from "@/components/ui/card";

const sampleAlerts = [
  {
    id: "alert-1",
    symbol: "AAPL",
    condition: "Crosses above $220",
    channel: "Push + Email",
    status: "active",
  },
  {
    id: "alert-2",
    symbol: "NVDA",
    condition: "RSI below 35",
    channel: "Push",
    status: "paused",
  },
  {
    id: "alert-3",
    symbol: "TSLA",
    condition: "15% drawdown in 5 days",
    channel: "Email",
    status: "active",
  },
];

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-300",
  paused: "bg-amber-500/10 text-amber-300",
};

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Smart Alerts</h1>
          <p className="text-sm text-slate-300/80">
            Automate entries and exits with AI-assisted price, momentum, and sentiment triggers.
          </p>
        </div>
        <Link
          href="/app/settings?tab=alerts"
          className="inline-flex h-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-4 text-sm font-semibold text-slate-200 transition hover:border-slate-600"
        >
          Alert preferences
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sampleAlerts.map((alert) => (
          <Card key={alert.id} className="border-slate-800/70 bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                  {alert.symbol}
                </span>
                <p className="mt-3 text-base font-semibold text-white">{alert.condition}</p>
                <p className="mt-2 text-sm text-slate-300/80">Delivery: {alert.channel}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[alert.status]}`}>
                {alert.status}
              </span>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <button className="rounded-full bg-sky-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-sky-400">
                Edit alert
              </button>
              <button className="rounded-full border border-slate-700 px-4 py-2 font-semibold text-slate-200 transition hover:border-slate-500">
                Pause
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-slate-800/70 bg-slate-900/40 text-center">
        <h2 className="text-lg font-semibold text-white">Need proactive coverage?</h2>
        <p className="mt-2 text-sm text-slate-300/80">
          Premium tiers unlock economic event alerts, options flow signals, and AI trade journaling.
        </p>
        <Link
          href="/app/upgrade"
          className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-sky-400 px-6 text-sm font-semibold text-slate-950 transition hover:from-sky-400 hover:to-sky-300"
        >
          Explore premium
        </Link>
      </Card>
    </div>
  );
}

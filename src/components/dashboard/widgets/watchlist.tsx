import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { WatchlistInstrument } from "@/types";

interface WatchlistWidgetProps {
  instruments: WatchlistInstrument[];
  isLoading?: boolean;
}

export function WatchlistWidget({ instruments, isLoading = false }: WatchlistWidgetProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full xl:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Watchlist</h2>
            <p className="mt-1 text-sm text-slate-300/80">Monitor price action for your high-conviction trades.</p>
          </div>
          <div className="text-xs font-semibold text-sky-400">&nbsp;</div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-800/70">
          <table className="min-w-full divide-y divide-slate-800/70">
            <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Change</th>
                <th className="px-4 py-3">Sector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="bg-slate-900/40">
                  <td className="px-4 py-3 font-semibold text-white">
                    <div className="w-12 h-4 bg-slate-700 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    <div className="w-32 h-4 bg-slate-700 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    <div className="w-16 h-4 bg-slate-700 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-16 h-4 bg-slate-700 rounded animate-pulse" />
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    <div className="w-20 h-4 bg-slate-700 rounded animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  }
  return (
    <Card className="col-span-full xl:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Watchlist</h2>
          <p className="mt-1 text-sm text-slate-300/80">
            Monitor price action for your high-conviction trades.
          </p>
        </div>
        <Link
          href="/app/watchlist"
          className="text-xs font-semibold text-sky-400 transition hover:text-sky-300 flex items-center gap-1"
        >
          Manage symbols
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-800/70">
        <table className="min-w-full divide-y divide-slate-800/70">
          <thead className="bg-slate-900/80 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Change</th>
              <th className="px-4 py-3">Sector</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {instruments.map((instrument) => {
              const changePositive = instrument.change >= 0;
              return (
                <tr
                  key={instrument.symbol}
                  className="bg-slate-900/40 transition hover:bg-slate-900/70"
                >
                  <td className="px-4 py-3 font-semibold text-white">
                    <Link href={`/app/watchlist/${instrument.symbol}`} className="hover:text-sky-300">
                      {instrument.symbol}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{instrument.name}</td>
                  <td className="px-4 py-3 text-slate-200">
                    ${instrument.price.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${changePositive ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {changePositive ? "+" : ""}
                    {instrument.change.toFixed(2)} ({changePositive ? "+" : ""}
                    {instrument.changePercent.toFixed(2)}%)
                  </td>
                  <td className="px-4 py-3 text-slate-300">{instrument.sector}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
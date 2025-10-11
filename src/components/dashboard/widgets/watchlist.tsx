import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { WatchlistInstrument } from "@/types";

interface WatchlistWidgetProps {
  instruments: WatchlistInstrument[];
}

export function WatchlistWidget({ instruments }: WatchlistWidgetProps) {
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
          className="text-xs font-semibold text-sky-400 transition hover:text-sky-300"
        >
          Manage symbols →
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
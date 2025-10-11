import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getWatchlist } from "@/lib/api/market-data";

async function WatchlistTable() {
  const instruments = await getWatchlist();

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between px-6 pb-4 pt-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Your Watchlist</h1>
          <p className="mt-1 text-sm text-slate-300/80">
            Track performance, volatility, and sector allocation across symbols.
          </p>
        </div>
        <Link
          href="/app/alerts"
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          Create alert
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800/70 text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Last Price</th>
              <th className="px-6 py-3">Change</th>
              <th className="px-6 py-3">Sector</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {instruments.map((instrument) => {
              const changePositive = instrument.change >= 0;
              return (
                <tr key={instrument.symbol} className="bg-slate-900/40">
                  <td className="px-6 py-4 font-semibold text-white">
                    <Link
                      href={`/app/watchlist/${instrument.symbol}`}
                      className="rounded-full bg-slate-800/40 px-3 py-1 text-xs uppercase tracking-wide text-slate-200 transition hover:bg-slate-700/60"
                    >
                      {instrument.symbol}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{instrument.name}</td>
                  <td className="px-6 py-4 text-slate-200">
                    ${instrument.price.toFixed(2)}
                  </td>
                  <td
                    className={`px-6 py-4 font-medium ${changePositive ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {changePositive ? "+" : ""}
                    {instrument.change.toFixed(2)} ({changePositive ? "+" : ""}
                    {instrument.changePercent.toFixed(2)}%)
                  </td>
                  <td className="px-6 py-4 text-slate-300">{instrument.sector}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-[420px]" />}>
        <WatchlistTable />
      </Suspense>
    </div>
  );
}

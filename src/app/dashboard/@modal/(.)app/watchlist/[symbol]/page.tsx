import Link from "next/link";
import { notFound } from "next/navigation";
import { getInstrumentDetail } from "@/lib/api/market-data";

interface WatchlistSymbolModalProps {
  params: { symbol: string };
}

export default async function WatchlistSymbolModal({ params }: WatchlistSymbolModalProps) {
  const detail = await getInstrumentDetail(params.symbol);

  if (!detail) {
    notFound();
  }

  const changePositive = detail.change >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-800/70 bg-slate-900 p-6 shadow-2xl shadow-slate-950/50">
        <Link
          href="/app/watchlist"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-slate-500"
          aria-label="Close modal"
        >
          ×
        </Link>
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-semibold text-white">{detail.name}</h2>
          <span className="rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
            {detail.symbol}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <span className="text-3xl font-bold text-white">${detail.price.toFixed(2)}</span>
          <span className={`text-lg font-semibold ${changePositive ? "text-emerald-400" : "text-rose-400"}`}>
            {changePositive ? "+" : ""}
            {detail.change.toFixed(2)} ({changePositive ? "+" : ""}
            {detail.changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Day range</p>
            <p className="mt-1 text-white">{detail.dayRange}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Volume</p>
            <p className="mt-1 text-white">{detail.volume.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Market cap</p>
            <p className="mt-1 text-white">${(detail.marketCap / 1e9).toFixed(1)}B</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Last update</p>
            <p className="mt-1 text-white">
              {new Date(detail.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3 text-sm">
          <Link
            href={`/app/watchlist/${detail.symbol}`}
            className="rounded-full bg-sky-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            View full page
          </Link>
          <Link
            href="/app/alerts"
            className="rounded-full border border-slate-700 px-4 py-2 font-semibold text-slate-200 transition hover:border-slate-500"
          >
            Create alert
          </Link>
        </div>
      </div>
    </div>
  );
}

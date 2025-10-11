import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getInstrumentDetail } from "@/lib/api/market-data";

interface WatchlistSymbolPageProps {
  params: { symbol: string };
}

export default async function WatchlistSymbolPage({ params }: WatchlistSymbolPageProps) {
  const detail = await getInstrumentDetail(params.symbol);

  if (!detail) {
    notFound();
  }

  const changePositive = detail.change >= 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">{detail.name}</h1>
        <p className="text-sm text-slate-300/80">Symbol • {detail.symbol}</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-baseline gap-4">
          <span className="text-4xl font-bold text-white">${detail.price.toFixed(2)}</span>
          <span className={`text-lg font-semibold ${changePositive ? "text-emerald-400" : "text-rose-400"}`}>
            {changePositive ? "+" : ""}
            {detail.change.toFixed(2)} ({changePositive ? "+" : ""}
            {detail.changePercent.toFixed(2)}%)
          </span>
        </div>
        <dl className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-4">
          <div>
            <dt className="uppercase tracking-wide text-slate-500">Day range</dt>
            <dd className="mt-1 text-white">{detail.dayRange}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide text-slate-500">Volume</dt>
            <dd className="mt-1 text-white">{detail.volume.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide text-slate-500">Market cap</dt>
            <dd className="mt-1 text-white">${(detail.marketCap / 1e9).toFixed(1)}B</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide text-slate-500">Last update</dt>
            <dd className="mt-1 text-white">
              {new Date(detail.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

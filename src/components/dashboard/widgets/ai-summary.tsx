import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { MarketNewsItem } from "@/types";
import { Skeleton, SkeletonText, SkeletonImage } from "@/components/ui/skeleton";

interface AISummaryWidgetProps {
  news: MarketNewsItem[];
  isLoading?: boolean;
}

export function AISummaryWidget({ news, isLoading = false }: AISummaryWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Market Summary</h2>
            <p className="mt-1 text-sm text-slate-300/80">AI-curated highlights from the latest market-moving headlines.</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">Updating</span>
        </div>

        <div className="mt-5 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <article key={i} className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                <SkeletonText className="w-24" />
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <SkeletonText className="w-12" />
              </div>
              <SkeletonText className="h-5 w-3/4 mt-2" />
              <SkeletonText className="h-4 w-full mt-3" />
              <div className="mt-3 flex items-center justify-between text-xs">
                <SkeletonText className="h-4 w-20" />
                <SkeletonText className="h-4 w-12" />
              </div>
            </article>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">AI Market Summary</h2>
          <p className="mt-1 text-sm text-slate-300/80">
            AI-curated highlights from the latest market-moving headlines.
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          Updated live
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {news.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4 transition hover:border-slate-700"
          >
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <span>{item.source}</span>
              <span className="h-1 w-1 rounded-full bg-slate-600" />
              <span>{new Date(item.publishedAt).toLocaleTimeString()}</span>
            </div>
            <h3 className="mt-2 text-base font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span
                className={
                  item.sentiment === "positive"
                    ? "text-emerald-400"
                    : item.sentiment === "negative"
                      ? "text-rose-400"
                      : "text-slate-300/80"
                }
              >
                Sentiment: {item.sentiment}
              </span>
              <Link
                href={item.url}
                className="text-xs font-semibold text-sky-400 transition hover:text-sky-300 flex items-center gap-1"
              >
                Read insight
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
} 
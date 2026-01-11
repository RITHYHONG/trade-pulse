import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import type { MarketNewsItem } from "@/types";

interface AISummaryWidgetProps {
  news: MarketNewsItem[];
  summary?: string;
}

export function AISummaryWidget({ news, summary }: AISummaryWidgetProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-4 p-6">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            AI Market Intelligence
          </h2>
          <p className="mt-1 text-sm text-slate-300/80">
            Real-time insights and pre-market analysis powered by Gemini AI.
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          Live Analysis
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        {summary && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-inner">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Today's Pulse Verdict</h3>
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Market Indicators</h3>
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
              <h3 className="mt-2 text-sm font-semibold text-white leading-tight">{item.title}</h3>
              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span
                  className={
                    item.sentiment === "positive"
                      ? "text-emerald-400"
                      : item.sentiment === "negative"
                        ? "text-rose-400"
                        : "text-slate-300/80"
                  }
                >
                  SENTIMENT: {item.sentiment?.toUpperCase()}
                </span>
                <Link
                  href={item.url}
                  className="font-bold text-sky-400 transition hover:text-sky-300 flex items-center gap-1"
                >
                  VIEW SOURCE
                  <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Card>
  );
}

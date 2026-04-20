import { TrendingUp, ArrowRight } from 'lucide-react';
import { BlogPost as BlogPostType } from '../../types/blog';

export function MarketOutlookWidget({ post }: { post: BlogPostType }) {
  if (!post.sentiment && !post.primaryAsset && !post.confidenceLevel && !post.timeHorizon) return null;

  return (
    <div className="mb-12 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* Header Section */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-black text-foreground tracking-tighter leading-none">
                {post.primaryAsset || "MARKET"}
              </h2>
              <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] font-bold text-orange-500 tracking-widest uppercase">
                Live Forecast
              </span>
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {post.category || "Asset Class Trust"}
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-2 text-orange-500">
              <TrendingUp className={`w-5 h-5 ${post.sentiment?.toLowerCase() === 'bearish' ? 'rotate-180' : ''}`} />
              <span className="text-sm font-black uppercase tracking-widest">
                {post.sentiment || "NEUTRAL"}
              </span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">
              Sentiment Score: 5.2/10
            </p>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="px-6 mt-4 relative h-48 w-full group/chart">
          <div className="absolute top-4 right-6 z-10">
            <div className="bg-orange-500/10 border border-orange-500/30 px-2 py-1 rounded text-[10px] font-mono text-orange-500">
              PROJ. {post.projectedPrice || "$512.40"}
            </div>
          </div>
          
          <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <defs>
              <linearGradient id="imageTrendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            {(() => {
              // Extract sparkline data
              const sparkData = post._sparkline;
              const hasSparkline = sparkData && Array.isArray(sparkData) && sparkData.length >= 2;
              
              let pathData = "M0,150 L100,140 L200,160 L300,110 L400,120 L500,80 L600,90 L700,50";
              let lastX = 700;
              let lastY = 50;
              
              if (hasSparkline) {
                const width = 800;
                const height = 200;
                const padding = 40;
                const chartWidth = width - padding * 2;
                const chartHeight = height - padding * 2;
                
                const min = Math.min(...sparkData);
                const max = Math.max(...sparkData);
                const range = max - min || 1;
                
                const points = sparkData.map((val, i) => {
                  const x = padding + (i / (sparkData.length - 1)) * chartWidth;
                  // Invert y because SVG coordinates start from top
                  const y = height - (padding + ((val - min) / range) * chartHeight);
                  return { x, y };
                });
                
                pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
                lastX = points[points.length - 1].x;
                lastY = points[points.length - 1].y;
              }
              
              return (
                <>
                  <path 
                    d={pathData} 
                    stroke="url(#imageTrendGradient)" 
                    strokeWidth="4" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-all duration-700 ease-in-out"
                  />
                  <circle 
                    cx={lastX} 
                    cy={lastY} 
                    r="5" 
                    fill="#f97316" 
                    className="animate-pulse" 
                  />
                </>
              );
            })()}
          </svg>
          
          <div className="absolute bottom-2 left-6 flex items-center justify-between w-[calc(100%-3rem)]">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Medium-Term Projection (90D)
            </span>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Predicted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Stats Bar */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex flex-wrap items-center justify-between gap-6">
          <div className="flex-1 min-w-[200px] flex items-center gap-6">
            <div className="w-full max-w-[200px] space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Model Confidence</span>
                <span className="text-xl font-black text-foreground leading-none">{post.confidenceLevel}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${post.confidenceLevel}%` }}></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vol. Risk</span>
                <span className="text-sm font-black text-foreground">{post.volatilityRisk || "LOW-MOD"}</span>
              </div>
              {/* <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Alpha Prob.</span>
                <span className="text-sm font-black text-foreground">{post.alphaProbability || "+12.4%"}</span>
              </div> */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Signals</span>
                <span className="text-sm font-black text-foreground">{post.activeSignalsCount || "8"} ACTIVE</span>
              </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-6 py-3 border-t border-border bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Correlated:</span>
            <div className="flex gap-2">
              {(post.correlatedTickers || ["USO", "QQQ", "VIX"]).map(ticker => (
                <span key={ticker} className="px-2 py-0.5 bg-background rounded text-[10px] font-bold text-foreground border border-border uppercase tracking-widest">
                  {ticker}
                </span>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:translate-x-0.5 transition-transform">
            View Full Analysis <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Detail Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(post.analysisCards || [
          { title: "Immediate Trigger", icon: "⚡", content: "CPI data release scheduled for 08:30 EST may invalidate current bullish trajectory.", color: "text-blue-500", bg: "" },
          { title: "Liquidity Alert", icon: "⚠️", content: "Order book depth narrowing in SPY options chain at the $500.00 strike price.", color: "text-orange-500", bg: "" },
          { title: "Structural Note", icon: "◇", content: "Consolidation pattern entering its 4th session. Expansion anticipated within 48h.", color: "text-foreground", bg: "" }
        ]).map((card, i) => (
          <div key={i} className="p-6 rounded-xl bg-card border border-border flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <span className={card.color}>{card.icon}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${card.color}`}>
                {card.title}
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
              {card.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

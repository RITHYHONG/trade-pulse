import { Suspense } from "react";
import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import { AISummaryWidget } from "@/components/dashboard/widgets/ai-summary";
import { EconomicCalendarWidget } from "@/components/dashboard/widgets/economic-calendar";
import { WatchlistWidget } from "@/components/dashboard/widgets/watchlist";
import { MarketSessionsWidget } from "@/components/dashboard/widgets/market-sessions";
import { RiskCalculatorWidget } from "@/components/dashboard/widgets/risk-calculator";
import { TechnicalLevelsWidget } from "@/components/dashboard/widgets/technical-levels";
import { getMarketNews } from "@/lib/api/news-api";
import { getWatchlist } from "@/lib/api/market-data";
import { EconomicCalendarService } from "@/services/economic-calendar.service";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity, ShieldCheck, Zap } from "lucide-react";

// Async Data Fetchers
async function AISummarySection() {
  const news = await getMarketNews();
  return <AISummaryWidget news={news} />;
}

async function EconomicCalendarSection() {
  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + 3);
  const events = await EconomicCalendarService.getEvents(today, end);
  return <EconomicCalendarWidget events={events} />;
}

async function WatchlistSection() {
  const instruments = await getWatchlist();
  return <WatchlistWidget instruments={instruments} />;
}

// Stat Card Component
function StatCard({ label, value, trend, trendValue, icon: Icon, color }: any) {
  return (
    <div className="card-interactive bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
          {trendValue}
        </span>
        <span className="text-xs text-muted-foreground">vs yesterday</span>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground">Good Morning, Trader. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9">Export Data</Button>
          <Button className="h-9 bg-primary hover:bg-primary/90">
            <Zap className="mr-2 h-4 w-4" />
            Quick Trade
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Daily P&L"
          value="+$1,240.50"
          trend="up"
          trendValue="+12.5%"
          icon={TrendingUp}
          color="bg-emerald-500"
        />
        <StatCard
          label="Active Trades"
          value="3"
          trend="neutral"
          trendValue="Running"
          icon={Activity}
          color="bg-indigo-500"
        />
        <StatCard
          label="Risk Exposure"
          value="1.2%"
          trend="down"
          trendValue="Safe"
          icon={ShieldCheck}
          color="bg-amber-500"
        />
        <StatCard
          label="Win Rate (20d)"
          value="68%"
          trend="up"
          trendValue="+4.2%"
          icon={Zap}
          color="bg-primary"
        />
      </div>

      {/* Main Grid: Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Market Overview / AI Summary */}
          <Suspense fallback={<div className="h-64 rounded-xl bg-muted/20 animate-pulse" />}>
            <AISummarySection />
          </Suspense>

          {/* Watchlist Table */}
          <Suspense fallback={<div className="h-96 rounded-xl bg-muted/20 animate-pulse" />}>
            <WatchlistSection />
          </Suspense>
        </div>

        {/* Right Column (4 cols) - The "Tools" Side */}
        <div className="lg:col-span-4 space-y-6">
          {/* Market Sessions - Top Priority for Context */}
          <MarketSessionsWidget />

          {/* Technical Bias */}
          <TechnicalLevelsWidget />

          {/* Risk Calculator */}
          <RiskCalculatorWidget />

          {/* Economic Calendar Mini */}
          <Suspense fallback={<div className="h-64 rounded-xl bg-muted/20 animate-pulse" />}>
            <EconomicCalendarSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = generateMetadata({
  title: 'Dashboard',
  description: 'Command center for your trading operations.',
  path: '/dashboard',
});

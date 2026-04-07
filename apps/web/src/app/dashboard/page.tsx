import { Suspense } from "react";
import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import { AISummaryWidget } from "@/components/dashboard/widgets/ai-summary";
import { EconomicCalendarWidget } from "@/components/dashboard/widgets/economic-calendar";
import { WatchlistWidget } from "@/components/dashboard/widgets/watchlist";
import { MarketSessionsWidget } from "@/components/dashboard/widgets/market-sessions";
import { RiskCalculatorWidget } from "@/components/dashboard/widgets/risk-calculator";
import { TechnicalLevelsWidget } from "@/components/dashboard/widgets/technical-levels";
import { DashboardWidgetLayout } from "@/components/dashboard/dashboard-widget-layout";
import { StatCard, SectionFallback } from "@/components/dashboard/ui/stat-card";
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

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground">Good Morning, Trader. Here&apos;s what&apos;s happening today.</p>
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
      <section aria-labelledby="dashboard-stats-heading">
        <h2 id="dashboard-stats-heading" className="sr-only">
          Today&apos;s performance metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Daily P&L"
            value="+$1,240.50"
            trend="up"
            trendValue="+12.5%"
            icon={TrendingUp}
            iconBackground="bg-emerald-500"
            iconText="text-emerald-500"
          />
          <StatCard
            label="Active Trades"
            value="3"
            trend="neutral"
            trendValue="Running"
            icon={Activity}
            iconBackground="bg-indigo-500"
            iconText="text-indigo-500"
          />
          <StatCard
            label="Risk Exposure"
            value="1.2%"
            trend="down"
            trendValue="Safe"
            icon={ShieldCheck}
            iconBackground="bg-amber-500"
            iconText="text-amber-500"
          />
          <StatCard
            label="Win Rate (20d)"
            value="68%"
            trend="up"
            trendValue="+4.2%"
            icon={Zap}
            iconBackground="bg-primary"
            iconText="text-primary"
          />
        </div>
      </section>

      {/* Main Grid: Command Center */}
      <DashboardWidgetLayout
        className="pb-12"
        widgets={[
          {
            id: "ai-summary",
            title: "Market Pulse AI",
            content: (
              <Suspense fallback={<SectionFallback label="market summary" className="h-64" />}>
                <AISummarySection />
              </Suspense>
            ),
          },
          {
            id: "watchlist",
            title: "Market Watch",
            content: (
              <Suspense fallback={<SectionFallback label="watchlist" className="h-96" />}>
                <WatchlistSection />
              </Suspense>
            ),
          },
          {
            id: "market-sessions",
            title: "Market Sessions",
            content: <MarketSessionsWidget />,
          },
          {
            id: "technical-levels",
            title: "Technical Bias",
            content: <TechnicalLevelsWidget />,
          },
          {
            id: "risk-calculator",
            title: "Risk Calculator",
            content: <RiskCalculatorWidget />,
          },
          {
            id: "economic-calendar",
            title: "Economic Calendar",
            content: (
              <Suspense fallback={<SectionFallback label="economic calendar" className="h-64" />}>
                <EconomicCalendarSection />
              </Suspense>
            ),
          },
        ]}
      />
    </div>
  );
}

export const metadata: Metadata = generateMetadata({
  title: 'Dashboard',
  description: 'Command center for your trading operations.',
  path: '/dashboard',
});

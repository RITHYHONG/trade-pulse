import { Suspense } from "react";
import { DashboardWidgetLayout } from "@/components/dashboard/dashboard-widget-layout";
import { AISummaryWidget } from "@/components/dashboard/widgets/ai-summary";
import { EconomicCalendarWidget } from "@/components/dashboard/widgets/economic-calendar";
import { WatchlistWidget } from "@/components/dashboard/widgets/watchlist";
import { Skeleton } from "@/components/ui/skeleton";
import { EconomicCalendarService } from "@/services/economic-calendar.service";
import { getMarketNews } from "@/lib/api/news-api";
import { getWatchlist } from "@/lib/api/market-data";

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
    <DashboardWidgetLayout
      className="pb-12"
      widgets={[
        {
          id: "ai-summary",
          title: "Market Pulse AI",
          content: (
            <Suspense fallback={<Skeleton className="h-[360px]" />}>
              <AISummarySection />
            </Suspense>
          ),
        },
        {
          id: "economic-calendar",
          title: "Economic Calendar",
          content: (
            <Suspense fallback={<Skeleton className="h-[360px]" />}>
              <EconomicCalendarSection />
            </Suspense>
          ),
        },
        {
          id: "watchlist",
          title: "Market Watch",
          content: (
            <Suspense fallback={<Skeleton className="h-[360px]" />}>
              <WatchlistSection />
            </Suspense>
          ),
        },
      ]}
    />
  );
}

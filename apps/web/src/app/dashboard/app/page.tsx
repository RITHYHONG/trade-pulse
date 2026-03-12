import { Suspense } from "react";
import { WidgetGrid } from "@/components/dashboard/widget-grid";
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
    <WidgetGrid className="pb-12">
      <Suspense fallback={<Skeleton className="h-[360px]" />}>
        <AISummarySection />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[360px]" />}>
        <EconomicCalendarSection />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[360px]" />}>
        <WatchlistSection />
      </Suspense>
    </WidgetGrid>
  );
}

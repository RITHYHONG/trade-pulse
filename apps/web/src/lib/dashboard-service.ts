import { getAllMarketData } from "@/lib/market-data-service";
import { getWatchlist } from "@/lib/api/market-data";
import { getMarketNews } from "@/lib/api/news-api";
import { EconomicCalendarService } from "@/services/economic-calendar.service";
import type { MarketItem } from "@/lib/market-data-service";
import type { WatchlistInstrument } from "@/types";
import type { MarketNewsItem } from "@/types";
import type { EconomicEvent } from "@/app/calendar/components/economic-calendar/types";

export interface DashboardBulkData {
  watchlist: WatchlistInstrument[];
  marketData: MarketItem[];
  calendarEvents: EconomicEvent[];
  marketNews: MarketNewsItem[];
  fetchedAt: string;
}

export async function getDashboardData(): Promise<DashboardBulkData> {
  const today = new Date();
  const calendarEnd = new Date(today);
  calendarEnd.setDate(today.getDate() + 3);

  const [watchlist, marketData, calendarEvents, marketNews] = await Promise.all([
    getWatchlist(),
    getAllMarketData(),
    EconomicCalendarService.getEvents(today, calendarEnd),
    getMarketNews(),
  ]);

  return {
    watchlist,
    marketData,
    calendarEvents,
    marketNews,
    fetchedAt: new Date().toISOString(),
  };
}

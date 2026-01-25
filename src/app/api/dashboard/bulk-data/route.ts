import { NextResponse } from "next/server";
import { getAllMarketData } from "@/lib/market-data-service";
import { EconomicCalendarService } from "@/services/economic-calendar.service";
import { getMarketNews } from "@/lib/api/news-api";

export const runtime = "edge"; // Use Edge runtime for better performance

export async function GET() {
  try {
    // Fetch all required dashboard data in parallel
    const today = new Date();
    const calendarEnd = new Date(today);
    calendarEnd.setDate(today.getDate() + 3);

    const [marketData, calendarEvents, marketNews] = await Promise.all([
      getAllMarketData(),
      EconomicCalendarService.getEvents(today, calendarEnd),
      getMarketNews(),
    ]);

    // Consolidate into a single response object
    const bulkData = {
      marketData,
      calendarEvents,
      marketNews,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(bulkData);
  } catch (error) {
    console.error("Bulk Data API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}

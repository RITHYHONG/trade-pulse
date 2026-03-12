import { NextRequest, NextResponse } from "next/server";
import { EconomicCalendarService } from "@/services/economic-calendar.service";
import { EconomicEvent } from "@/app/calendar/components/economic-calendar/types";
import { mockCentralBankEvents } from "@/app/calendar/components/economic-calendar/mockData";

// Mock intelligence function (replace with real AI call if available)
async function getCalendarIntelligence(events: EconomicEvent[]) {
  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 500));
  const highImpact = events.filter((e) => e.impact === "high");

  return {
    marketVerdict: highImpact.length > 2 ? "Volatile" : "Stable",
    overallSummary: `Expect ${highImpact.length} high-impact events in the next period. Markets likely to focus on ${highImpact[0]?.name || "macro trends"}.`,
    keyRisks: highImpact.map((e) => e.name).slice(0, 3),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    if (!startParam || !endParam) {
      return NextResponse.json(
        { error: "Missing start or end date" },
        { status: 400 },
      );
    }

    const start = new Date(startParam);
    const end = new Date(endParam);

    // 1. Fetch Events
    const events = await EconomicCalendarService.getEvents(start, end);

    // 2. Fetch Intelligence and Correlations in parallel based on events
    const [intelligence, correlations] = await Promise.all([
      getCalendarIntelligence(events),
      Promise.resolve([]), // Replace with real correlation service call
    ]);

    return NextResponse.json({
      events,
      centralBankEvents: mockCentralBankEvents, // Replace with real service call when available
      intelligence,
      correlations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Calendar Bulk API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar data" },
      { status: 500 },
    );
  }
}

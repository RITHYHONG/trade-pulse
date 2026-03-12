import { NextRequest, NextResponse } from "next/server";
import { EconomicCalendarService } from "@/services/economic-calendar.service";

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

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }

    const events = await EconomicCalendarService.getEvents(start, end);
    return NextResponse.json(events);
  } catch (error) {
    console.error("API Error: Failed to fetch calendar events", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

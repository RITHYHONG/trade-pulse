import { NextResponse } from "next/server";
import { getAllMarketData } from "@/lib/market-data-service";

export async function GET() {
  try {
    const data = await getAllMarketData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error: Failed to fetch market data", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard-service";

export const runtime = "edge"; // Use Edge runtime for better performance

export async function GET() {
  try {
    const bulkData = await getDashboardData();
    return NextResponse.json(bulkData, {
      status: 200,
    });
  } catch (error) {
    console.error("Bulk Data API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}

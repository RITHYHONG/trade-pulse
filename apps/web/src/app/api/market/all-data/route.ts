import { NextResponse } from "next/server";
import { getAllMarketData } from "@/lib/market-data-service";
import { generateContent } from "@/lib/gemini";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSentiment = searchParams.get("sentiment") === "true";

    const marketData = await getAllMarketData();
    let sentiment: Record<string, { score: number; sentiment: string }> = {};

    if (includeSentiment && marketData.length > 0) {
      try {
        const context = marketData
          .slice(0, 10) // Limit context to top 10 tickers for speed
          .map(
            (item) =>
              `${item.symbol}: ${item.price} (${item.changePercent.toFixed(2)}%)`,
          )
          .join("\n");

        const prompt = `
          Analyze the short-term market sentiment (0-100 score) for the following tickers based on current price action.
          
          Tickers:
          ${context}
          
          Return a JSON object where keys are symbols and values are objects with:
          - score (number, 0-100)
          - sentiment (string, 'Bullish' | 'Bearish' | 'Neutral')
          
          Return ONLY valid JSON.
        `;

        const rawResponse = await generateContent(prompt);
        if (!rawResponse.includes("MISSING_API_KEY")) {
          const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
          sentiment = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
        }
      } catch (e) {
        console.error("Sentiment derivation failed:", e);
      }
    }

    return NextResponse.json({
      data: marketData,
      sentiment,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API Error: Failed to fetch market data", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 },
    );
  }
}

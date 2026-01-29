import { generateContent } from "@/lib/gemini";
import { getAllMarketData } from "@/lib/market-data-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    const marketData = await getAllMarketData();
    const marketContext = marketData
      .map(
        (item) =>
          `${item.name} (${item.symbol}): $${item.price} (${item.changePercent.toFixed(2)}%)`,
      )
      .join("\n");

    let prompt = "";
    if (ticker) {
      prompt = `
        Provide a concise (3-4 sentence) institutional-grade analysis for the asset: ${ticker}.
        User current market context:
        ${marketContext}
        
        Focus on technical sentiment, potential catalyst, and key levels if available.
      `;
    } else {
      prompt = `
        Provide a professional "Daily Market Wrap" summary for Trade Pulse.
        Market Data:
        ${marketContext}
        
        The summary should have 3 paragraphs:
        1. Overall session tone and lead assets.
        2. Sector performance (Crypto vs Stocks vs Forex).
        3. Critical risks or upcoming events to watch.
      `;
    }

    const summaryAndTimestamp = await generateContent(prompt);

    return Response.json({
      summary: summaryAndTimestamp,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "MISSING_API_KEY") {
      return Response.json({
        summary:
          "Demo Mode: Trade Pulse is currently monitoring historical price action and sentiment drivers. To enable live AI institutional summaries, please configure your GOOGLE_GENERATIVE_AI_API_KEY in the environment settings.",
        timestamp: new Date().toISOString(),
        isDemo: true,
      });
    }
    console.error("AI Summary Error:", error);
    return Response.json(
      {
        summary:
          "Market summary engine is currently refining its data. Please check back shortly for institutional insights.",
        error: error instanceof Error ? error.message : "Internal Error",
      },
      { status: 500 },
    );
  }
}

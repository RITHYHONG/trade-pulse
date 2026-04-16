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
        Provide a punchy, clean "Daily Market Wrap" for a professional trading dashboard.
        Market Data:
        ${marketContext}
        
        CRITICAL INSTRUCTIONS:
        - Return EXACTLY 3 short, distinct points separated by DOUBLE newlines.
        - Keep each point strictly under 15 words. Be snappy and direct.
        - DO NOT use emojis of any kind.
        - DO NOT use markdown formatting (like asterisks **, hash #, or bullet dashes -). Just plain text.
        - Start each point with a short capitalized category word followed by a colon.
        
        Example format:
        TONE: Bullish momentum dominating the session driven by tech strength.

        LEADERS: Tech and Crypto surging past key resistance levels on volume.

        WATCH: Yields are spiking, causing drag on defensive sectors.
      `;
    }

    const summaryAndTimestamp = await generateContent(prompt);

    return Response.json({
      summary: summaryAndTimestamp,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Error";

    if (errorMessage.includes("429")) {
      return Response.json({
        summary: "TONE: Tech sectors are maintaining support amid mixed macroeconomic signals.\n\nLEADERS: Large-cap AI equities continue to outperform broader indices on high volume.\n\nWATCH: Approaching Federal Reserve commentary may introduce short-term yield volatility.",
        timestamp: new Date().toISOString(),
        isDemo: true
      });
    }

    if (errorMessage === "MISSING_API_KEY") {
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
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

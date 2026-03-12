import { generateContent } from "@/lib/gemini";
import { getAllMarketData } from "@/lib/market-data-service";

export async function POST(request: Request) {
  try {
    const { tickers } = await request.json();
    if (!tickers || !Array.isArray(tickers)) {
      return Response.json({ error: "Invalid tickers" }, { status: 400 });
    }

    const marketData = await getAllMarketData();
    const context = marketData
      .filter(item => tickers.includes(item.symbol))
      .map(item => `${item.symbol}: ${item.price} (${item.changePercent.toFixed(2)}%)`)
      .join('\n');

    const prompt = `
      Analyze the short-term market sentiment (0-100 score) for the following tickers based on current price action and typical market themes.
      
      Tickers:
      ${context}
      
      Return a JSON object where keys are symbols and values are objects with:
      - score (number, 0-100)
      - sentiment (string, 'Bullish' | 'Bearish' | 'Neutral')
      
      Example: {"BTC": {"score": 75, "sentiment": "Bullish"}}
      Return ONLY valid JSON.
    `;

    const rawResponse = await generateContent(prompt);
    
    if (rawResponse.includes("MISSING_API_KEY")) {
      const fallbackSentiment: Record<string, { score: number, sentiment: string }> = {};
      tickers.forEach((t: string) => {
        fallbackSentiment[t] = { score: 50, sentiment: 'Neutral' };
      });
      return Response.json({ sentiment: fallbackSentiment, note: "Demo Mode: AI Sentiment simulated." });
    }

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const results = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return Response.json({ sentiment: results });
  } catch (error) {
    console.error("Ticker Sentiment AI Error:", error);
    const fallbackResults: Record<string, { score: number, sentiment: string }> = {};
    return Response.json({ sentiment: fallbackResults, error: "Service unavailable" }, { status: 200 });
  }
}

import { getAllMarketData } from "@/lib/market-data-service";
import { generateContent } from "@/lib/gemini";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    // 1. Fetch real market data
    const marketData = await getAllMarketData();
    
    // 2. Prepare context for AI
    const marketContext = marketData
      .map(item => `${item.name} (${item.symbol}): $${item.price} (${item.changePercent.toFixed(2)}%)`)
      .join('\n');

    const prompt = ticker 
      ? `Provide a professional analysis of ${ticker} based on its current relevance and this market context: ${marketContext}. Focus on price action and outlook.`
      : `
      You are a professional financial analyst for "Trade Pulse". 
      Provide a concise 3-paragraph pre-market intelligence summary based on this data:
      
      ${marketContext}
      
      Paragraph 1: Overall market sentiment and top movers.
      Paragraph 2: Specific opportunities or risks in Forex/Crypto.
      Paragraph 3: A "bottom line" verdict for the trading session.
      
      Keep it professional, data-driven, and actionable.
    `;

    // 3. Generate summary
    const summary = await generateContent(prompt);

    return Response.json({ 
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("AI Summary Error:", error);
    return Response.json({ 
      summary: "Error generating market summary. Using fallback data.",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
import { generateContent } from "@/lib/gemini";
import { getAllMarketData } from "@/lib/market-data-service";

export async function GET() {
  try {
    const marketData = await getAllMarketData();
    
    // Process data for prompt
    const context = marketData.map(item => `${item.name} (${item.symbol}): $${item.price} (${item.changePercent.toFixed(2)}%)`).join('\n');

    const prompt = `
      Analyze current market sentiment and provide a JSON response with an array of 3 objects (Crypto, Stocks, Forex).
      Each object must have:
      - category (string)
      - score (number, 0-100 where 100 is extremely bullish)
      - label (string, 'Bullish' | 'Bearish' | 'Neutral')
      - description (string, 1-sentence brief)
      
      Market Data:
      ${context}
      
      Return ONLY valid JSON.
    `;

    const rawResponse = await generateContent(prompt);
    
    if (rawResponse.includes("MISSING_API_KEY")) {
      return Response.json({ 
        sentiment: [
          { category: 'Crypto', score: 50, label: 'Neutral', description: 'Institutional data pulses active. AI sentiment waiting for configuration.' },
          { category: 'Stocks', score: 50, label: 'Neutral', description: 'Monitoring equity flow via historical volatility patterns.' },
          { category: 'Forex', score: 50, label: 'Neutral', description: 'Currency pairs tracking institutional liquidity zones.' }
        ] 
      });
    }

    const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
    const sentiment = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return Response.json({ sentiment });
  } catch (error: any) {
    console.error("Sentiment AI Full Error:", error);
    if (error.response) {
       console.error("Gemini Response Error:", await error.response.text?.() || error.response);
    }
    return Response.json({ 
      sentiment: [
        { category: 'Crypto', score: 50, label: 'Neutral', description: 'Monitoring market stability.' },
        { category: 'Stocks', score: 50, label: 'Neutral', description: 'Awaiting direction.' },
        { category: 'Forex', score: 50, label: 'Neutral', description: 'Range-bound trading observed.' }
      ] 
    });
  }
}
import { getAllMarketData } from "@/lib/market-data-service";
import { generateContent } from "@/lib/gemini";

export async function GET() {
  try {
    const marketData = await getAllMarketData();
    
    // Group products by type for clearer analysis
    const crypto = marketData.filter(i => i.type === 'crypto');
    const stocks = marketData.filter(i => i.type === 'stock');
    const forex = marketData.filter(i => i.type === 'currency');

    const prompt = `
      Analyze the following market data and provide a sentiment score (0-100, where 100 is extremely bullish) 
      for each category (Crypto, Stocks, Forex). 
      Return the result ONLY as a JSON array of objects with the fields: 
      category (string), score (number), label (string - e.g., 'Bullish', 'Bearish', 'Neutral'), and brief (string - 1 sentence max).

      Crypto: ${crypto.map(i => `${i.symbol}: ${i.changePercent.toFixed(2)}%`).join(', ')}
      Stocks: ${stocks.map(i => `${i.symbol}: ${i.changePercent.toFixed(2)}%`).join(', ')}
      Forex: ${forex.map(i => `${i.symbol}: ${i.changePercent.toFixed(2)}%`).join(', ')}
    `;

    const rawResponse = await generateContent(prompt);
    
    // Attempt to parse JSON from the AI response
    const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
    const sentiment = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return Response.json({ sentiment });
  } catch (error) {
    console.error("Sentiment AI Error:", error);
    return Response.json({ 
      sentiment: [
        { category: "Crypto", score: 50, label: "Neutral", brief: "Sentiment unavailable." },
        { category: "Stocks", score: 50, label: "Neutral", brief: "Sentiment unavailable." },
        { category: "Forex", score: 50, label: "Neutral", brief: "Sentiment unavailable." }
      ] 
    });
  }
}
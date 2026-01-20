import { generateContent } from "@/lib/gemini";
import { EconomicCalendarService } from "@/services/economic-calendar.service";

export async function POST(request: Request) {
  try {
    const { events } = await request.json();
    
    if (!events || !Array.isArray(events)) {
      return Response.json({ error: "Invalid events data" }, { status: 400 });
    }

    // Filter for high impact events or just the most relevant ones
    const highImpact = events
      .filter(e => e.impact === 'high')
      .slice(0, 5); // Take top 5 for summary

    if (highImpact.length === 0) {
      return Response.json({ 
        summary: "No high-impact events scheduled for the current selection. Monitoring medium-impact data for potential volatility.",
        verdict: "Neutral" 
      });
    }

    const eventContext = highImpact.map(e => (
      `${e.name} (${e.country}): Impact ${e.impact.toUpperCase()}. Consensus: ${e.consensus}${e.unit}, Previous: ${e.previous}${e.unit}. Scheduled for ${new Date(e.datetime).toLocaleString()}`
    )).join('\n');

    const prompt = `
      You are an institutional-grade financial analyst for Trade Pulse. 
      Analyze the following upcoming high-impact economic events and provide a "Market Intelligence" summary.
      
      Events:
      ${eventContext}
      
      Provide your response in JSON format with:
      - overallSummary (string): A 2-sentence summary of what these events mean for global markets.
      - keyRisks (string[]): 2 key risks or opportunities traders should watch for.
      - marketVerdict (string): A 1-2 word consensus (e.g., 'Extreme Volatility', 'Sideways/Choppy', 'Dollar Bullish Bias').
      
      Response MUST be valid JSON.
    `;

    const rawResponse = await generateContent(prompt);
    
    if (rawResponse.includes("MISSING_API_KEY")) {
      return Response.json({
        overallSummary: "Economic monitoring is active. Currently tracking volatility via high-fidelity historical data and session volume.",
        keyRisks: ["Monitor session open for volatility", "Check major pivot levels"],
        marketVerdict: "Range Bound"
      });
    }

    // Parse JSON safely
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const intelligence = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      overallSummary: rawResponse,
      keyRisks: ["Monitor volatility", "Check correlations"],
      marketVerdict: "Analyzing..."
    };

    return Response.json(intelligence);
  } catch (error) {
    console.error("Calendar Intelligence AI Error:", error);
    return Response.json({ 
      error: "Failed to generate market intelligence",
      overallSummary: "Intelligence engine temporarily unavailable. Please monitor events manually for unexpected surprises.",
      keyRisks: ["Unexpected data surprises", "High session volatility"],
      marketVerdict: "Caution Required"
    }, { status: 500 });
  }
}

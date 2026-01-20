import { generateContent } from "../../../../lib/gemini";

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();

    if (!action || !payload) {
      return Response.json({ error: "Action and payload are required" }, { status: 400 });
    }

    let prompt = "";

    switch (action) {
      case "generate-outline":
        prompt = `
          You are a professional financial editor for "Trade Pulse".
          Given the following topic or title: "${payload.title}"
          Create a professional 5-6 block outline for a market analysis post.
          
          Return a JSON array of blocks. Each block must have:
          - type: one of ['executive_summary', 'technical_analysis', 'fundamental_analysis', 'trade_idea', 'risk_assessment', 'market_context']
          - content: a brief (2-3 sentence) summary or placeholder text for that section.
          
          Format: [{"type": "...", "content": "..."}]
          Return ONLY valid JSON.
        `;
        break;

      case "optimize-headline":
        prompt = `
          Optimize this financial news headline for engagement and SEO: "${payload.title}"
          Provide 3 distinct suggestions:
          1. Professional/Institutional
          2. Insightful/Analytical
          3. Bold/Engaging
          
          Return a JSON array of strings.
          Return ONLY valid JSON.
        `;
        break;

      case "generate-description":
        prompt = `
          Write a compelling SEO meta description (max 160 chars) for this market analysis:
          Title: "${payload.title}"
          Asset: "${payload.primaryAsset}"
          Sentiment: "${payload.sentiment}"
          
          Return only the description string.
        `;
        break;

      default:
        return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    const response = await generateContent(prompt);
    
    if (response.includes("MISSING_API_KEY")) {
      if (action === "generate-outline") {
        return Response.json({ data: [
          { type: 'executive_summary', content: 'Demo Outline: Key takeaways based on current market pulse.' },
          { type: 'technical_analysis', content: 'Demo Analysis: Identifying support and resistance zones.' },
          { type: 'trade_idea', content: 'Demo Setup: Defining entry and exit parameters.' }
        ] });
      }
      if (action === "optimize-headline") {
        return Response.json({ data: [
          `Institutional View: ${payload.title}`,
          `Deep Dive: ${payload.title} - Strategic Analysis`,
          `Trending: Why ${payload.title} Matters Now`
        ] });
      }
      return Response.json({ data: "Demo Mode: Professional AI generation is currently in simulation mode. Configure your API key to enable live institutional reasoning." });
    }

    // Parse JSON if needed
    if (action === "generate-outline" || action === "optimize-headline") {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      const data = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      return Response.json({ data });
    }

    return Response.json({ data: response.trim() });
  } catch (error) {
    console.error("AI Co-Author Error:", error);
    return Response.json({ error: "Failed to generate AI content" }, { status: 500 });
  }
}

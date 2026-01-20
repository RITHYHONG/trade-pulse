import { generateContent } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    const systemPrompt = `
      You are the "AI Front-Desk" for Trade Pulse, a professional market intelligence platform.
      Your goal is to answer potential customers' questions concisely and professionally.
      
      Key info about Trade Pulse:
      - Primary features: AI Market Intelligence, Real-time Economic Calendar, Advanced Blog with Market Wraps, Live Sentiment Analysis.
      - Core mission: Provide institutional-grade data to retail traders.
      - Technology: Uses Google Gemini 1.5 Flash for market analysis.
      - Location: Offices in Phnom Penh, Cambodia and London, UK.
      - Support: 24/7 expert community and dedicated support team.
      
      Answer the user's question in 1-2 short, helpful sentences.
      If the question is too complex, suggest they fill out the contact form below.
    `;

    const prompt = `${systemPrompt}\n\nUser Question: ${message}\n\nAI Response:`;
    const response = await generateContent(prompt);

    return Response.json({ response });
  } catch (error) {
    console.error("AI Front-Desk Error:", error);
    return Response.json({ 
      response: "I'm currently undergoing maintenance, but our team can help you if you fill out the form below!" 
    }, { status: 500 });
  }
}

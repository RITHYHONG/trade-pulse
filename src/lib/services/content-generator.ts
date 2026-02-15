import { generateDeepSeekContent } from "@/lib/deepseek";
import { type MarketNewsItem } from "@/types";

export interface GeneratedBlogContent {
  title: string;
  slug: string;
  summary: string;
  content: string; // HTML content
  sentiment: string;
  confidenceLevel: number;
  timeHorizon: string;
  primaryAsset: string;
  relatedAssets: string[];
  tags: string[];
  metaDescription: string;
}

export async function generateBlogPost(
  newsItem: MarketNewsItem,
): Promise<GeneratedBlogContent> {
  const prompt = `
  You are a professional trading analyst and content creator for "Trade Pulse".
  
  Based on this news:
  
  TITLE: ${newsItem.title}
  CONTENT: ${newsItem.summary}
  SOURCE: ${newsItem.url}
  
  Generate a comprehensive blog post in JSON format with the following fields:
  1. "title": A catchy, SEO-friendly title.
  2. "slug": A URL-friendly slug based on the title.
  3. "summary": A short summary (approx 150 words).
  4. "content": The full blog post in HTML format. Use semantic tags:
      - <h2> for major sections.
      - <ul> and <li> for lists.
      - <strong> for emphasis.
      - <blockquote> for key takeaways.
      - <div class="disclaimer"> for the disclaimer.
      - <div class="source-link"> for the source link pointing to ${newsItem.url}.
  5. "sentiment": One of "Bullish", "Bearish", "Neutral".
  6. "confidenceLevel": A number (0-100).
  7. "timeHorizon": e.g., "Short-term", "Mid-term".
  8. "primaryAsset": Main ticker (e.g., BTC).
  9. "relatedAssets": Array of related tickers (e.g., ["ETH", "SOL"]).
  10. "tags": Array of 3-5 tags.
  11. "metaDescription": Concise SEO description.

  Return ONLY valid JSON.
  `;

  const rawContent = await generateDeepSeekContent(prompt, "deepseek-chat");

  try {
    // Clean up potential markdown code blocks if the AI adds them despite instructions
    let jsonString = rawContent.trim();
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.replace(/^```json/, "").replace(/```$/, "");
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```/, "").replace(/```$/, "");
    }

    const parsedContent = JSON.parse(jsonString);

    return {
      title: parsedContent.title,
      slug: parsedContent.slug,
      summary: parsedContent.summary,
      content: parsedContent.content,
      sentiment: parsedContent.sentiment || "Neutral",
      confidenceLevel: parsedContent.confidenceLevel || 80,
      timeHorizon: parsedContent.timeHorizon || "Short-term",
      primaryAsset: parsedContent.primaryAsset || "",
      relatedAssets: parsedContent.relatedAssets || [],
      tags: parsedContent.tags || [],
      metaDescription: parsedContent.metaDescription,
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    console.error("Raw response:", rawContent);
    throw new Error("Failed to parse AI generated content");
  }
}

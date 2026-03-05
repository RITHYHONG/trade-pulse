import { generateDeepSeekContent } from "@/lib/deepseek";
import type { MarketNewsItem } from "@/types/market";

export interface GeneratedBlogPost {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  tags: string[];
  primaryAsset: string;
  relatedAssets: string[];
  confidenceLevel: number;
  timeHorizon: string;
  sentiment: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function safeParseJSON(text: string): Record<string, unknown> | null {
  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/**
 * Uses DeepSeek to generate a structured blog post from a market news article.
 */
export async function generateBlogPost(
  news: MarketNewsItem & { image?: string },
): Promise<GeneratedBlogPost> {
  const prompt = `Based on this market news article, write a comprehensive and detailed blog post.
Objective: Write a deep-dive financial analysis that is 800-1200 words long. Use professional financial tone.

Source Data:
- Title: ${news.title}
- Summary: ${news.summary}
- Source: ${news.source}
- Published at: ${news.publishedAt}

Instructions:
1. Write a full-length article with multiple sections.
2. Structure the HTML content with <h2> for headers, <p> for paragraphs, and <ul>/<li> for lists.
3. Use <strong> for emphasis on key terms.
4. Include an "Executive Summary", "Market Impact", "Technical Context", and "Future Outlook".
5. Mention a primary asset ticker if applicable (e.g., TSLA).
6. Do NOT use markdown code fences in your response.

Return ONLY a valid JSON object with these exact fields:
{
  "title": "a high-impact SEO title",
  "content": "the complete HTML content (800-1200 words)",
  "metaDescription": "150-160 char SEO meta description",
  "tags": ["ticker1", "sector", "market-trend", "analysis", "news"],
  "primaryAsset": "ticker symbol (e.g. AAPL)",
  "relatedAssets": ["ticker2", "ticker3"],
  "confidenceLevel": 75,
  "timeHorizon": "short-term|medium-term|long-term",
  "sentiment": "positive|neutral|negative"
}`;

  let parsed: Record<string, unknown> | null = null;

  try {
    const raw = await generateDeepSeekContent(prompt);
    parsed = safeParseJSON(raw);
  } catch (err) {
    console.warn("[content-generator] DeepSeek generation failed:", (err as Error).message);
  }

  // Fallback: build a minimal post from the news item itself
  if (!parsed) {
    return {
      title: news.title,
      slug: slugify(news.title),
      content: `<h2>${news.title}</h2><p>${news.summary}</p><p>Source: ${news.source}</p>`,
      metaDescription: news.summary.slice(0, 155),
      tags: ["market news", "finance", "trading"],
      primaryAsset: "",
      relatedAssets: [],
      confidenceLevel: 50,
      timeHorizon: "short-term",
      sentiment: news.sentiment ?? "neutral",
    };
  }

  const title = String(parsed.title || news.title);

  return {
    title,
    slug: slugify(title),
    content: String(parsed.content || `<p>${news.summary}</p>`),
    metaDescription: String(parsed.metaDescription || news.summary).slice(0, 160),
    tags: Array.isArray(parsed.tags) ? (parsed.tags as string[]) : ["market news"],
    primaryAsset: String(parsed.primaryAsset || ""),
    relatedAssets: Array.isArray(parsed.relatedAssets) ? (parsed.relatedAssets as string[]) : [],
    confidenceLevel: typeof parsed.confidenceLevel === "number" ? parsed.confidenceLevel : 70,
    timeHorizon: String(parsed.timeHorizon || "short-term"),
    sentiment: String(parsed.sentiment || news.sentiment || "neutral"),
  };
}

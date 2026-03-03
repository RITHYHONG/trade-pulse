import { generateContent } from "@/lib/gemini";
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
 * Uses Gemini to generate a structured blog post from a market news article.
 */
export async function generateBlogPost(
  news: MarketNewsItem & { image?: string },
): Promise<GeneratedBlogPost> {
  const prompt = `You are a professional financial analyst writing for TradePulse, a market intelligence platform.

Based on this market news article, write a detailed blog post:

Title: ${news.title}
Summary: ${news.summary}
Source: ${news.source}
Published: ${news.publishedAt}

Return ONLY a valid JSON object (no markdown fences) with these exact fields:
{
  "title": "engaging SEO title for the post (can differ from news title)",
  "content": "full HTML blog post content (800-1200 words), using <h2>, <p>, <ul>, <strong> tags",
  "metaDescription": "150-160 char SEO meta description",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "primaryAsset": "main ticker or asset mentioned (e.g. AAPL, BTC, SPY, or empty string)",
  "relatedAssets": ["ticker1", "ticker2"],
  "confidenceLevel": 75,
  "timeHorizon": "short-term|medium-term|long-term",
  "sentiment": "positive|neutral|negative"
}`;

  let parsed: Record<string, unknown> | null = null;

  try {
    const raw = await generateContent(prompt);
    parsed = safeParseJSON(raw);
  } catch (err) {
    console.warn("[content-generator] Gemini generation failed:", (err as Error).message);
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

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
  projectedPrice?: string;
  volatilityRisk?: string;
  alphaProbability?: string;
  activeSignalsCount?: number;
  correlatedTickers?: string[];
  analysisCards?: {
    title: string;
    content: string;
    icon?: string;
    color?: string;
  }[];
  _sparkline: number[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/**
 * Returns an array of 12-15 numbers representing a trend based on the sentiment.
 * Positive/Bullish sentiments produce generally upward trends with some noise.
 * Negative/Bearish sentiments produce generally downward trends with some noise.
 * Neutral produces a oscillating trend around a baseline.
 */
function generateRepresentativeSparkline(sentiment: string): number[] {
  const length = 12 + Math.floor(Math.random() * 4); // 12-15 points
  const data: number[] = [];
  let currentVal = 100 + Math.random() * 20; // Start around 100-120
  
  const isPositive = ["positive", "bullish", "strong_buy", "buy"].includes(sentiment.toLowerCase());
  const isNegative = ["negative", "bearish", "strong_sell", "sell"].includes(sentiment.toLowerCase());
  
  for (let i = 0; i < length; i++) {
    data.push(Number(currentVal.toFixed(2)));
    
    // Trend factor
    let change = (Math.random() - 0.5) * 4; // Noise: -2 to +2
    if (isPositive) {
      change += 1.5; // Bias upward
    } else if (isNegative) {
      change -= 1.5; // Bias downward
    }
    
    currentVal += change;
  }
  
  return data;
}

function safeParseJSON(text: string): Record<string, unknown> | null {
  try {
    // 1. Try direct parsing first
    return JSON.parse(text);
  } catch {
    try {
      // 2. Try to extract JSON from the string using a more robust regex or brackets matching
      // Looking for the first '{' and last '}'
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonCandidate = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonCandidate);
      }
    } catch (innerError) {
      console.error("[content-generator] Extraction parse failed:", innerError);
    }
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
7. Return ONLY the JSON object. No conversational text before or after the JSON.

Strict JSON Schema (all fields REQUIRED):
{
  "title": \"string\",
  "content": \"string (min 1500 chars)\",
  "metaDescription": \"string (150-160 chars)\",
  "tags": [\"string\"],
  "primaryAsset": \"string\",
  "relatedAssets": [\"string\"],
  "confidenceLevel": 75,
  "timeHorizon": \"short-term|medium-term|long-term\",
  "sentiment": \"positive|neutral|negative\",
  "projectedPrice": \"string\",
  "volatilityRisk": \"LOW|LOW-MOD|MODERATE|HIGH\",
  "alphaProbability": \"string\",
  "activeSignalsCount": 8,
  "correlatedTickers": [\"string\"],
  "analysisCards": [
    { "title": \"Immediate Trigger\", \"content\": \"short analysis\", \"icon\": \"⚡\", \"color\": \"text-blue-500\" },
    { "title": \"Liquidity Alert\", \"content\": \"short analysis\", \"icon\": \"⚠️\", \"color\": \"text-orange-500\" },
    { "title": \"Structural Note\", \"content\": \"short analysis\", \"icon\": \"◇\", \"color\": \"text-foreground\" }
  ]
}`;

  let parsed: Record<string, unknown> | null = null;
  let raw = "";

  try {
    raw = await generateDeepSeekContent(prompt);
    console.log("[content-generator] Raw DeepSeek Response:", raw);

    parsed = safeParseJSON(raw);

    if (parsed) {
      console.log("[content-generator] Parsing succeeded.");
      const fields = [
        "title",
        "content",
        "metaDescription",
        "tags",
        "primaryAsset",
        "relatedAssets",
        "confidenceLevel",
        "timeHorizon",
        "sentiment",
        "projectedPrice",
        "volatilityRisk",
        "alphaProbability",
        "activeSignalsCount",
        "correlatedTickers",
        "analysisCards",
      ];
      const present = fields.filter((f) => f in (parsed as object));
      const missing = fields.filter((f) => !(f in (parsed as object)));
      console.log(`[content-generator] Fields present: ${present.join(", ")}`);
      if (missing.length > 0) {
        console.warn(`[content-generator] Fields missing: ${missing.join(", ")}`);
      }
    } else {
      console.error("[content-generator] Parsing failed for the response.");
    }
  } catch (err) {
    console.error("[content-generator] DeepSeek generation failed:", (err as Error).message);
  }

  // Fallback: build a minimal post from the news item itself
  if (!parsed) {
    console.warn("[content-generator] Using fallback minimal post.");
    const sentiment = news.sentiment ?? "neutral";
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
      sentiment,
      _sparkline: generateRepresentativeSparkline(sentiment),
    };
  }

  const title = String(parsed.title || news.title);

  // Parse numeric fields safely (they might be strings)
  const confidenceLevel =
    typeof parsed.confidenceLevel === "number"
      ? parsed.confidenceLevel
      : typeof parsed.confidenceLevel === "string"
      ? parseInt(parsed.confidenceLevel, 10)
      : 70;

  const activeSignalsCount =
    typeof parsed.activeSignalsCount === "number"
      ? parsed.activeSignalsCount
      : typeof parsed.activeSignalsCount === "string"
      ? parseInt(parsed.activeSignalsCount, 10)
      : undefined;

  const sentiment = String(parsed.sentiment || news.sentiment || "neutral");

  return {
    title,
    slug: slugify(title),
    content: String(parsed.content || `<p>${news.summary}</p>`),
    metaDescription: String(parsed.metaDescription || news.summary).slice(0, 160),
    tags: Array.isArray(parsed.tags) ? (parsed.tags as string[]) : ["market news"],
    primaryAsset: String(parsed.primaryAsset || ""),
    relatedAssets: Array.isArray(parsed.relatedAssets) ? (parsed.relatedAssets as string[]) : [],
    confidenceLevel: isNaN(confidenceLevel) ? 70 : confidenceLevel,
    timeHorizon: String(parsed.timeHorizon || "short-term"),
    sentiment,
    projectedPrice: parsed.projectedPrice ? String(parsed.projectedPrice) : undefined,
    volatilityRisk: parsed.volatilityRisk ? String(parsed.volatilityRisk) : undefined,
    alphaProbability: parsed.alphaProbability ? String(parsed.alphaProbability) : undefined,
    activeSignalsCount: isNaN(activeSignalsCount as number) ? undefined : activeSignalsCount,
    correlatedTickers: Array.isArray(parsed.correlatedTickers) ? (parsed.correlatedTickers as string[]) : undefined,
    analysisCards: Array.isArray(parsed.analysisCards) ? (parsed.analysisCards as any[]) : undefined,
    _sparkline: generateRepresentativeSparkline(sentiment),
  };
}

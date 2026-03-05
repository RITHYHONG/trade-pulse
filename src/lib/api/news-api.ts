import type { MarketNewsItem } from "@/types";

// Rotating pool of finance-themed fallback images (used when API returns no image)
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1611974714851-48206138d73b?q=80&w=800&auto=format&fit=crop', // stock charts
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop', // trading screens
  'https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?q=80&w=800&auto=format&fit=crop', // financial graphs
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop', // market overview
  'https://images.unsplash.com/photo-1642790551116-18e150f248e3?q=80&w=800&auto=format&fit=crop', // crypto/finance
];

let fallbackIndex = 0;
function getNextFallbackImage(): string {
  const img = FALLBACK_IMAGES[fallbackIndex % FALLBACK_IMAGES.length];
  fallbackIndex++;
  return img;
}

const MOCK_NEWS: MarketNewsItem[] = [
  {
    id: "news-1",
    title: "AI-driven funds lead pre-market gains",
    summary:
      "Quant-driven strategies continue to outperform benchmarks as futures point to a higher open.",
    source: "Trade Pulse Research",
    publishedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    sentiment: "positive",
    url: "https://www.tradepulse.app/research/ai-funds",
  },
  {
    id: "news-2",
    title: "Energy sector under pressure on softer demand outlook",
    summary:
      "Crude prices pull back below $80 as traders digest the latest inventory data and revised forecasts.",
    source: "Energy Watch",
    publishedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    sentiment: "neutral",
    url: "https://www.tradepulse.app/research/energy-demand",
  },
  {
    id: "news-3",
    title: "Earnings season accelerates with megacap tech on deck",
    summary:
      "Options markets are pricing elevated volatility ahead of tonight's results from key tech leaders.",
    source: "Street Consensus",
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    sentiment: "neutral",
    url: "https://www.tradepulse.app/research/earnings-preview",
  },
];

async function fetchFinnhubNews(): Promise<MarketNewsItem[]> {
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  if (!FINNHUB_API_KEY) {
    throw new Error("Finnhub API key not set");
  }

  const response = await fetch(
    `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`,
    { next: { revalidate: 0 } },
  );

  if (!response.ok) {
    throw new Error(`Finnhub News API failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Finnhub returned empty or invalid news data");
  }

  return data
    .slice(0, 10)
    .map((item: any) => ({
      id: String(item.id || Math.random()),
      title: item.headline || "No Title",
      summary: item.summary || "",
      source: item.source || "Finnhub",
      publishedAt: item.datetime
        ? new Date(item.datetime * 1000).toISOString()
        : new Date().toISOString(),
      sentiment: "neutral" as const,
      url: item.url || "#",
      image: item.image || getNextFallbackImage(),
    }))
    .filter((item) => item.title !== "No Title" && item.summary.length > 0);
}

async function fetchFMPNews(): Promise<MarketNewsItem[]> {
  const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

  if (!FMP_API_KEY || FMP_API_KEY === "your_fmp_api_key") {
    throw new Error("FMP API key not set");
  }

  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/stock_news?limit=10&apikey=${FMP_API_KEY}`,
    { next: { revalidate: 0 } },
  );

  if (!response.ok) {
    throw new Error(
      `FMP News API failed with status ${response.status} — free tier may not include /stock_news`,
    );
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("FMP returned empty or invalid news data");
  }

  return data.map((item: any) => ({
    id: item.url || String(Math.random()),
    title: item.title || "No Title",
    summary: item.text || "",
    source: item.site || "Unknown",
    publishedAt: item.publishedDate || new Date().toISOString(),
    sentiment:
      (item.sentiment?.toLowerCase() as "positive" | "negative" | "neutral") ||
      "neutral",
    url: item.url || "#",
    image: item.image || getNextFallbackImage(),
  }));
}

export async function getMarketNews(): Promise<MarketNewsItem[]> {
  // Try Finnhub first (free tier supports general market news)
  try {
    const news = await fetchFinnhubNews();
    console.log(`[news-api] Fetched ${news.length} articles from Finnhub`);
    return news;
  } catch (err) {
    console.warn("[news-api] Finnhub failed:", (err as Error).message);
  }

  // Fallback to FMP
  try {
    const news = await fetchFMPNews();
    console.log(`[news-api] Fetched ${news.length} articles from FMP`);
    return news;
  } catch (err) {
    console.warn("[news-api] FMP failed:", (err as Error).message);
  }

  // Final fallback: mock data
  console.warn("[news-api] All sources failed — using mock news");
  return MOCK_NEWS;
}

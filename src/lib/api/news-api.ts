import type { MarketNewsItem } from "@/types";

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

const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;

export async function getMarketNews(): Promise<MarketNewsItem[]> {
  if (!FMP_API_KEY || FMP_API_KEY === "your_fmp_api_key") {
    console.warn("FMP API key missing, using mock market news.");
    await new Promise((resolve) => setTimeout(resolve, 250));
    return MOCK_NEWS;
  }

  try {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/stock_news?limit=10&apikey=${FMP_API_KEY}`,
    );

    if (!response.ok) {
      console.error(`FMP News API failed with status ${response.status}`);
      return MOCK_NEWS;
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("FMP News API returned unexpected data format:", data);
      return MOCK_NEWS;
    }

    return data.map((item: any) => ({
      id: item.url || Math.random().toString(),
      title: item.title || "No Title",
      summary: item.text || "",
      source: item.site || "Unknown",
      publishedAt: item.publishedDate || new Date().toISOString(),
      sentiment:
        (item.sentiment?.toLowerCase() as
          | "positive"
          | "negative"
          | "neutral") || "neutral",
      url: item.url || "#",
      image: item.image,
    }));
  } catch (error) {
    console.error("Error fetching real news:", error);
    return MOCK_NEWS;
  }
}

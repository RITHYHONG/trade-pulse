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

export async function getMarketNews(): Promise<MarketNewsItem[]> {
	await new Promise((resolve) => setTimeout(resolve, 250));
	return MOCK_NEWS;
}
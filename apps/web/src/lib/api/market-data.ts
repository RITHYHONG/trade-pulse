import type { InstrumentDetail, WatchlistInstrument } from "@/types";

const MOCK_WATCHLIST: InstrumentDetail[] = [
	{
		symbol: "AAPL",
		name: "Apple Inc.",
		price: 214.16,
		change: 2.38,
		changePercent: 1.12,
		sector: "Technology",
		dayRange: "212.02 - 215.40",
		volume: 55432123,
		marketCap: 3.28e12,
		updatedAt: new Date().toISOString(),
	},
	{
		symbol: "NVDA",
		name: "NVIDIA Corporation",
		price: 964.22,
		change: -12.14,
		changePercent: -1.24,
		sector: "Technology",
		dayRange: "952.32 - 981.24",
		volume: 42221032,
		marketCap: 2.38e12,
		updatedAt: new Date().toISOString(),
	},
	{
		symbol: "TSLA",
		name: "Tesla, Inc.",
		price: 208.54,
		change: 4.12,
		changePercent: 2.02,
		sector: "Consumer Discretionary",
		dayRange: "203.12 - 209.97",
		volume: 38900123,
		marketCap: 0.66e12,
		updatedAt: new Date().toISOString(),
	},
];

export async function getWatchlist(): Promise<WatchlistInstrument[]> {
	await new Promise((resolve) => setTimeout(resolve, 320));
	return MOCK_WATCHLIST.map(
		({ symbol, name, price, change, changePercent, sector }) => ({
			symbol,
			name,
			price,
			change,
			changePercent,
			sector,
		}),
	);
}

export async function getInstrumentDetail(symbol: string): Promise<InstrumentDetail | null> {
	await new Promise((resolve) => setTimeout(resolve, 180));
	return MOCK_WATCHLIST.find((item) => item.symbol.toLowerCase() === symbol.toLowerCase()) ?? null;
}
export type Sentiment = "positive" | "neutral" | "negative";

export interface MarketNewsItem {
	id: string;
	title: string;
	summary: string;
	source: string;
	publishedAt: string;
	sentiment: Sentiment;
	url: string;
}

export interface EconomicCalendarEvent {
	id: string;
	time: string;
	event: string;
	country: string;
	consensus: string;
	previous: string;
	actual?: string | null;
	impact: "low" | "medium" | "high";
}

export interface WatchlistInstrument {
	symbol: string;
	name: string;
	price: number;
	change: number;
	changePercent: number;
	sector: string;
}

export interface InstrumentDetail extends WatchlistInstrument {
	dayRange: string;
	volume: number;
	marketCap: number;
	updatedAt: string;
}
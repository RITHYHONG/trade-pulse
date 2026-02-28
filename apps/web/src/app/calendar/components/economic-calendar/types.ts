export type ImpactLevel = "high" | "medium" | "low";
export type Region = "US" | "EU" | "UK" | "Asia" | "EM";
export type EventCategory =
  | "inflation"
  | "employment"
  | "gdp"
  | "centralBank"
  | "trade"
  | "retail"
  | "manufacturing"
  | "housing";
export type MarketSession = "asian" | "london" | "newyork" | "closed";
export type Sentiment = "bullish" | "bearish" | "neutral";

export interface EconomicEvent {
  id: string;
  name: string;
  country: string;
  region: Region;
  datetime: Date;
  impact: ImpactLevel;
  category: EventCategory;
  actual?: number;
  consensus: number;
  previous: number;
  unit: string;

  // Advanced Analytics
  historicalData: {
    avgMove: number; // Average absolute price move percentage
    directionBias: Sentiment;
    biasSuccessRate: number; // 0-100
    peakImpactMinutes: number;
    fadeTimeHours: number;
  };

  consensusIntelligence: {
    estimateDistribution: number[]; // Array of analyst estimates
    revisionMomentum: "up" | "down" | "stable";
    surpriseProbability: number; // 0-100
    whisperNumber?: number;
  };

  tradingSetup: {
    strategyTag: string;
    correlatedAssets: string[];
    expectedMove: number; // Percentage
    confidenceScore: number; // 0-100
  };

  affectedAssets: string[];
}

export interface CentralBankEvent {
  id: string;
  bank: string;
  type: "meeting" | "speech" | "minutes";
  datetime: Date;
  speaker?: string;
  rateProbabilities: {
    cut: number;
    hold: number;
    hike: number;
  };
  keyTopics: string[];
}

export interface FilterState {
  dateRange: "today" | "week" | "month" | "custom";
  customRange?: { start: Date; end: Date };
  impacts: ImpactLevel[];
  regions: Region[];
  categories: EventCategory[];
  searchQuery: string;
  highImpactOnly: boolean;
  viewPreset: "dayTrader" | "swingTrader" | "forexFocus" | "custom";
  marketSession?: MarketSession;
}

export type ViewMode = "timeline" | "heatmap" | "list";

export interface AiIntelligence {
  marketVerdict: string;
  overallSummary: string;
  keyRisks: string[];
}

export interface Correlation {
  event1: string;
  event2: string;
  strength: number; // -1 to 1
  leadLag: string;
  lagMinutes?: number;
  category: string;
}

import { EconomicEvent, CentralBankEvent } from './types';

export const mockEconomicEvents: EconomicEvent[] = [
  {
    id: '1',
    name: 'Non-Farm Payrolls',
    country: 'United States',
    region: 'US',
    datetime: new Date('2025-10-09T13:30:00'),
    impact: 'high',
    category: 'employment',
    actual: undefined,
    consensus: 180000,
    previous: 175000,
    unit: 'Jobs',
    historicalData: {
      avgMove: 0.82,
      directionBias: 'neutral',
      biasSuccessRate: 48,
      peakImpactMinutes: 15,
      fadeTimeHours: 2
    },
    consensusIntelligence: {
      estimateDistribution: [165000, 172000, 180000, 185000, 195000],
      revisionMomentum: 'up',
      surpriseProbability: 68,
      whisperNumber: 185000
    },
    tradingSetup: {
      strategyTag: 'Range Expansion Likely - Consider Straddle',
      correlatedAssets: ['DXY', 'Gold', '10Y Treasury', 'SPY'],
      expectedMove: 0.85,
      confidenceScore: 92
    },
    affectedAssets: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'Gold', 'SPY', 'QQQ']
  },
  {
    id: '2',
    name: 'Consumer Price Index (CPI)',
    country: 'United States',
    region: 'US',
    datetime: new Date('2025-10-09T13:30:00'),
    impact: 'high',
    category: 'inflation',
    actual: undefined,
    consensus: 2.4,
    previous: 2.5,
    unit: '% YoY',
    historicalData: {
      avgMove: 1.15,
      directionBias: 'bearish',
      biasSuccessRate: 72,
      peakImpactMinutes: 10,
      fadeTimeHours: 1.5
    },
    consensusIntelligence: {
      estimateDistribution: [2.2, 2.3, 2.4, 2.5, 2.6],
      revisionMomentum: 'down',
      surpriseProbability: 58,
      whisperNumber: 2.3
    },
    tradingSetup: {
      strategyTag: 'Breakout Setup - Watch Key Technical Levels',
      correlatedAssets: ['DXY', 'Gold', 'Bitcoin', 'TLT'],
      expectedMove: 1.2,
      confidenceScore: 88
    },
    affectedAssets: ['USD/JPY', 'EUR/USD', 'Gold', 'SPY', 'TLT', 'BTC']
  },
  {
    id: '3',
    name: 'ECB Interest Rate Decision',
    country: 'European Union',
    region: 'EU',
    datetime: new Date('2025-10-09T12:45:00'),
    impact: 'high',
    category: 'centralBank',
    actual: undefined,
    consensus: 3.50,
    previous: 3.75,
    unit: '%',
    historicalData: {
      avgMove: 0.95,
      directionBias: 'bullish',
      biasSuccessRate: 65,
      peakImpactMinutes: 20,
      fadeTimeHours: 3
    },
    consensusIntelligence: {
      estimateDistribution: [3.25, 3.50, 3.50, 3.50, 3.75],
      revisionMomentum: 'down',
      surpriseProbability: 42,
      whisperNumber: 3.50
    },
    tradingSetup: {
      strategyTag: 'Mean Reversion Opportunity - Fade Initial Move',
      correlatedAssets: ['EUR/USD', 'EUR/GBP', 'DAX', 'STOXX50'],
      expectedMove: 0.88,
      confidenceScore: 85
    },
    affectedAssets: ['EUR/USD', 'EUR/JPY', 'EUR/GBP', 'DAX', 'STOXX50']
  },
  {
    id: '4',
    name: 'UK GDP Growth',
    country: 'United Kingdom',
    region: 'UK',
    datetime: new Date('2025-10-09T07:00:00'),
    impact: 'high',
    category: 'gdp',
    actual: undefined,
    consensus: 0.3,
    previous: 0.2,
    unit: '% QoQ',
    historicalData: {
      avgMove: 0.68,
      directionBias: 'neutral',
      biasSuccessRate: 52,
      peakImpactMinutes: 18,
      fadeTimeHours: 2.5
    },
    consensusIntelligence: {
      estimateDistribution: [0.2, 0.3, 0.3, 0.4, 0.4],
      revisionMomentum: 'stable',
      surpriseProbability: 55,
      whisperNumber: 0.4
    },
    tradingSetup: {
      strategyTag: 'Range Bound - Sell Premium',
      correlatedAssets: ['GBP/USD', 'EUR/GBP', 'FTSE100'],
      expectedMove: 0.62,
      confidenceScore: 78
    },
    affectedAssets: ['GBP/USD', 'EUR/GBP', 'GBP/JPY', 'FTSE100']
  },
  {
    id: '5',
    name: 'Chinese PMI Manufacturing',
    country: 'China',
    region: 'Asia',
    datetime: new Date('2025-10-09T02:00:00'),
    impact: 'medium',
    category: 'manufacturing',
    actual: undefined,
    consensus: 50.2,
    previous: 49.8,
    unit: 'Index',
    historicalData: {
      avgMove: 0.45,
      directionBias: 'bullish',
      biasSuccessRate: 68,
      peakImpactMinutes: 25,
      fadeTimeHours: 4
    },
    consensusIntelligence: {
      estimateDistribution: [49.8, 50.0, 50.2, 50.5, 50.8],
      revisionMomentum: 'up',
      surpriseProbability: 62,
      whisperNumber: 50.5
    },
    tradingSetup: {
      strategyTag: 'AUD/NZD Correlation Play',
      correlatedAssets: ['AUD/USD', 'NZD/USD', 'Copper', 'Iron Ore'],
      expectedMove: 0.48,
      confidenceScore: 72
    },
    affectedAssets: ['AUD/USD', 'NZD/USD', 'USD/CNH', 'Copper', 'A50 Index']
  },
  {
    id: '6',
    name: 'Retail Sales',
    country: 'United States',
    region: 'US',
    datetime: new Date('2025-10-09T13:30:00'),
    impact: 'medium',
    category: 'retail',
    actual: undefined,
    consensus: 0.4,
    previous: 0.3,
    unit: '% MoM',
    historicalData: {
      avgMove: 0.52,
      directionBias: 'neutral',
      biasSuccessRate: 51,
      peakImpactMinutes: 12,
      fadeTimeHours: 1
    },
    consensusIntelligence: {
      estimateDistribution: [0.2, 0.3, 0.4, 0.5, 0.6],
      revisionMomentum: 'up',
      surpriseProbability: 58,
      whisperNumber: 0.5
    },
    tradingSetup: {
      strategyTag: 'Consumer Discretionary Sector Play',
      correlatedAssets: ['XRT', 'AMZN', 'WMT', 'TGT'],
      expectedMove: 0.48,
      confidenceScore: 68
    },
    affectedAssets: ['SPY', 'QQQ', 'XRT', 'USD/CAD']
  },
  {
    id: '7',
    name: 'BOJ Governor Speech',
    country: 'Japan',
    region: 'Asia',
    datetime: new Date('2025-10-09T03:30:00'),
    impact: 'medium',
    category: 'centralBank',
    actual: undefined,
    consensus: 0,
    previous: 0,
    unit: '',
    historicalData: {
      avgMove: 0.38,
      directionBias: 'neutral',
      biasSuccessRate: 48,
      peakImpactMinutes: 30,
      fadeTimeHours: 5
    },
    consensusIntelligence: {
      estimateDistribution: [],
      revisionMomentum: 'stable',
      surpriseProbability: 35,
    },
    tradingSetup: {
      strategyTag: 'Policy Signal Watch - JPY Pairs',
      correlatedAssets: ['USD/JPY', 'EUR/JPY', 'Nikkei225'],
      expectedMove: 0.35,
      confidenceScore: 62
    },
    affectedAssets: ['USD/JPY', 'EUR/JPY', 'GBP/JPY', 'Nikkei225']
  },
  {
    id: '8',
    name: 'German Industrial Production',
    country: 'Germany',
    region: 'EU',
    datetime: new Date('2025-10-09T07:00:00'),
    impact: 'low',
    category: 'manufacturing',
    actual: undefined,
    consensus: 0.5,
    previous: 0.3,
    unit: '% MoM',
    historicalData: {
      avgMove: 0.28,
      directionBias: 'neutral',
      biasSuccessRate: 49,
      peakImpactMinutes: 15,
      fadeTimeHours: 1.5
    },
    consensusIntelligence: {
      estimateDistribution: [0.3, 0.4, 0.5, 0.6, 0.7],
      revisionMomentum: 'up',
      surpriseProbability: 45,
    },
    tradingSetup: {
      strategyTag: 'EUR Minor Impact - Monitor Only',
      correlatedAssets: ['EUR/USD', 'DAX'],
      expectedMove: 0.22,
      confidenceScore: 55
    },
    affectedAssets: ['EUR/USD', 'DAX', 'EUR/GBP']
  },
  {
    id: '9',
    name: 'US Housing Starts',
    country: 'United States',
    region: 'US',
    datetime: new Date('2025-10-10T13:30:00'),
    impact: 'low',
    category: 'housing',
    actual: undefined,
    consensus: 1450,
    previous: 1420,
    unit: 'K',
    historicalData: {
      avgMove: 0.18,
      directionBias: 'neutral',
      biasSuccessRate: 50,
      peakImpactMinutes: 10,
      fadeTimeHours: 0.5
    },
    consensusIntelligence: {
      estimateDistribution: [1420, 1440, 1450, 1460, 1480],
      revisionMomentum: 'up',
      surpriseProbability: 52,
    },
    tradingSetup: {
      strategyTag: 'Limited Impact - Housing Sector Only',
      correlatedAssets: ['XHB', 'ITB', 'DHI', 'LEN'],
      expectedMove: 0.15,
      confidenceScore: 48
    },
    affectedAssets: ['XHB', 'ITB']
  },
  {
    id: '10',
    name: 'Australian Employment Change',
    country: 'Australia',
    region: 'Asia',
    datetime: new Date('2025-10-10T00:30:00'),
    impact: 'high',
    category: 'employment',
    actual: undefined,
    consensus: 25000,
    previous: 28000,
    unit: 'Jobs',
    historicalData: {
      avgMove: 0.72,
      directionBias: 'bullish',
      biasSuccessRate: 63,
      peakImpactMinutes: 12,
      fadeTimeHours: 2
    },
    consensusIntelligence: {
      estimateDistribution: [20000, 23000, 25000, 27000, 30000],
      revisionMomentum: 'stable',
      surpriseProbability: 58,
      whisperNumber: 27000
    },
    tradingSetup: {
      strategyTag: 'AUD Volatility Play - Iron Condor',
      correlatedAssets: ['AUD/USD', 'AUD/JPY', 'ASX200'],
      expectedMove: 0.68,
      confidenceScore: 75
    },
    affectedAssets: ['AUD/USD', 'AUD/JPY', 'NZD/USD', 'ASX200']
  },
  {
    id: '11',
    name: 'UK Retail Sales',
    country: 'United Kingdom',
    region: 'UK',
    datetime: new Date('2025-10-10T07:00:00'),
    impact: 'medium',
    category: 'retail',
    actual: undefined,
    consensus: 0.5,
    previous: 0.3,
    unit: '% MoM',
    historicalData: {
      avgMove: 0.58,
      directionBias: 'neutral',
      biasSuccessRate: 52,
      peakImpactMinutes: 15,
      fadeTimeHours: 2
    },
    consensusIntelligence: {
      estimateDistribution: [0.3, 0.4, 0.5, 0.6, 0.7],
      revisionMomentum: 'up',
      surpriseProbability: 55,
      whisperNumber: 0.6
    },
    tradingSetup: {
      strategyTag: 'GBP Pairs Volatility - Watch Brexit Impact',
      correlatedAssets: ['GBP/USD', 'EUR/GBP', 'FTSE100'],
      expectedMove: 0.55,
      confidenceScore: 68
    },
    affectedAssets: ['GBP/USD', 'EUR/GBP', 'GBP/JPY', 'FTSE100']
  },
  {
    id: '12',
    name: 'German ZEW Economic Sentiment',
    country: 'Germany',
    region: 'EU',
    datetime: new Date('2025-10-10T10:00:00'),
    impact: 'medium',
    category: 'manufacturing',
    actual: undefined,
    consensus: 15.5,
    previous: 13.8,
    unit: 'Index',
    historicalData: {
      avgMove: 0.42,
      directionBias: 'bullish',
      biasSuccessRate: 61,
      peakImpactMinutes: 20,
      fadeTimeHours: 3
    },
    consensusIntelligence: {
      estimateDistribution: [12.0, 14.0, 15.5, 17.0, 18.5],
      revisionMomentum: 'up',
      surpriseProbability: 58,
      whisperNumber: 16.2
    },
    tradingSetup: {
      strategyTag: 'EUR Sentiment Play - Risk On/Off',
      correlatedAssets: ['EUR/USD', 'DAX', 'EUR/CHF'],
      expectedMove: 0.38,
      confidenceScore: 65
    },
    affectedAssets: ['EUR/USD', 'DAX', 'EUR/GBP', 'STOXX50']
  },
  {
    id: '13',
    name: 'US Initial Jobless Claims',
    country: 'United States',
    region: 'US',
    datetime: new Date('2025-10-11T13:30:00'),
    impact: 'medium',
    category: 'employment',
    actual: undefined,
    consensus: 215000,
    previous: 218000,
    unit: 'Claims',
    historicalData: {
      avgMove: 0.35,
      directionBias: 'neutral',
      biasSuccessRate: 49,
      peakImpactMinutes: 8,
      fadeTimeHours: 1
    },
    consensusIntelligence: {
      estimateDistribution: [210000, 213000, 215000, 218000, 220000],
      revisionMomentum: 'stable',
      surpriseProbability: 48,
    },
    tradingSetup: {
      strategyTag: 'Minor Impact - Watch for Surprise',
      correlatedAssets: ['DXY', 'SPY', 'USD/JPY'],
      expectedMove: 0.32,
      confidenceScore: 58
    },
    affectedAssets: ['USD/JPY', 'EUR/USD', 'SPY']
  },
  {
    id: '14',
    name: 'Canadian CPI',
    country: 'Canada',
    region: 'US',
    datetime: new Date('2025-10-11T13:30:00'),
    impact: 'high',
    category: 'inflation',
    actual: undefined,
    consensus: 2.8,
    previous: 2.9,
    unit: '% YoY',
    historicalData: {
      avgMove: 0.78,
      directionBias: 'bearish',
      biasSuccessRate: 67,
      peakImpactMinutes: 12,
      fadeTimeHours: 2
    },
    consensusIntelligence: {
      estimateDistribution: [2.6, 2.7, 2.8, 2.9, 3.0],
      revisionMomentum: 'down',
      surpriseProbability: 62,
      whisperNumber: 2.7
    },
    tradingSetup: {
      strategyTag: 'CAD Pairs Focus - BOC Policy Impact',
      correlatedAssets: ['USD/CAD', 'CAD/JPY', 'WTI Crude'],
      expectedMove: 0.75,
      confidenceScore: 78
    },
    affectedAssets: ['USD/CAD', 'CAD/JPY', 'Oil', 'TSX']
  },
  {
    id: '15',
    name: 'Japan Core Machine Orders',
    country: 'Japan',
    region: 'Asia',
    datetime: new Date('2025-10-11T00:50:00'),
    impact: 'low',
    category: 'manufacturing',
    actual: undefined,
    consensus: 2.5,
    previous: 1.8,
    unit: '% MoM',
    historicalData: {
      avgMove: 0.25,
      directionBias: 'neutral',
      biasSuccessRate: 50,
      peakImpactMinutes: 18,
      fadeTimeHours: 2
    },
    consensusIntelligence: {
      estimateDistribution: [1.5, 2.0, 2.5, 3.0, 3.5],
      revisionMomentum: 'up',
      surpriseProbability: 52,
    },
    tradingSetup: {
      strategyTag: 'Minor JPY Impact - Monitor Only',
      correlatedAssets: ['USD/JPY', 'Nikkei225'],
      expectedMove: 0.22,
      confidenceScore: 52
    },
    affectedAssets: ['USD/JPY', 'Nikkei225']
  },
];

export const mockCentralBankEvents: CentralBankEvent[] = [
  {
    id: 'cb1',
    bank: 'Federal Reserve',
    type: 'meeting',
    datetime: new Date('2025-10-15T19:00:00'),
    rateProbabilities: {
      cut: 15,
      hold: 78,
      hike: 7
    },
    keyTopics: ['Inflation trajectory', 'Labor market resilience', 'Quantitative Tightening pace']
  },
  {
    id: 'cb2',
    bank: 'Bank of England',
    type: 'meeting',
    datetime: new Date('2025-10-17T12:00:00'),
    rateProbabilities: {
      cut: 42,
      hold: 55,
      hike: 3
    },
    keyTopics: ['UK growth outlook', 'Inflation persistence', 'Brexit trade impacts']
  },
  {
    id: 'cb3',
    bank: 'ECB',
    type: 'speech',
    datetime: new Date('2025-10-12T14:00:00'),
    speaker: 'Christine Lagarde',
    rateProbabilities: {
      cut: 0,
      hold: 0,
      hike: 0
    },
    keyTopics: ['Euro area recovery', 'Inflation outlook', 'Monetary policy stance']
  },
  {
    id: 'cb4',
    bank: 'Federal Reserve',
    type: 'speech',
    datetime: new Date('2025-10-11T18:00:00'),
    speaker: 'Jerome Powell',
    rateProbabilities: {
      cut: 0,
      hold: 0,
      hike: 0
    },
    keyTopics: ['Economic outlook', 'Financial stability', 'Banking sector stress']
  }
];

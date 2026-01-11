import { EconomicEvent, ImpactLevel, Region, EventCategory } from '../app/calendar/components/economic-calendar/types';
import { mockEconomicEvents } from '../app/calendar/components/economic-calendar/mockData';
import { generateContent } from '@/lib/gemini';

// Types for API Responses
interface FMPCalendarEvent {
  event: string;
  date: string; // "2024-01-01 10:00:00"
  country: string;
  actual: number | null;
  estimate: number | null;
  previous: number | null;
  impact: string; // "Low", "Medium", "High"
  currency: string;
  unit: string;
}

interface FinnhubCalendarEvent {
  event: string;
  time: string; // "2024-01-01 10:00:00"
  country: string;
  actual: number | null;
  estimate: number | null;
  previous: number | null;
  impact: string; // "low", "medium", "high"
  unit: string;
}

export class EconomicCalendarService {
  private static FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
  private static FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  private static FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';
  private static FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

  /**
   * Fetch economic calendar events for a given date range.
   * Prioritizes FMP, falls back to Finnhub, then mock data.
   */
  static async getEvents(startDate: Date, endDate: Date): Promise<EconomicEvent[]> {
    const isPlaceholder = (key: string | undefined) => !key || key.includes('YOUR_') || key.includes('your_') || key === 'undefined';

    try {
      if (this.FMP_API_KEY && !isPlaceholder(this.FMP_API_KEY)) {
        console.log('Fetching economic calendar from Financial Modeling Prep...');
        return await this.fetchFromFMP(startDate, endDate);
      } else {
        console.info('FMP API key not configured or placeholder detected, trying Finnhub...');
        throw new Error('MISSING_FMP_KEY');
      }
    } catch (error) {
      if (error instanceof Error && error.message !== 'MISSING_FMP_KEY') {
        console.warn('FMP API check failed, attempting Finnhub fallback...', error.message);
      }
      
      if (this.FINNHUB_API_KEY && !isPlaceholder(this.FINNHUB_API_KEY)) {
        try {
          console.log('Fetching economic calendar from Finnhub...');
          return await this.fetchFromFinnhub(startDate, endDate);
        } catch (fError) {
          console.warn('Finnhub Fetch failed:', fError instanceof Error ? fError.message : fError);
        }
      }

      console.info('Using high-fidelity Mock Data for economic calendar (API keys not available or failed).');
      // Adjust mock dates to be relative to today/startDate so they show up in filters
      return mockEconomicEvents.map((event, index) => ({
        ...event,
        id: `mock-${event.id}-${index}`,
        datetime: new Date(startDate.getTime() + (index * 3600000 * 4)) // Spread them out every 4 hours
      }));
    }
  }

  // --- Financial Modeling Prep Implementation ---
  
  private static async fetchFromFMP(startDate: Date, endDate: Date): Promise<EconomicEvent[]> {
    const from = startDate.toISOString().split('T')[0];
    const to = endDate.toISOString().split('T')[0];
    const url = `${this.FMP_BASE_URL}/economic_calendar?from=${from}&to=${to}&apikey=${this.FMP_API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`FMP API Error ${response.status}: ${response.statusText || errorText.substring(0, 100)}`);
      }
      
      const data: FMPCalendarEvent[] = await response.json();
      return Promise.all(data.map(event => this.mapFMPEventToDomain(event)));
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown FMP API Error');
    }
  }

  private static async mapFMPEventToDomain(event: FMPCalendarEvent): Promise<EconomicEvent> {
    // Generate an ID (FMP doesn't provide one)
    const id = `${event.event}-${event.date}-${event.country}`.replace(/\s+/g, '-').toLowerCase();
    const affectedAssets = EconomicCalendarService.deduceAffectedAssets(event.country, event.event);

    const [historicalData, tradingSetup] = await Promise.all([
      EconomicCalendarService.generateHistoricalDataReal(event.event, event.country),
      EconomicCalendarService.generateTradingSetupReal(event.event, event.impact, affectedAssets)
    ]);

    return {
      id,
      name: event.event,
      country: event.country,
      region: EconomicCalendarService.mapCountryToRegion(event.country),
      datetime: new Date(event.date),
      impact: EconomicCalendarService.mapImpact(event.impact),
      category: EconomicCalendarService.deduceCategory(event.event),
      actual: event.actual ?? undefined,
      consensus: event.estimate ?? 0,
      previous: event.previous ?? 0,
      unit: event.unit || '',
      
      historicalData,
      consensusIntelligence: EconomicCalendarService.generateConsensusIntelligence(event.estimate, event.previous),
      tradingSetup,
      affectedAssets,
    };
  }

  // --- Finnhub Implementation ---

  private static async fetchFromFinnhub(startDate: Date, endDate: Date): Promise<EconomicEvent[]> {
    const from = startDate.toISOString().split('T')[0];
    const to = endDate.toISOString().split('T')[0];
    const url = `${this.FINNHUB_BASE_URL}/calendar/economic?from=${from}&to=${to}&token=${this.FINNHUB_API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Finnhub API Error ${response.status}: ${response.statusText || errorText.substring(0, 100)}`);
      }
      
      const data = await response.json();
      const events: FinnhubCalendarEvent[] = Array.isArray(data) ? data : data.economicCalendar || [];
      return Promise.all(events.map(event => this.mapFinnhubEventToDomain(event)));
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Unknown Finnhub API Error');
    }
  }

  private static async mapFinnhubEventToDomain(event: FinnhubCalendarEvent): Promise<EconomicEvent> {
    const id = `${event.event}-${event.time}-${event.country}`.replace(/\s+/g, '-').toLowerCase();
    const affectedAssets = EconomicCalendarService.deduceAffectedAssets(event.country, event.event);

    const [historicalData, tradingSetup] = await Promise.all([
      EconomicCalendarService.generateHistoricalDataReal(event.event, event.country),
      EconomicCalendarService.generateTradingSetupReal(event.event, event.impact, affectedAssets)
    ]);

    return {
      id,
      name: event.event,
      country: event.country,
      region: EconomicCalendarService.mapCountryToRegion(event.country),
      datetime: new Date(event.time),
      impact: EconomicCalendarService.mapImpact(event.impact),
      category: EconomicCalendarService.deduceCategory(event.event),
      actual: event.actual ?? undefined,
      consensus: event.estimate ?? 0,
      previous: event.previous ?? 0,
      unit: event.unit || '',

      historicalData,
      consensusIntelligence: EconomicCalendarService.generateConsensusIntelligence(event.estimate, event.previous),
      tradingSetup,
      affectedAssets,
    };
  }

  // --- Helper / Mapper Functions ---

  private static mapCountryToRegion(country: string): Region {
    const usMap = ['United States', 'USA', 'US'];
    const euMap = ['Euro Zone', 'Germany', 'France', 'Italy', 'Spain', 'EU'];
    const ukMap = ['United Kingdom', 'UK', 'Great Britain'];
    const asiaMap = ['Japan', 'China', 'Australia', 'New Zealand', 'South Korea', 'India'];
    
    if (usMap.includes(country)) return 'US';
    if (euMap.includes(country)) return 'EU';
    if (ukMap.includes(country)) return 'UK';
    if (asiaMap.includes(country)) return 'Asia';
    return 'EM'; // Everything else as Emerging Markets for now
  }

  private static mapImpact(impact: string): ImpactLevel {
    if (!impact) return 'low';
    const lower = impact.toLowerCase();
    if (lower.includes('high')) return 'high';
    if (lower.includes('medium')) return 'medium';
    return 'low';
  }

  private static deduceCategory(eventName: string): EventCategory {
    const name = eventName.toLowerCase();
    if (name.includes('cpi') || name.includes('inflation') || name.includes('price index')) return 'inflation';
    if (name.includes('employment') || name.includes('job') || name.includes('payroll') || name.includes('unemployment')) return 'employment';
    if (name.includes('gdp') || name.includes('growth')) return 'gdp';
    if (name.includes('rate') || name.includes('meeting') || name.includes('bank') || name.includes('fomc')) return 'centralBank';
    if (name.includes('trade') || name.includes('export') || name.includes('import') || name.includes('balance')) return 'trade';
    if (name.includes('retail') || name.includes('consumption')) return 'retail';
    if (name.includes('pmi') || name.includes('manufacturing') || name.includes('industrial')) return 'manufacturing';
    if (name.includes('housing') || name.includes('home')) return 'housing';
    return 'trade'; // Default fallback
  }

  private static deduceAffectedAssets(country: string, eventName: string): string[] {
    const assets: string[] = [];
    const region = this.mapCountryToRegion(country);

    if (region === 'US') {
        assets.push('EUR/USD', 'USD/JPY', 'SPY', 'Gold');
        if (eventName.toLowerCase().includes('oil') || eventName.includes('inventories')) assets.push('WTI');
    } else if (region === 'EU') {
        assets.push('EUR/USD', 'EUR/GBP', 'DAX');
    } else if (region === 'UK') {
        assets.push('GBP/USD', 'EUR/GBP', 'FTSE100');
    } else if (country === 'Japan') {
        assets.push('USD/JPY', 'EUR/JPY', 'Nikkei');
    } else if (country === 'Australia') {
        assets.push('AUD/USD', 'AUD/JPY');
    } else if (country === 'Canada') {
        assets.push('USD/CAD', 'Oil');
    }

    return assets.slice(0, 4);
  }

  // --- Real AI Data Generators (replacing mocks) ---
  
  static async generateHistoricalDataReal(eventName: string, country: string): Promise<EconomicEvent['historicalData']> {
    try {
      const prompt = `Provide a historical volatility analysis for the economic event "${eventName}" in ${country}. 
      Return ONLY a JSON object with: 
      avgMove (number, e.g. 0.45), 
      directionBias (string: 'bullish'|'bearish'|'neutral'), 
      biasSuccessRate (number, e.g. 65), 
      peakImpactMinutes (number), 
      fadeTimeHours (number).`;
      
      const response = await generateContent(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : this.generateHistoricalData(eventName, 'low');
    } catch (e) {
      return this.generateHistoricalData(eventName, 'low');
    }
  }

  static async generateTradingSetupReal(eventName: string, impact: string, assets: string[]): Promise<EconomicEvent['tradingSetup']> {
    try {
      const prompt = `Create a trading setup for "${eventName}" (Impact: ${impact}). 
      Affected assets: ${assets.join(', ')}.
      Return ONLY a JSON object with: 
      strategyTag (string), 
      expectedMove (number), 
      confidenceScore (number).`;
      
      const response = await generateContent(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const setup = jsonMatch ? JSON.parse(jsonMatch[0]) : { strategyTag: 'Wait for confirmation', expectedMove: 0.1, confidenceScore: 50 };
      return { ...setup, correlatedAssets: assets };
    } catch (e) {
      return this.generateTradingSetup(eventName, impact, assets);
    }
  }

  // --- Mock Data Generators (to fill rich UI requirements) ---
  
  private static generateHistoricalData(eventName: string, impact: string): EconomicEvent['historicalData'] {
    // Generate pseudo-random consistentish stats based on name length or similar to keep it deterministic per event
    const seed = eventName.length; 
    
    return {
      avgMove: 0.2 + (seed % 10) / 10,
      directionBias: seed % 3 === 0 ? 'bullish' : seed % 3 === 1 ? 'bearish' : 'neutral',
      biasSuccessRate: 40 + (seed % 40),
      peakImpactMinutes: 5 + (seed % 25),
      fadeTimeHours: 1 + (seed % 4),
    };
  }

  private static generateConsensusIntelligence(estimate: number | null, previous: number | null): EconomicEvent['consensusIntelligence'] {
    const base = estimate || previous || 100;
    
    return {
      estimateDistribution: [base * 0.98, base * 0.99, base, base * 1.01, base * 1.02],
      revisionMomentum: Math.random() > 0.5 ? 'up' : 'down',
      surpriseProbability: 30 + Math.floor(Math.random() * 40),
      whisperNumber: base * (1 + (Math.random() - 0.5) * 0.05),
    };
  }

  private static generateTradingSetup(eventName: string, impact: string, correlatedAssets: string[]): EconomicEvent['tradingSetup'] {
    const strategies = [
        'Fade the first move',
        'Breakout pending',
        'Range bound expectation',
        'Volatility expansion',
        'Wait for confirmation'
    ];
    
    return {
      strategyTag: strategies[eventName.length % strategies.length],
      correlatedAssets: correlatedAssets, 
      expectedMove: 0.5,
      confidenceScore: 50 + (eventName.length % 40),
    };
  }
}

import type { EconomicCalendarEvent } from "@/types";
import axios from 'axios';

interface InvestingItem {
  time: string;
  event: string;
  country: string;
  forecast?: string;
  previous?: string;
  actual?: string | null;
  impact: number;
}

interface NewsAPIArticle {
  publishedAt: string;
  title: string;
}

const MOCK_EVENTS: EconomicCalendarEvent[] = [
	{
		id: "eco-1",
		time: "08:30",
		event: "Initial Jobless Claims",
		country: "US",
		consensus: "228K",
		previous: "232K",
		actual: null,
		impact: "medium",
	},
	{
		id: "eco-2",
		time: "10:00",
		event: "ISM Manufacturing PMI",
		country: "US",
		consensus: "49.8",
		previous: "48.6",
		actual: null,
		impact: "high",
	},
	{
		id: "eco-3",
		time: "14:00",
		event: "FOMC Member Speech",
		country: "US",
		consensus: "-",
		previous: "-",
		actual: null,
		impact: "high",
	},
];

let cache: { data: EconomicCalendarEvent[], timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function scrapeInvestingCom(): Promise<EconomicCalendarEvent[]> {
  const today = new Date().toISOString().split('T')[0];
  const response = await axios.post('https://www.investing.com/economic-calendar/Service/getCalendarFilteredData', {
    dateFrom: today,
    dateTo: today,
    timeZone: 8,
    timeFilter: 'all',
    currentTab: 'custom',
    submitFilters: 1,
    limit_from: 0
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  const data = response.data;
  if (data && data.data) {
    return data.data.map((item: InvestingItem, index: number) => ({
      id: `inv-${index}`,
      time: item.time,
      event: item.event,
      country: item.country,
      consensus: item.forecast || '',
      previous: item.previous || '',
      actual: item.actual || null,
      impact: item.impact === 3 ? 'high' : item.impact === 2 ? 'medium' : 'low'
    }));
  }
  return [];
}

async function fallbackToFreeAPIs(): Promise<EconomicCalendarEvent[]> {
  // As fallback, try NewsAPI for market news, but format as calendar events (not ideal)
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'business',
        country: 'us',
        apiKey: process.env.NEWSAPI_KEY // Assume env var, but since free, user needs to add
      }
    });
    const articles = response.data.articles.slice(0, 5);
    return articles.map((article: NewsAPIArticle, index: number) => ({
      id: `news-${index}`,
      time: new Date(article.publishedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      event: article.title,
      country: 'US',
      consensus: '-',
      previous: '-',
      actual: null,
      impact: 'medium' as const
    }));
  } catch {
    console.error('Free API fallback failed, using mock');
    return MOCK_EVENTS;
  }
}

export async function getEconomicCalendar(): Promise<EconomicCalendarEvent[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }
  try {
    // Primary: Scrape Investing.com via API
    const data = await scrapeInvestingCom();
    if (data.length > 0) {
      cache = { data, timestamp: Date.now() };
      return data;
    }
  } catch {
    // console.error('Investing.com scraping failed, using fallback');
  }
  // Fallback: Free APIs
  const data = await fallbackToFreeAPIs();
  cache = { data, timestamp: Date.now() };
  return data;
}
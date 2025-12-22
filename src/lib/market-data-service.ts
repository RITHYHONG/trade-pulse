// lib/market-data-service.ts
interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'crypto' | 'stock' | 'currency';
}

// API Keys - Add these to your .env.local file
const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || '';
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || '';
const EXCHANGE_RATE_API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY || '';

export async function getCryptoData(): Promise<MarketItem[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) {
      throw new Error('CoinGecko API error');
    }

    const data = await response.json();

    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: data.bitcoin?.usd || 0,
        change: data.bitcoin?.usd_24h_change || 0,
        changePercent: data.bitcoin?.usd_24h_change || 0,
        type: 'crypto'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: data.ethereum?.usd || 0,
        change: data.ethereum?.usd_24h_change || 0,
        changePercent: data.ethereum?.usd_24h_change || 0,
        type: 'crypto'
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: data.solana?.usd || 0,
        change: data.solana?.usd_24h_change || 0,
        changePercent: data.solana?.usd_24h_change || 0,
        type: 'crypto'
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        price: data.cardano?.usd || 0,
        change: data.cardano?.usd_24h_change || 0,
        changePercent: data.cardano?.usd_24h_change || 0,
        type: 'crypto'
      }
    ];
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
}

export async function getStockData(): Promise<MarketItem[]> {
  if (!ALPHA_VANTAGE_API_KEY) {
    console.warn('Alpha Vantage API key not found');
    return [];
  }

  const symbols = ['AAPL', 'TSLA', 'NVDA', 'GOOGL'];
  const stockData: MarketItem[] = [];

  for (const symbol of symbols) {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error for ${symbol}`);
      }

      const data = await response.json();

      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        const price = parseFloat(quote['05. price']);
        const previousClose = parseFloat(quote['08. previous close']);
        const change = price - previousClose;
        const changePercent = (change / previousClose) * 100;

        stockData.push({
          symbol,
          name: getStockName(symbol),
          price,
          change,
          changePercent,
          type: 'stock'
        });
      }

      // Rate limiting - Alpha Vantage free tier allows 5 calls/minute
      await new Promise(resolve => setTimeout(resolve, 12000)); // 12 second delay
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
    }
  }

  return stockData;
}

export async function getCurrencyData(): Promise<MarketItem[]> {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );

    if (!response.ok) {
      throw new Error('ExchangeRate API error');
    }

    const data = await response.json();
    const rates = data.rates;

    // Get yesterday's rates for change calculation (simplified - in production you'd use historical API)
    const yesterdayResponse = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
    const yesterdayData = yesterdayResponse.ok ? await yesterdayResponse.json() : null;

    return [
      {
        symbol: 'EUR/USD',
        name: 'Euro',
        price: rates.EUR || 0,
        change: yesterdayData ? (rates.EUR - yesterdayData.rates.EUR) : 0,
        changePercent: yesterdayData ? ((rates.EUR - yesterdayData.rates.EUR) / yesterdayData.rates.EUR) * 100 : 0,
        type: 'currency'
      },
      {
        symbol: 'GBP/USD',
        name: 'British Pound',
        price: rates.GBP || 0,
        change: yesterdayData ? (rates.GBP - yesterdayData.rates.GBP) : 0,
        changePercent: yesterdayData ? ((rates.GBP - yesterdayData.rates.GBP) / yesterdayData.rates.GBP) * 100 : 0,
        type: 'currency'
      },
      {
        symbol: 'JPY/USD',
        name: 'Japanese Yen',
        price: rates.JPY || 0,
        change: yesterdayData ? (rates.JPY - yesterdayData.rates.JPY) : 0,
        changePercent: yesterdayData ? ((rates.JPY - yesterdayData.rates.JPY) / yesterdayData.rates.JPY) * 100 : 0,
        type: 'currency'
      }
    ];
  } catch (error) {
    console.error('Error fetching currency data:', error);
    return [];
  }
}

export async function getAllMarketData(): Promise<MarketItem[]> {
  try {
    const [cryptoData, stockData, currencyData] = await Promise.allSettled([
      getCryptoData(),
      getStockData(),
      getCurrencyData()
    ]);

    const allData: MarketItem[] = [];

    if (cryptoData.status === 'fulfilled') {
      allData.push(...cryptoData.value);
    }
    if (stockData.status === 'fulfilled') {
      allData.push(...stockData.value);
    }
    if (currencyData.status === 'fulfilled') {
      allData.push(...currencyData.value);
    }

    return allData;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
}

function getStockName(symbol: string): string {
  const names: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corp.',
    'GOOGL': 'Alphabet Inc.'
  };
  return names[symbol] || symbol;
}
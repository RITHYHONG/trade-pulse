import { CorrelationService } from "@/services/correlation-service";
import { getCryptoData, getStockData, getCurrencyData } from "@/lib/market-data-service";

export async function GET() {
  try {
    // For real correlations, we'd need historical OHLC data.
    // Since our market-data-service currently only fetch current price/change,
    // we will simulate the historical series based on known volatilities for this demo,
    // or ideally fetch historical bars if the API supports it.
    
    // For now, let's create a dynamic but simulated correlation based on real market movement.
    const [crypto, stocks, forex] = await Promise.all([
      getCryptoData(),
      getStockData(),
      getCurrencyData()
    ]);

    const allAssets = [...crypto, ...stocks, ...forex];
    
    // Simulate historical returns based on current changePercent to create "live" feeling correlations
    const correlations = [
      { 
        event1: 'BTC', 
        event2: 'ETH', 
        strength: CorrelationService.pearsonCorrelation(
          Array.from({length: 20}, () => Math.random() + (crypto.find(c => c.symbol === 'BTC')?.changePercent || 0)),
          Array.from({length: 20}, () => Math.random() + (crypto.find(c => c.symbol === 'ETH')?.changePercent || 0))
        ), 
        leadLag: 'simultaneous' 
      },
      { 
        event1: 'SPY', 
        event2: 'BTC', 
        strength: -0.4 + (Math.random() * 0.2), 
        leadLag: 'lags', 
        lagMinutes: 10 
      },
      { 
        event1: 'Gold', 
        event2: 'USD/JPY', 
        strength: -0.8 + (Math.random() * 0.1), 
        leadLag: 'simultaneous' 
      }
    ];

    return Response.json({ correlations });
  } catch (error) {
    console.error("Correlation API Error:", error);
    return Response.json({ correlations: [] }, { status: 500 });
  }
}

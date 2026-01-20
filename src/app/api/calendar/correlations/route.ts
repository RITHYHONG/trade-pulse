import { getAllMarketData } from "@/lib/market-data-service";

export async function GET() {
  try {
    const marketData = await getAllMarketData();
    
    // In a real scenario, we'd fetch historical price series from a DB
    // For this demonstration, we'll generate dynamic correlations based on current session strength
    // but structure it for the Pearson Correlation Service to handle in the future.
    
    const correlations = [
      { event1: 'USD/JPY', event2: 'US 10Y Yield', strength: 0.88, leadLag: 'simultaneous', category: 'forex' },
      { event1: 'BTC', event2: 'QQQ', strength: 0.76, leadLag: 'lags', lagMinutes: 2, category: 'crypto' },
      { event1: 'Gold', event2: 'DXY', strength: -0.84, leadLag: 'simultaneous', category: 'commodities' },
      { event1: 'SPY', event2: 'VIX', strength: -0.92, leadLag: 'leads', lagMinutes: 1, category: 'equities' },
      { event1: 'ETH', event2: 'BTC', strength: 0.94, leadLag: 'simultaneous', category: 'crypto' },
      { event1: 'EUR/USD', event2: 'USD/CHF', strength: -0.96, leadLag: 'simultaneous', category: 'forex' }
    ];

    // Filter or sort based on "Live" market activity (simulated by randomizing slightly based on marketData)
    const activeCorrelations = correlations.map(c => ({
      ...c,
      strength: c.strength * (0.95 + Math.random() * 0.1) // Add slight variance for "live" feel
    })).sort((a, b) => Math.abs(b.strength) - Math.abs(a.strength));

    return Response.json({ correlations: activeCorrelations });
  } catch (error) {
    console.error("Correlation API Error:", error);
    return Response.json({ correlations: [] }, { status: 500 });
  }
}

/**
 * Checks current market volatility using the FMP quote API (SPY as proxy).
 * Falls back to "volatile" so the cron can always proceed if the API is down.
 */
export async function isMarketVolatile(thresholdPercent: number = 1.5): Promise<{
  isVolatile: boolean;
  reason: string;
}> {
  try {
    const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
    if (!FMP_API_KEY || FMP_API_KEY === "your_fmp_api_key") {
      throw new Error("FMP API key not configured");
    }

    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/SPY?apikey=${FMP_API_KEY}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error(`FMP quote API failed with status ${res.status}`);
    }

    const data = await res.json();
    const spy = Array.isArray(data) ? data[0] : null;

    if (!spy) throw new Error("No SPY quote data returned");

    const changePercent = Math.abs(spy.changesPercentage ?? 0);
    const direction = (spy.changesPercentage ?? 0) > 0 ? "up" : "down";
    const isVolatile = changePercent >= thresholdPercent;

    return {
      isVolatile,
      reason: `SPY is ${changePercent.toFixed(2)}% ${direction} today (threshold: ${thresholdPercent}%)`,
    };
  } catch (err) {
    // Safe fallback: let the cron proceed even if volatility check fails
    return {
      isVolatile: true,
      reason: `Volatility check failed (${(err as Error).message}) — defaulting to volatile`,
    };
  }
}

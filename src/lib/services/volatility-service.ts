import { getAllMarketData } from "@/lib/market-data-service";

/**
 * Checks if the market is currently considered volatile.
 * Volatility is defined as any major asset moving more than a threshold percentage.
 *
 * @param thresholdPercent The percentage change (absolute) to consider volatile. Default is 3%.
 * @returns Object containing isVolatile boolean and the reason (asset that triggered it).
 */
export async function isMarketVolatile(
  thresholdPercent: number = 3,
): Promise<{ isVolatile: boolean; reason?: string }> {
  try {
    const marketData = await getAllMarketData();

    // Filter for major assets we care about for volatility checks
    // We should match the assets we are actually fetching in market-data-service.ts
    const majorAssets = [
      "BTC",
      "ETH",
      "SOL",
      "BNB",
      "AAPL",
      "TSLA",
      "NVDA",
      "GOOGL",
      "MSFT",
      "AMD",
    ];

    // Check if any major asset has moved more than the threshold
    const volatileAsset = marketData.find((item) => {
      // Check if it's a major asset (if symbol matches or contains)
      const isMajor = majorAssets.some((major) =>
        item.symbol.toUpperCase().includes(major.toUpperCase()),
      );
      if (!isMajor) return false;

      return Math.abs(item.changePercent) >= thresholdPercent;
    });

    if (volatileAsset) {
      return {
        isVolatile: true,
        reason: `${volatileAsset.name} (${volatileAsset.symbol}) moved ${volatileAsset.changePercent.toFixed(2)}%`,
      };
    }

    return { isVolatile: false };
  } catch (error) {
    console.error("Error checking market volatility:", error);
    // Fail safe: if we can't check, assume not volatile to avoid spamming,
    // OR assume volatile if you want to ensure content generation.
    // Let's assume NOT volatile to be safe.
    return { isVolatile: false, reason: "Error fetching market data" };
  }
}

import { NextResponse } from "next/server";
import { getMarketNews } from "@/lib/api/news-api";
import { isMarketVolatile } from "@/lib/services/volatility-service";
import { generateBlogPost } from "@/lib/services/content-generator";
import {
  createBlogPostAdmin,
  countAuthorPostsToday,
  getAuthorProcessedNewsIds,
} from "@/lib/services/blog-admin-service";

export const dynamic = "force-dynamic";

const VOLATILITY_THRESHOLD = 1.5;
const MAX_POSTS_PER_DAY = 20;
const SYSTEM_USER_ID = "system-auto-blogger";

function deriveCategory(primaryAsset: string, tags: string[]): string {
  const asset = primaryAsset.toUpperCase();
  const lowerTags = tags.map((t) => t.toLowerCase());

  const CRYPTO_TICKERS = new Set([
    "BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "DOGE", "ADA",
    "AVAX", "DOT", "MATIC", "LTC", "LINK", "UNI", "ATOM",
  ]);
  const CRYPTO_KEYWORDS = ["crypto", "bitcoin", "ethereum", "blockchain", "defi", "nft", "altcoin", "web3"];
  if (CRYPTO_TICKERS.has(asset) || lowerTags.some((t) => CRYPTO_KEYWORDS.includes(t))) {
    return "Crypto";
  }

  const FOREX_KEYWORDS = ["forex", "currency", "fx", "eurusd", "gbpusd", "usdjpy", "audusd"];
  if (asset.includes("/") || lowerTags.some((t) => FOREX_KEYWORDS.includes(t))) {
    return "Forex";
  }

  const COMMODITY_KEYWORDS = ["gold", "silver", "oil", "crude", "commodity", "commodities", "natural gas", "copper"];
  if (lowerTags.some((t) => COMMODITY_KEYWORDS.some((k) => t.includes(k)))) {
    return "Commodities";
  }

  const MACRO_KEYWORDS = ["macro", "fed", "fomc", "interest rate", "inflation", "gdp", "cpi", "ppi", "economic", "recession"];
  if (lowerTags.some((t) => MACRO_KEYWORDS.some((k) => t.includes(k)))) {
    return "Macro";
  }

  if (asset && !asset.includes("/")) {
    return "Stocks";
  }

  return "Market Update";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";
    const authHeader = request.headers.get("Authorization");

    // Security: validate CRON_SECRET in production
    if (
      !force &&
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Check daily post limit
    const postsToday = await countAuthorPostsToday(SYSTEM_USER_ID);
    if (!force && postsToday >= MAX_POSTS_PER_DAY) {
      return NextResponse.json({
        message: `Already reached daily limit of ${MAX_POSTS_PER_DAY} posts.`,
        postsToday,
      });
    }

    // Volatility check (non-blocking — we log it but don't gate on it)
    const volatility = await isMarketVolatile(VOLATILITY_THRESHOLD);
    if (!force) {
      console.log(
        `Volatility check: ${volatility.isVolatile ? "Passed" : "Relaxed"} — ${volatility.reason}`,
      );
    }

    // Fetch market news
    const news = await getMarketNews();
    if (!news || news.length === 0) {
      return NextResponse.json(
        { message: "No news found to generate blog from." },
        { status: 404 },
      );
    }

    // Pick news not already processed (ever by system), prioritise freshest
    const processedIds = await getAuthorProcessedNewsIds(SYSTEM_USER_ID);
    
    const sortedNews = [...news].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    let selectedNews = sortedNews.find((n) => !processedIds.includes(n.id));

    if (!selectedNews && !force) {
      return NextResponse.json({
        success: false,
        message: "All fetched news items have already been processed.",
        processedCount: processedIds.length,
        availableCount: news.length,
        postsToday,
      });
    }

    // Fallback if forced
    selectedNews = selectedNews ?? sortedNews[0];
    console.log(`[cron] Selected news for processing: ${selectedNews.id} - ${selectedNews.title}`);

    // Generate blog content via Gemini
    console.log(`Generating blog post for: ${selectedNews.title}`);
    const blogContent = await generateBlogPost({
      ...selectedNews,
      image: (selectedNews as typeof selectedNews & { image?: string }).image,
    });

    // Save to Firestore
    const postId = await createBlogPostAdmin(
      {
        ...blogContent,
        blocks: [],
        category: deriveCategory(blogContent.primaryAsset, blogContent.tags),
        focusKeyword: blogContent.tags[0] ?? "Market News",
        featuredImage:
          (selectedNews as typeof selectedNews & { image?: string }).image ?? "",
        isDraft: false,
        sourceNewsId: selectedNews.id,
        sourceNewsTitle: selectedNews.title,
        sourceNewsUrl: selectedNews.url,
      },
      SYSTEM_USER_ID,
      "system@tradepulse.app",
      "TradePulse Team",
    );

    return NextResponse.json({
      success: true,
      postId,
      title: blogContent.title,
      sourceNewsTitle: selectedNews.title,
      sourceNewsUrl: selectedNews.url,
      postsToday: postsToday + 1,
      volatilityReason: volatility.reason,
    });
  } catch (error: unknown) {
    console.error("Cron Job Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stack:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 },
    );
  }
}

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
    console.log(`[cron] Daily progress: ${postsToday}/${MAX_POSTS_PER_DAY} posts already created today.`);
    if (!force && postsToday >= MAX_POSTS_PER_DAY) {
      console.log(`[cron] Daily limit reached. Skipping post generation.`);
      return NextResponse.json({
        message: `Already reached daily limit of ${MAX_POSTS_PER_DAY} posts.`,
        postsToday,
      });
    }

    // Volatility check (non-blocking — we log it but don't gate on it)
    console.log(`[cron] Checking market volatility...`);
    const volatility = await isMarketVolatile(VOLATILITY_THRESHOLD);
    if (!force) {
      console.log(
        `[cron] Volatility check: ${volatility.isVolatile ? "Passed" : "Relaxed"} — ${volatility.reason}`,
      );
    }

    // Fetch market news
    console.log(`[cron] Fetching market news...`);
    const news = await getMarketNews();
    if (!news || news.length === 0) {
      console.warn(`[cron] No news items returned from API.`);
      return NextResponse.json(
        { message: "No news found to generate blog from." },
        { status: 404 },
      );
    }
    console.log(`[cron] Found ${news.length} news items.`);

    // Pick news not already processed (ever by system), prioritise freshest
    const processedIds = await getAuthorProcessedNewsIds(SYSTEM_USER_ID);
    console.log(`[cron] Previously processed items: ${processedIds.length}`);
    
    const sortedNews = [...news].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    let selectedNews = sortedNews.find((n) => !processedIds.includes(n.id));

    if (!selectedNews && !force) {
      console.log(`[cron] No new/unprocessed news found.`);
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
    console.log(`[cron] Generating blog content for: "${selectedNews.title}" using AI service...`);
    const blogContent = await generateBlogPost({
      ...selectedNews,
      image: (selectedNews as typeof selectedNews & { image?: string }).image,
    });
    console.log(`[cron] AI generation complete. Title: "${blogContent.title}". Primary Asset: ${blogContent.primaryAsset || "None"}`);

    // Fetch real price if primaryAsset is available
    let priceData: { price: number; change: number } | null = null;
    if (blogContent.primaryAsset) {
      console.log(`[cron] Fetching current price for primary asset: ${blogContent.primaryAsset}...`);
      try {
        const FMP_API_KEY = process.env.NEXT_PUBLIC_FMP_API_KEY;
        if (FMP_API_KEY && FMP_API_KEY !== "your_fmp_api_key") {
          const res = await fetch(
            `https://financialmodelingprep.com/api/v3/quote/${blogContent.primaryAsset.toUpperCase()}?apikey=${FMP_API_KEY}`
          );
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            priceData = { price: data[0].price, change: data[0].change };
            console.log(`[cron] Real-time data found for ${blogContent.primaryAsset}: $${priceData.price}`);
            
            // Only update projectedPrice if it's missing or looks like a placeholder
            if (!blogContent.projectedPrice || blogContent.projectedPrice.toLowerCase().includes("pending") || blogContent.projectedPrice.toLowerCase().includes("tbd")) {
              const direction = blogContent.sentiment === "positive" || blogContent.sentiment === "bullish" ? 1.05 : 0.95;
              const projected = (priceData.price * direction).toFixed(2);
              blogContent.projectedPrice = `$${projected}`;
              console.log(`[cron] Updated projected price based on real data: ${blogContent.projectedPrice}`);
            }
          }
        }
      } catch (err) {
        console.error(`[cron] Failed to fetch real-time price for ${blogContent.primaryAsset}:`, err);
      }
    }

    // Save to Firestore
    console.log(`[cron] Saving blog post to Firestore...`);
    try {
      const postId = await createBlogPostAdmin(
        SYSTEM_USER_ID,
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
          _sparkline: blogContent._sparkline,
        },
      );
      console.log(`[cron] Success! Created post ID: ${postId}`);

      return NextResponse.json({
        success: true,
        postId,
        title: blogContent.title,
        sourceNewsTitle: selectedNews.title,
        sourceNewsUrl: selectedNews.url,
        postsToday: postsToday + 1,
        volatilityReason: volatility.reason,
      });
    } catch (saveError) {
      console.error(`[cron] FATAL: createBlogPostAdmin failed:`, saveError);
      throw new Error(`Failed to save blog post to database: ${saveError instanceof Error ? saveError.message : String(saveError)}`);
    }
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

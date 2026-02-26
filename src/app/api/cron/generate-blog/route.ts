import { NextResponse } from "next/server";
import { getMarketNews } from "@/lib/api/news-api";
import { isMarketVolatile } from "@/lib/services/volatility-service";
import { generateBlogPost } from "@/lib/services/content-generator";
import {
  createBlogPostAdmin,
  countAuthorPostsToday,
  getAuthorPostsToday,
} from "@/lib/services/blog-admin-service";

export const dynamic = "force-dynamic";

// Threshold for automatic generation
const VOLATILITY_THRESHOLD = 1.5; // Lowered from 3% to catch more market moves
const MAX_POSTS_PER_DAY = 2; // Back to 2 posts per day as requested
const SYSTEM_USER_ID = "system-auto-blogger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";
    const authHeader = request.headers.get("Authorization");

    // 0. Security: Basic protection for automated cron
    if (
      !force &&
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      // Allow it to run if secret is not set yet in dev, but block if set
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 0. Check Daily Limit
    const postsToday = await countAuthorPostsToday(SYSTEM_USER_ID);
    if (!force && postsToday >= MAX_POSTS_PER_DAY) {
      return NextResponse.json({
        message: `Already reached daily limit of ${MAX_POSTS_PER_DAY} posts.`,
        postsToday,
      });
    }

    // 1. Check Volatility
    // We log volatility but proceed anyway to ensure the "2 posts per day" goal is met.
    if (!force) {
      const { isVolatile, reason } =
        await isMarketVolatile(VOLATILITY_THRESHOLD);
      console.log(
        `Volatility check: ${isVolatile ? "Passed" : "Relaxed for daily goal"}. Reason: ${reason || "N/A"}`,
      );
    }

    // 2. Fetch News
    const news = await getMarketNews();
    if (!news || news.length === 0) {
      return NextResponse.json(
        { message: "No news found to generate blog from." },
        { status: 404 },
      );
    }

    // 3. Select News based on what's already posted today
    const existingTitles = await getAuthorPostsToday(SYSTEM_USER_ID);

    // Pick news that hasn't been posted today, and prioritize fresh news
    // Sort news by date if available
    const sortedNews = [...news].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    let selectedNews = sortedNews.find(
      (n) =>
        !existingTitles.some(
          (t) => t.toLowerCase().trim() === n.title.toLowerCase().trim(),
        ),
    );

    // Fallback: if we somehow posted all 10, pick the most recent one anyway
    // (unlikely, but ensures we don't break if news is slow)
    if (!selectedNews) {
      selectedNews = sortedNews[0];
      console.log(
        "Picking fallback news (already posted today but no other options)",
      );
    }

    // 4. Generate Content
    console.log(`Generating blog post for: ${selectedNews.title}`);
    const blogContent = await generateBlogPost(selectedNews);

    // 5. Save to Firestore
    const postId = await createBlogPostAdmin(
      {
        ...blogContent,
        blocks: [],
        primaryAsset: blogContent.primaryAsset,
        relatedAssets: blogContent.relatedAssets,
        confidenceLevel: blogContent.confidenceLevel,
        timeHorizon: blogContent.timeHorizon,
        category: blogContent.primaryAsset ? "Asset Analysis" : "Market Update",
        focusKeyword: blogContent.tags[0] || "Market News",
        featuredImage: selectedNews.image || "",
        isDraft: false,
      },
      SYSTEM_USER_ID,
      "system@tradepulse.app",
      "TradePulse Team",
    );

    return NextResponse.json({
      success: true,
      postId,
      title: blogContent.title,
      postsToday: postsToday + 1,
      volatilityReason: (await isMarketVolatile(VOLATILITY_THRESHOLD)).reason,
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

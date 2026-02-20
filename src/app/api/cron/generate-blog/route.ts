import { NextResponse } from "next/server";
import { getMarketNews } from "@/lib/api/news-api";
import { isMarketVolatile } from "@/lib/services/volatility-service";
import { generateBlogPost } from "@/lib/services/content-generator";
import { createBlogPostAdmin, countAuthorPostsToday, getAuthorPostsToday } from "@/lib/services/blog-admin-service";

export const dynamic = "force-dynamic";

// Threshold for automatic generation
const VOLATILITY_THRESHOLD = 1.5; // Lowered from 3% to catch more market moves
const MAX_POSTS_PER_DAY = 2;
const SYSTEM_USER_ID = "system-auto-blogger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";
    const authHeader = request.headers.get("Authorization");

    // 0. Security: Basic protection for automated cron
    if (!force && process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
    if (!force) {
      const { isVolatile, reason } = await isMarketVolatile(VOLATILITY_THRESHOLD);
      if (!isVolatile) {
        return NextResponse.json({
          message: "Market not volatile enough for automatic generation.",
          reason,
          threshold: `${VOLATILITY_THRESHOLD}%`,
        });
      }
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
    
    // Pick the first news that hasn't been posted today
    let selectedNews = news.find(n => !existingTitles.some(t => t.toLowerCase() === n.title.toLowerCase()));

    // Fallback: if we somehow posted all 10, just stop (unlikely)
    if (!selectedNews) {
      return NextResponse.json({
        message: "All fetched news items have already been posted today.",
        count: existingTitles.length,
      });
    }

    // 4. Generate Content
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
        category: "Market Update",
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
    });
  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

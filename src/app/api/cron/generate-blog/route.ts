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

const VOLATILITY_THRESHOLD = 1.5;
const MAX_POSTS_PER_DAY = 20;
const SYSTEM_USER_ID = "system-auto-blogger";

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

    // Pick news not already posted today, prioritise freshest
    const existingTitles = await getAuthorPostsToday(SYSTEM_USER_ID);
    const sortedNews = [...news].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    let selectedNews =
      sortedNews.find(
        (n) =>
          !existingTitles.some(
            (t) => t.toLowerCase().trim() === n.title.toLowerCase().trim(),
          ),
      ) ?? sortedNews[0];

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
        category: blogContent.primaryAsset ? "Asset Analysis" : "Market Update",
        focusKeyword: blogContent.tags[0] ?? "Market News",
        featuredImage:
          (selectedNews as typeof selectedNews & { image?: string }).image ?? "",
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

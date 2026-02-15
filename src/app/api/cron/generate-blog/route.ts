import { NextResponse } from "next/server";
import { getMarketNews } from "@/lib/api/news-api";
import { isMarketVolatile } from "@/lib/services/volatility-service";
import { generateBlogPost } from "@/lib/services/content-generator";
import { createBlogPostAdmin } from "@/lib/services/blog-admin-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    // 1. Check Volatility
    if (!force) {
      const { isVolatile, reason } = await isMarketVolatile();
      if (!isVolatile) {
        return NextResponse.json({
          message: "Market not volatile enough for blog generation.",
          reason,
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

    // 3. Select Best News Code
    // For now, let's pick the first one, or maybe filter by sentiment/relevance in future.
    const selectedNews = news[0];

    // 4. Generate Content
    const blogContent = await generateBlogPost(selectedNews);

    // 5. Save to Firestore
    // We need a stable ID for the system user.
    // In a real app, strict auth would limit this to admin or a specific service account.
    // For now, we'll use a placeholder system ID.
    const SYSTEM_USER_ID = "system-auto-blogger";

    // We must ensure the 'blocks' array matches the 'BlogPost' interface from 'blog-firestore-service.ts'
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

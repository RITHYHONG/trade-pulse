import { Metadata } from 'next';
import { BlogIndex } from './BlogIndex';

export const metadata: Metadata = {
  title: 'Trading Insights & Market Analysis | Trader Pulse Blog',
  description: 'Stay ahead with our expert trading insights, market analysis, and pre-market intelligence. Get the latest trends and strategies from professional traders.',
  keywords: 'trading insights, market analysis, pre-market, trading strategies, financial news',
  openGraph: {
    title: 'Trading Insights & Market Analysis | Trader Pulse Blog',
    description: 'Expert trading insights and market analysis to keep you ahead of the curve',
    type: 'website',
  },
};

import { getPublishedPosts, getFeaturedPosts, BlogPost as FirestoreBlogPost } from '@/lib/blog-firestore-service';
import { BlogPost as UIBlogPost } from '@/types/blog';

// Helper: map Firestore post shape to UI BlogPost
function mapFirestoreToUI(fsp: FirestoreBlogPost): UIBlogPost {
  const toDateString = (d: unknown): string => {
    if (!d) return new Date().toISOString();
    if (d instanceof Date) return d.toISOString();
    // Firestore Timestamp
    if (typeof (d as { toDate?: () => Date })?.toDate === 'function') {
      return ((d as { toDate: () => Date }).toDate()).toISOString();
    }
    return new Date(String(d)).toISOString();
  };

  return {
    id: fsp.id,
    slug: fsp.slug,
    title: fsp.title,
    excerpt: fsp.metaDescription || (fsp.content?.substring(0, 160) ?? ''),
    content: fsp.content ?? '',
    publishedAt: toDateString(fsp.publishedAt),
    updatedAt: fsp.updatedAt ? toDateString(fsp.updatedAt) : undefined,
    readingTime: '5 min read',
    tags: fsp.tags || [],
    featuredImage: fsp.featuredImage || '/images/placeholder-blog.svg',
    author: {
      name: fsp.authorName || fsp.authorEmail?.split('@')[0] || 'Anonymous',
      avatar: fsp.authorAvatar || '/images/default-avatar.svg',
      avatarUrl: fsp.authorAvatar || '/images/default-avatar.svg', // Ensure compatibility
    },
    authorId: fsp.authorId,
    category: fsp.category,
    isFeatured: false,
    views: typeof fsp.views === 'number' ? fsp.views : 0,
  };
}

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const [publishedPosts, featuredFs] = await Promise.all([
    getPublishedPosts(50), // Limit to 50 for initial load
    getFeaturedPosts(5)
  ]);

  const posts = publishedPosts.map(mapFirestoreToUI);
  const featured = featuredFs.map(mapFirestoreToUI);

  return (
    <div className="overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main id="main-content">
        <BlogIndex initialPosts={posts} featuredPosts={featured} />
      </main>
    </div>
  );
}
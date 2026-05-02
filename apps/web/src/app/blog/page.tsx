import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { BlogIndex } from './BlogIndex';
import { getPublishedPosts, BlogPost as FirestoreBlogPost } from '@/lib/blog-firestore-service';
import { BlogPost as UIBlogPost } from '@/types/blog';

export const metadata: Metadata = {
  title: 'Trading Insights & Market Analysis | Trade Pulse Blog',
  description: 'Stay ahead with expert trading insights, market analysis, and pre-market intelligence. Get the latest trends and strategies from professional traders.',
  keywords: 'trading insights, market analysis, pre-market analysis, trading strategies, financial news, stock market',
  authors: [{ name: 'Trade Pulse Team' }],
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Trading Insights & Market Analysis | Trade Pulse Blog',
    description: 'Expert trading insights and market analysis to keep you ahead of the curve.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trading Insights & Market Analysis | Trade Pulse Blog',
    description: 'Expert trading insights and market analysis to keep you ahead of the curve.',
  },
};

// Cache Firestore reads for 1 hour on the server — prevents redundant network
// round-trips on every ISR cycle and dramatically reduces TTFB.
const getCachedPosts = unstable_cache(
  async () => getPublishedPosts(12),
  ['blog-published-posts'],
  { revalidate: 3600, tags: ['blog-posts'] },
);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legacyAuthor = (fsp as any).author || {};

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
      name: fsp.authorName || legacyAuthor.name || fsp.authorEmail?.split('@')[0] || 'Anonymous',
      avatar: fsp.authorAvatar || legacyAuthor.avatar || legacyAuthor.avatarUrl || '/images/default-avatar.svg',
      avatarUrl: fsp.authorAvatar || legacyAuthor.avatar || legacyAuthor.avatarUrl || '/images/default-avatar.svg',
      role: legacyAuthor.role || 'user',
    },
    authorId: fsp.authorId,
    category: fsp.category,
    isFeatured: false,
    views: typeof fsp.views === 'number' ? fsp.views : 0,
    sentiment: fsp.sentiment,
    confidenceLevel: fsp.confidenceLevel,
    primaryAsset: fsp.primaryAsset,
    relatedAssets: fsp.relatedAssets,
    timeHorizon: fsp.timeHorizon,
  };
}

export const revalidate = 3600;

export default async function BlogPage() {
  // Single cached Firestore read — featured posts are derived from the same result
  const publishedPosts = await getCachedPosts();

  const posts = publishedPosts.map(mapFirestoreToUI);
  const featured = posts.slice(0, 5);

  return (
    <div className="overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main id="main-content">
        <BlogIndex initialPosts={posts} featuredPosts={featured} />
      </main>
    </div>
  );
}
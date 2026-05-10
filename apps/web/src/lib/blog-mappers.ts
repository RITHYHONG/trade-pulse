import { BlogPost as FirestoreBlogPost } from '@/lib/blog-firestore-service';
import { BlogPost as UIBlogPost } from '@/types/blog';

/**
 * Converts a Firestore blog post to the UI blog post format.
 * Handles legacy data structures and provides fallbacks for missing fields.
 */
export function mapFirestoreToUI(fsp: FirestoreBlogPost): UIBlogPost {
  const toDateString = (d: unknown): string => {
    if (!d) return new Date().toISOString();
    if (d instanceof Date) return d.toISOString();
    if (typeof (d as { toDate?: () => Date })?.toDate === 'function') {
      return ((d as { toDate: () => Date }).toDate()).toISOString();
    }
    try {
      return new Date(String(d)).toISOString();
    } catch {
      return new Date().toISOString();
    }
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
      bio: legacyAuthor.bio || undefined,
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
    projectedPrice: fsp.projectedPrice,
    volatilityRisk: fsp.volatilityRisk,
    alphaProbability: fsp.alphaProbability,
    activeSignalsCount: fsp.activeSignalsCount,
    correlatedTickers: fsp.correlatedTickers,
    analysisCards: fsp.analysisCards,
  };
}
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPost as BlogPostComponent } from '../BlogPost';
import { blogPosts } from '@/data/blogData';
import { getPostBySlug, getPostsByCategory, BlogPost as FirestoreBlogPost } from '@/lib/blog-firestore-service';
import { BlogPost as UIBlogPost } from '@/types/blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // Revalidate every hour


export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Try Firestore first
  const fsPost = await getPostBySlug(slug);
  const post = fsPost
    ? mapFirestoreToUI(fsPost)
    : blogPosts.find(p => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found | Trader Pulse',
    };
  }

  const metaDescription = post.excerpt?.length > 160
    ? post.excerpt.slice(0, 157) + '...'
    : post.excerpt;

  return {
    title: `${post.title} | Trade Pulse`,
    description: metaDescription,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.author.name }],
    category: post.category,
    openGraph: {
      title: post.title,
      description: metaDescription,
      type: 'article',
      url: `/blog/${post.slug}`,
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630, alt: post.title }]
        : [],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: metaDescription,
      images: post.featuredImage ? [post.featuredImage] : [],
      creator: '@tradepulseapp',
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  // Prefer Firestore content; fallback to local seed data
  const fsPost = await getPostBySlug(slug);
  let post: UIBlogPost | undefined;
  let relatedPosts: UIBlogPost[] = [];

  if (fsPost) {
    post = mapFirestoreToUI(fsPost);
    // Get related by category from Firestore (best-effort)
    if (fsPost.category) {
      const relatedFs = await getPostsByCategory(fsPost.category, 6);
      relatedPosts = relatedFs
        .filter(p => p.slug !== fsPost.slug)
        .map(mapFirestoreToUI)
        .slice(0, 3);
    }
  } else {
    post = blogPosts.find(p => p.slug === slug);
    if (post) {
      relatedPosts = blogPosts
        .filter(p => p.slug !== post!.slug && p.category === post!.category)
        .slice(0, 3);
    }
  }

  if (!post) {
    notFound();
  }

  // Build JSON-LD structured data
  const faqItems = post.content
    ? [...post.content.matchAll(/<h3[^>]*>([^<]+)<\/h3>\s*<p>([^<]+(?:<[^/][^>]*>[^<]*<\/[^>]+>[^<]*)*)<\/p>/g)]
        .slice(0, 6)
        .map(m => ({ question: m[1].trim(), answer: m[2].replace(/<[^>]+>/g, '').trim() }))
    : [];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage || post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { '@type': 'Person', name: post.author.name },
    publisher: {
      '@type': 'Organization',
      name: 'Trade Pulse',
      logo: { '@type': 'ImageObject', url: 'https://tradepulse.app/logo.png' },
    },
    keywords: post.tags?.join(', '),
    articleSection: post.category,
  };

  const faqJsonLd = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } : null;

  return (
    <div className="min-h-screen text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <BlogPostComponent
        post={post}
        relatedPosts={relatedPosts}
      />
    </div>
  );
}

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
    readingTime: '5 min',
    tags: fsp.tags || [],
    featuredImage: fsp.featuredImage || '/images/placeholder-blog.svg',
    author: {
      name: fsp.authorName || legacyAuthor.name || fsp.authorEmail?.split('@')[0] || 'Anonymous',
      avatar: fsp.authorAvatar || legacyAuthor.avatar || legacyAuthor.avatarUrl || '/images/default-avatar.svg',
      avatarUrl: fsp.authorAvatar || legacyAuthor.avatar || legacyAuthor.avatarUrl || '/images/default-avatar.svg',
      bio: legacyAuthor.bio || undefined,
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
    projectedPrice: fsp.projectedPrice,
    volatilityRisk: fsp.volatilityRisk,
    alphaProbability: fsp.alphaProbability,
    activeSignalsCount: fsp.activeSignalsCount,
    correlatedTickers: fsp.correlatedTickers,
    analysisCards: fsp.analysisCards,
  };
}

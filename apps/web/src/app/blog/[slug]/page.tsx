import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPost as BlogPostComponent } from '../BlogPost';
import { blogPosts } from '@/data/blogData';
import { getPostBySlugAdmin, getPostsByCategoryAdmin } from '@/lib/services/blog-admin-service';
import { BlogPost as UIBlogPost } from '@/types/blog';
import ViewTracker from '@/components/blog/ViewTracker';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

// Define the shape we expect from Admin SDK to avoid importing client-side files
interface DbPost {
  id?: string;
  slug?: string;
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  publishedAt?: unknown;
  updatedAt?: unknown;
  metaDescription?: string;
  featuredImage?: string;
  authorName?: string;
  authorEmail?: string;
  authorAvatar?: string;
  authorId?: string;
  views?: number;
  sentiment?: string;
  confidenceLevel?: number;
  primaryAsset?: string;
  relatedAssets?: string[];
  timeHorizon?: string;
}


export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    // Try Firestore first
    const fsPost = await getPostBySlugAdmin(slug);
    const post = fsPost
      ? mapFirestoreToUI(fsPost)
      : blogPosts.find(p => p.slug === slug);

    if (!post) {
      return {
        title: 'Post Not Found | Trader Pulse',
      };
    }

    return {
      title: `${post.title} | Trader Pulse Blog`,
      description: post.excerpt,
      keywords: post.tags?.join(', '),
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        images: post.featuredImage ? [{ url: post.featuredImage }] : [],
        publishedTime: post.publishedAt,
        authors: post.author?.name ? [post.author.name] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: 'Blog Post | Trader Pulse' };
  }
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  console.log(`[BlogPostPage] Attempting to load slug: ${slug}`);

  try {
    // Prefer Firestore content; fallback to local seed data
    const fsPost = await getPostBySlugAdmin(slug);
    console.log(`[BlogPostPage] Firestore lookup result for ${slug}: ${fsPost ? 'Found' : 'Not Found'}`);
    let post: UIBlogPost | undefined;
    let relatedPosts: UIBlogPost[] = [];

    if (fsPost) {
      post = mapFirestoreToUI(fsPost);
      // Get related by category from Firestore (best-effort)
      if (fsPost.category) {
        const relatedFs = await getPostsByCategoryAdmin(fsPost.category, 6);
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

    return (
      <div className="min-h-screen">
        <BlogPostComponent
          post={post}
          relatedPosts={relatedPosts}
        />
        <ViewTracker postId={post.id || 'unknown'} />
      </div>
    );
  } catch (error) {
    console.error("Critical error in BlogPostPage:", error);
    // Return a user-friendly error instead of 500
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Unavailable</h1>
        <p className="text-muted-foreground mb-8">We couldn&apos;t load this blog post. It might be a connection issue.</p>
        <Link
          href="/blog"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Back to Blog
        </Link>
      </div>
    );
  }
}

// Helper: map Firestore post shape to UI BlogPost
// Helper: map Firestore post shape to UI BlogPost
function mapFirestoreToUI(fsp: DbPost): UIBlogPost {
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
    slug: fsp.slug || '',
    title: fsp.title || 'Untitled',
    excerpt: fsp.metaDescription || (fsp.content?.substring(0, 160) ?? ''),
    content: fsp.content ?? '',
    publishedAt: toDateString(fsp.publishedAt),
    updatedAt: fsp.updatedAt ? toDateString(fsp.updatedAt) : undefined,
    readingTime: '5 min',
    tags: fsp.tags || [],
    featuredImage: fsp.featuredImage || '/images/placeholder-blog.svg',
    author: {
      name: fsp.authorName || fsp.authorEmail?.split('@')[0] || 'Anonymous',
      avatar: fsp.authorAvatar || '/images/default-avatar.svg',
      bio: undefined,
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
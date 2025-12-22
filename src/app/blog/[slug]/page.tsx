import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPost as BlogPostComponent } from '../BlogPost';
import { blogPosts } from '@/data/blogData';
import { getPostBySlug, getPostsByCategory, BlogPost as FirestoreBlogPost } from '@/lib/blog-firestore-service';
import { BlogPost as UIBlogPost } from '@/types/blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

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
      authors: post.author.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
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

  return (
    <div className="min-h-screen text-white">
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
      name: fsp.authorName || fsp.authorEmail?.split('@')[0] || 'Anonymous',
      avatar: fsp.authorAvatar || '/images/default-avatar.svg',
      bio: undefined,
    },
    authorId: fsp.authorId,
    category: fsp.category,
    isFeatured: false,
    views: typeof fsp.views === 'number' ? fsp.views : 0,
  };
}
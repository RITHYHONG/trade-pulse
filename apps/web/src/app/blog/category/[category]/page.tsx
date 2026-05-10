import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { BlogCard } from '@/app/blog/BlogCard';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { getPostsByCategory, BlogPost as FirestoreBlogPost } from '@/lib/blog-firestore-service';
import { BlogPost as UIBlogPost } from '@/types/blog';
import { mapFirestoreToUI } from '@/lib/blog-mappers';
import { blogPosts, categoryToSlug, slugToCategory, categories } from '@/data/blogData';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const getCachedPostsByCategory = unstable_cache(
  async (categoryName: string, limit: number) => {
    return await getPostsByCategory(categoryName, limit);
  },
  ['blog-category-posts'],
  { revalidate: 300 } // Cache for 5 minutes
);

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categoryName = slugToCategory(categorySlug);

  if (!categoryName || categoryName === 'All Posts') {
    return {
      title: 'Category Not Found | Trade Pulse',
      description: 'The requested category does not exist.',
    };
  }

  return {
    title: `${categoryName} News | Trade Pulse`,
    description: `Latest ${categoryName} headlines, analysis, and market commentary.`,
    openGraph: {
      title: `${categoryName} News | Trade Pulse`,
      description: `Latest ${categoryName} headlines, analysis, and market commentary.`,
      url: `/blog/category/${categorySlug}`,
      type: 'website',
    },
    alternates: {
      canonical: `/blog/category/${categorySlug}`,
    },
  };
}

export async function generateStaticParams() {
  return categories
    .filter((category) => category !== 'All Posts')
    .map((category) => ({ category: categoryToSlug(category) }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categoryName = slugToCategory(categorySlug);

  if (!categoryName || categoryName === 'All Posts') {
    notFound();
  }

  let posts: UIBlogPost[] = [];

  try {
    const firestorePosts = await getCachedPostsByCategory(categoryName, 30);
    posts = firestorePosts.map(mapFirestoreToUI);
  } catch (error) {
    console.error('Error loading category posts from Firestore:', error);
    // Fallback to static data if Firestore fails
    try {
      posts = blogPosts.filter((post) => post.category === categoryName);
    } catch (fallbackError) {
      console.error('Error loading fallback posts:', fallbackError);
      posts = [];
    }
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-background py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">{categoryName}</h1>
          <p className="text-muted-foreground">There are no published stories in this category yet.</p>
          <Link href="/blog" className="mt-8 inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-colors">
            Back to blog overview
          </Link>
        </div>
      </div>
    );
  }

  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-primary font-semibold mb-3">{categoryName}</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Only {categoryName} intelligence</h1>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl">This page shows every published post inside the {categoryName} stream so you can stay focused on the topic you selected.</p>
        </div>

        {featuredPost && (
          <div className="group relative mb-10 overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_24px_64px_-32px_rgba(15,23,42,0.18)]">
            <div className="relative h-[360px] sm:h-[420px]">
              <ImageWithFallback
                src={featuredPost.featuredImage ?? ''}
                alt={featuredPost.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <div className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/90 mb-3">{featuredPost.category}</div>
              <h2 className="text-3xl font-bold leading-tight mb-4">{featuredPost.title}</h2>
              <p className="max-w-2xl text-sm text-white/80">{featuredPost.excerpt}</p>
              <Link href={`/blog/${featuredPost.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5">
                Read full story
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <BlogCard key={post.id || post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

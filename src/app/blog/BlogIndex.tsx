"use client";
import { FeaturedCarousel } from './FeaturedCarousel';
import { useState, useMemo, useEffect } from 'react';
import { ReadersChoice } from './ReadersChoice';
import { CategorySection } from './CategorySection';
import { CategoryFilter } from './CategoryFilter';
import { NewsletterCTA } from './NewsletterCTA';
import { AdPlaceholder } from './AdPlaceholder';
import { Button } from '@/components/ui/button';
import { PenSquare } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { getPublishedPosts, getFeaturedPosts, BlogPost as FirestoreBlogPost } from '@/lib/blog-firestore-service';
import Link from 'next/link';

interface BlogIndexProps {
  initialPosts?: BlogPost[];
}

// Helper function to convert Firestore post to UI BlogPost
function mapFirestorePostToUIPost(firestorePost: FirestoreBlogPost): BlogPost {
  // Handle Timestamp or Date conversion
  const getDateString = (dateField: Date | FirestoreBlogPost['publishedAt']): string => {
    if (!dateField) return new Date().toISOString();
    if (dateField instanceof Date) return dateField.toISOString();
    // Handle non-Date object (timestamp, etc.) - convert to string first
    return new Date(String(dateField)).toISOString();
  };

  console.log('Mapping Firestore post:', {
    id: firestorePost.id,
    authorId: firestorePost.authorId,
    authorName: firestorePost.authorName,
    authorAvatar: firestorePost.authorAvatar
  });

  const mappedPost = {
    id: firestorePost.id,
    slug: firestorePost.slug,
    title: firestorePost.title,
    excerpt: firestorePost.metaDescription || firestorePost.content.substring(0, 160),
    content: firestorePost.content,
    publishedAt: getDateString(firestorePost.publishedAt),
    updatedAt: firestorePost.updatedAt ? getDateString(firestorePost.updatedAt) : undefined,
    readingTime: '5 min read', // You can calculate this based on content length
    tags: firestorePost.tags,
    featuredImage: firestorePost.featuredImage || '/images/placeholder-blog.svg',
    author: {
      name: firestorePost.authorName || firestorePost.authorEmail?.split('@')[0] || 'Anonymous',
      avatarUrl: firestorePost.authorAvatar || '/images/default-avatar.svg',
      avatar: firestorePost.authorAvatar || '/images/default-avatar.svg'
    },
    authorId: firestorePost.authorId,
    category: firestorePost.category,
    isFeatured: false // You can add this field to Firestore if needed
  };

  console.log('Mapped post:', mappedPost);
  return mappedPost;
}

export function BlogIndex({ initialPosts = [] }: BlogIndexProps) {
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts from Firestore on mount
  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const [allPosts, featured] = await Promise.all([
          getPublishedPosts(),
          getFeaturedPosts(5)
        ]);

        const mappedPosts = allPosts.map(mapFirestorePostToUIPost);
        const mappedFeatured = featured.map(mapFirestorePostToUIPost);

        setPosts(mappedPosts);
        setFeaturedPosts(mappedFeatured);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Filter posts based on active category
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All Posts') {
      return posts;
    }
    return posts.filter(post => post.category === activeCategory);
  }, [activeCategory, posts]);

  // Group posts by category
  const postsByCategory = useMemo(() => {
    const grouped: Record<string, BlogPost[]> = {};
    filteredPosts.forEach(post => {
      const category = post.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(post);
    });
    return grouped;
  }, [filteredPosts]);

  const categories = useMemo(() => Object.keys(postsByCategory), [postsByCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 py-8">
        <div className="container mx-auto px-4">
          {/* <CustomBreadcrumb className="mb-6" /> */}
          <div className="text-center relative">
            {/* <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trader <span className="text-cyan-400">Pulse</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional trading insights and market analysis for time-constrained traders seeking actionable intelligence.
            </p>
             */}
            <div className="absolute right-0 top-0 mt-12">
              <Link href="/create-post">
                <Button className="px-5 py-4 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 group">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Posts Carousel */}
      <section className="py-12 mt-10">
        <div className="container mx-auto px-4">
          <FeaturedCarousel posts={featuredPosts} isLoading={isLoading} />
        </div>
      </section>

      {/* Leaderboard Ad */}
      <section className="py-6">
        <div className="container mx-auto px-4 flex justify-center">
          <AdPlaceholder type="leaderboard" />
        </div>
      </section>

      {/* Category Filter */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1">
            {isLoading ? (
              <div className="space-y-12">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CategorySection key={index} category="" posts={[]} isLeft={index % 2 === 0} isLoading={true} />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-xl text-gray-400 mb-4">No posts published yet</p>
                  <Link href="/create-post">
                    <Button className="bg-violet-600 text-white hover:bg-violet-700">
                      <PenSquare className="mr-2 h-4 w-4" />
                      Create First Post
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-12">
                  {categories.map((category, index) => (
                    <CategorySection
                      key={category}
                      category={category}
                      posts={postsByCategory[category]}
                      isLeft={index % 2 === 0}
                      isLoading={false}
                    />
                  ))}
                </div>

                {/* Newsletter CTA */}
                <div className="mt-12">
                  <NewsletterCTA />
                </div>
              </>
            )}
          </main>

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-80 space-y-8">
            {/* Skyscraper Ad */}
            <div className="sticky top-24">
              <AdPlaceholder type="skyscraper" />
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom Banner Ad */}
      <section className="py-6 border-t border-[#2D3246]">
        <div className="container mx-auto px-4 flex justify-center">
          <AdPlaceholder type="banner" />
        </div>
      </section>

    </div>
  );
}
"use client";
import { HeroSection } from './HeroSection';
import { LatestNewsSection } from './LatestNewsSection';
import { PopularStorySection } from './PopularStorySection';
import { HighlightSection } from './HighlightSection';
import { CategoryNewsSection } from './CategoryNewsSection';
import { NewsTicker } from './NewsTicker';
import { useState, useMemo, useEffect } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { NewsletterCTA } from './NewsletterCTA';
import { BlogCard, BlogCardSkeleton } from './BlogCard';
import { BlogMarketWrap } from './BlogMarketWrap';
import { Button } from '@/components/ui/button';
import { HiPencilSquare, HiSparkles, HiQueueList } from 'react-icons/hi2';
import { BlogPost } from '../../types/blog';
import { BlogPost as FirestoreBlogPost } from '@/lib/blog-firestore-service';
import Link from 'next/link';
import { categories } from '../../data/blogData';
import { motion } from 'motion/react';

interface BlogIndexProps {
  initialPosts?: BlogPost[];
  featuredPosts?: BlogPost[];
}

// Helper function to convert Firestore post to UI BlogPost
function mapFirestorePostToUIPost(firestorePost: FirestoreBlogPost): BlogPost {
  const getDateString = (dateField: Date | FirestoreBlogPost['publishedAt']): string => {
    if (!dateField) return new Date().toISOString();
    if (dateField instanceof Date) return dateField.toISOString();
    return new Date(String(dateField)).toISOString();
  };

  return {
    id: firestorePost.id,
    slug: firestorePost.slug,
    title: firestorePost.title,
    excerpt: firestorePost.metaDescription || firestorePost.content.substring(0, 160),
    content: firestorePost.content,
    publishedAt: getDateString(firestorePost.publishedAt),
    updatedAt: firestorePost.updatedAt ? getDateString(firestorePost.updatedAt) : undefined,
    readingTime: '5 min read',
    tags: firestorePost.tags,
    featuredImage: firestorePost.featuredImage || '/images/placeholder-blog.svg',
    author: {
      name: firestorePost.authorName || firestorePost.authorEmail?.split('@')[0] || 'Anonymous',
      avatarUrl: firestorePost.authorAvatar || '/images/default-avatar.svg',
      avatar: firestorePost.authorAvatar || '/images/default-avatar.svg'
    },
    authorId: firestorePost.authorId,
    category: firestorePost.category,
    isFeatured: false,
    isDraft: firestorePost.isDraft || false
  };
}

import { getCurrentUser } from '@/lib/auth';
import { getUserDrafts } from '@/lib/blog-firestore-service';

export function BlogIndex({ initialPosts = [], featuredPosts: initialFeatured = [] }: BlogIndexProps) {
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [featuredPosts] = useState<BlogPost[]>(initialFeatured);
  const [drafts, setDrafts] = useState<BlogPost[]>([]);
  const [isLoading] = useState(initialPosts.length === 0);

  useEffect(() => {
    async function fetchDrafts() {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const userDrafts = await getUserDrafts(currentUser.uid);
          if (userDrafts && userDrafts.length > 0) {
            const mappedDrafts = userDrafts.map(mapFirestorePostToUIPost);
            setDrafts(mappedDrafts);
          }
        }
      } catch (error) {
        console.error('Error fetching drafts:', error);
      }
    }
    fetchDrafts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All Posts') {
      return [...drafts, ...posts];
    }
    return posts.filter(post => post.category === activeCategory);
  }, [activeCategory, posts, drafts]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const heroPost = useMemo(() => {
    if (activeCategory === 'All Posts') {
      return featuredPosts[0] || posts[0] || null;
    }
    return filteredPosts[0] || null;
  }, [featuredPosts, posts, filteredPosts, activeCategory]);

  const sidebarPosts = useMemo(() => {
    const source = activeCategory === 'All Posts' ? posts : filteredPosts;
    return source.slice(1, 4);
  }, [posts, filteredPosts, activeCategory]);

  const popularPosts = useMemo(() => {
    const source = activeCategory === 'All Posts' ? posts : filteredPosts;
    return [...source]
      .sort((a, b) => {
        const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return tb - ta;
      })
      .slice(0, 5);
  }, [posts, filteredPosts, activeCategory]);

  const highlightPosts = useMemo(() => {
    const source = activeCategory === 'All Posts' ? posts : filteredPosts;
    return source.slice(4, 9);
  }, [posts, filteredPosts, activeCategory]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">


      {/* Hero Section - The Main Headline */}
      <HeroSection
        featuredPost={heroPost}
        sidebarPosts={sidebarPosts}
        isLoading={isLoading}
      />

            {/* Subtle background glow for the whole page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] pointer-events-none" />

      {/* News Ticker - Sticky at top or just below header */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-16 z-30">
        <NewsTicker isLoading={isLoading} />
      </div>

      {/* Market Pulse Section - Quick Stats */}
      <div className="py-6 border-y border-border bg-muted/20">
        <BlogMarketWrap />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between mb-12 border-b border-border pb-8">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4"
            >
              <HiSparkles className="w-4 h-4" />
              Latest Intelligence
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Market <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">News Hub</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Expert analysis, real-time alerts, and deep dives into the global financial pulse.
            </p>
          </div>

          <div className="w-full lg:w-auto flex items-center gap-4">
             <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>

        {!isLoading && filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl text-muted-foreground font-medium">No intelligence reports in this sector.</p>
            <Button
              variant="link"
              onClick={() => setActiveCategory('All Posts')}
              className="mt-4 text-primary font-bold"
            >
              Reset to Main Stream
            </Button>
          </div>
        )}

        {/* Dynamic Layout based on category selection */}
        {activeCategory === 'All Posts' ? (
          <div className="space-y-24">
            <LatestNewsSection posts={filteredPosts.slice(0, 6)} isLoading={isLoading} />
            <PopularStorySection posts={popularPosts} isLoading={isLoading} />
            <HighlightSection posts={highlightPosts} isLoading={isLoading} />
            
            {categories
              .filter(category => category !== 'All Posts')
              .map(category => (
                <CategoryNewsSection
                  key={category}
                  posts={posts}
                  isLoading={isLoading}
                  category={category}
                />
              ))
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id || post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Section with "More Stories" */}
      {(isLoading || (activeCategory === 'All Posts' && filteredPosts.length > 9)) && (
        <section className="py-24 bg-muted/10 border-t border-border mt-32">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <HiQueueList className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Archive Explorer</h2>
              </div>
              
              <Link href="/create-post">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 px-8 shadow-lg shadow-primary/20">
                  <HiPencilSquare className="mr-2 h-5 w-5" />
                  Publish Intelligence
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))
              ) : (
                filteredPosts.slice(9, 21).map((post) => (
                  <BlogCard key={post.id || post.slug} post={post} />
                ))
              )}
            </div>
            
            {!isLoading && filteredPosts.length > 21 && (
              <div className="mt-16 text-center">
                <Button variant="outline" size="lg" className="rounded-xl border-2 px-10">
                  Load More Archive
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      <NewsletterCTA />
    </div>
  );
}

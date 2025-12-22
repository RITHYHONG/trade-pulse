"use client";
import { HeroSection } from './HeroSection';
import { LatestNewsSection } from './LatestNewsSection';
import { PopularStorySection } from './PopularStorySection';
import { HighlightSection } from './HighlightSection';
import { NewsTicker } from './NewsTicker';
import { useState, useMemo, useEffect } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { NewsletterCTA } from './NewsletterCTA';
import { BlogCard } from './BlogCard';
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

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Get posts for different sections
  const heroPost = useMemo(() => featuredPosts[0] || posts[0] || null, [featuredPosts, posts]);
  const sidebarPosts = useMemo(() => posts.slice(1, 4), [posts]);
  const popularPosts = useMemo(() => [...posts].sort(() => Math.random() - 0.5).slice(0, 5), [posts]);
  const highlightPosts = useMemo(() => posts.slice(4, 9), [posts]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <HeroSection 
        featuredPost={heroPost}
        sidebarPosts={sidebarPosts}
        isLoading={isLoading}
      />

      {/* News Ticker */}
      <NewsTicker isLoading={isLoading} />

      {/* Category Filter / Navigation */}
      <CategoryFilter 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />

      {/* Latest News Section */}
      <LatestNewsSection 
        posts={filteredPosts.slice(0, 6)} 
        isLoading={isLoading}
      />

      {/* Popular Story Section */}
      <PopularStorySection 
        posts={popularPosts} 
        isLoading={isLoading}
      />

      {/* Highlight Section */}
      <HighlightSection 
        posts={highlightPosts} 
        isLoading={isLoading}
      />

      {/* More Posts Grid */}
      {filteredPosts.length > 9 && (
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                More Stories
              </h2>
              <Link href="/create-post">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Write a Story
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.slice(9).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <NewsletterCTA />
    </div>
  );
}
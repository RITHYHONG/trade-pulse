"use client";

import { useState, useMemo, useEffect } from 'react';
import { FeaturedCarousel } from './FeaturedCarousel';
import { CategoryFilter } from './CategoryFilter';
import { BlogCard, BlogCardSkeleton } from './BlogCard';
import { NewsletterCTA } from './NewsletterCTA';
import { AdPlaceholder } from './AdPlaceholder';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PenSquare } from 'lucide-react';
import { BlogPost, BlogItem } from '../../types/blog';
import { getPublishedPosts, getFeaturedPosts, BlogPost as FirestoreBlogPost } from '@/lib/blog-firestore-service';
import Link from 'next/link';
import { Footer } from '../(marketing)/components/Footer';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const postsPerPage = 9;

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

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Add native ads every 6th post
  const postsWithAds: BlogItem[] = [];
  for (let i = 0; i < currentPosts.length; i++) {
    postsWithAds.push(currentPosts[i]);
    if ((i + 1) % 6 === 0 && i < currentPosts.length - 1) {
      postsWithAds.push({ type: 'ad', id: `ad-${i}` });
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F1116]">
      {/* Header */}
      <header className="border-b border-[#2D3246] py-8">
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
                <Button className="bg-primary text-black hover:bg-[#00F5FF]/90 flex justify-center items-center">
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
          {/* Main Content Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.from({ length: postsPerPage }).map((_, index) => (
                    <div key={index}>
                      <BlogCardSkeleton />
                    </div>
                  ))}
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-xl text-gray-400 mb-4">No posts published yet</p>
                  <Link href="/create-post">
                    <Button className="bg-[#00F5FF] text-black hover:bg-[#00F5FF]/90">
                      <PenSquare className="mr-2 h-4 w-4" />
                      Create First Post
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                  {postsWithAds.map((item) => {
                    if ('type' in item && item.type === 'ad') {
                      return (
                        <div key={item.id} className="md:col-span-2 lg:col-span-3">
                          <AdPlaceholder type="native" className="mb-6" />
                        </div>
                      );
                    }
                    const post = item as BlogPost;
                    return (
                      <BlogCard 
                        key={post.slug} 
                        post={post} 
                      />
                    );
                  })}
                </div>

                {/* Newsletter CTA */}
                <div className="mb-12">
                  <NewsletterCTA />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-[#2D3246] text-gray-300 hover:text-white disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className={
                            currentPage === page
                              ? "bg-cyan-500 text-black hover:bg-cyan-600"
                              : "border-[#2D3246] text-gray-300 hover:text-white hover:border-cyan-500"
                          }
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-[#2D3246] text-gray-300 hover:text-white disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
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
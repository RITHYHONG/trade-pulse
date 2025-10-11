"use client";

import { useState, useMemo } from 'react';
import { FeaturedCarousel } from './FeaturedCarousel';
import { CategoryFilter } from './CategoryFilter';
import { BlogCard } from './BlogCard';
import { NewsletterCTA } from './NewsletterCTA';
import { AdPlaceholder } from './AdPlaceholder';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PenSquare } from 'lucide-react';
import { BlogPost, BlogItem } from '../../types/blog';
import { blogPosts } from '../../data/blogData';
import Link from 'next/link';
import { CustomBreadcrumb } from '@/components/navigation/Breadcrumb';
import { Footer } from '../(marketing)/components/Footer';

interface BlogIndexProps {
  posts?: BlogPost[];
}

export function BlogIndex({ posts = blogPosts }: BlogIndexProps) {
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Filter posts based on active category
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All Posts') {
      return posts;
    }
    return posts.filter(post => post.category === activeCategory);
  }, [activeCategory, posts]);

  // Get featured posts for carousel
  const featuredPosts = blogPosts.filter(post => post.isFeatured);

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
          <CustomBreadcrumb className="mb-6" />
          <div className="text-center relative">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trader <span className="text-cyan-400">Pulse</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional trading insights and market analysis for time-constrained traders seeking actionable intelligence.
            </p>
            
            <div className="absolute right-0 top-0">
              <Link href="/create-post">
                <Button className="bg-[#00F5FF] text-black hover:bg-[#00F5FF]/90">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Posts Carousel */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <FeaturedCarousel posts={featuredPosts} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
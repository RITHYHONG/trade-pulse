"use client";

import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface LatestNewsSectionProps {
  posts: BlogPost[];
  isLoading?: boolean;
}

// Helper to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function LatestNewsSkeleton() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border">
              <Skeleton className="w-full h-48 rounded-xl mb-4" />
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestNewsCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer h-full">
        {/* Image Container */}
        <div className="relative h-48 md:h-56 overflow-hidden">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Arrow Icon */}
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-primary rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 md:p-6">
          {/* Category and Date */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">
              {post.category}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs">
              {formatRelativeTime(post.publishedAt)}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {post.excerpt}
          </p>
          
          {/* Author */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <ImageWithFallback
                src={post.author?.avatar || post.author?.avatarUrl || ''}
                alt={post.author?.name || 'Author'}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium text-foreground">{post.author?.name}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function LatestNewsSection({ posts, isLoading }: LatestNewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 2;
  
  // Group posts into pages
  const pages = [];
  for (let i = 0; i < posts.length; i += postsPerPage) {
    pages.push(posts.slice(i, i + postsPerPage));
  }
  
  const totalPages = pages.length;

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (isLoading) {
    return <LatestNewsSkeleton />;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Latest News
          </h2>
          
          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                className="w-10 h-10 rounded-full border-border hover:bg-muted hover:border-primary/30"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                className="w-10 h-10 rounded-full border-border hover:bg-muted hover:border-primary/30"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
        
        {/* News Grid with Smooth Slide */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((pagePosts, pageIndex) => (
              <div key={pageIndex} className="flex-shrink-0 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pagePosts.map((post) => (
                    <LatestNewsCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface HeroSectionProps {
  featuredPost: BlogPost | null;
  sidebarPosts: BlogPost[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
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

function HeroSkeleton() {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Title and Search */}
        <div className="text-center mb-10">
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-full" />
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Featured */}
          <div className="lg:col-span-8">
            <Skeleton className="w-full h-[400px] md:h-[480px] rounded-2xl" />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 p-4 bg-card rounded-xl">
                <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Sidebar post card component
function SidebarPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="flex gap-4 p-4 py-6 bg-card hover:bg-muted/50 rounded-xl transition-all duration-300 group cursor-pointer border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 flex-1 h-full">
        {/* Thumbnail */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                {post.category}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </div>
          
          {/* Author */}
          <div className="flex items-center gap-2 mt-2">
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              <ImageWithFallback
                src={post.author?.avatar || post.author?.avatarUrl || ''}
                alt={post.author?.name || 'Author'}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs text-muted-foreground">{post.author?.name}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function HeroSection({ featuredPost, sidebarPosts, isLoading, onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  if (isLoading) {
    return <HeroSkeleton />;
  }

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
          {/* Main Featured Article */}
          {featuredPost && (
            <div className="lg:col-span-8">
              <Link href={`/blog/${featuredPost.slug}`}>
                <article className="relative h-[400px] md:h-[480px] rounded-2xl overflow-hidden group cursor-pointer">
                  {/* Background Image */}
                  <ImageWithFallback
                    src={featuredPost.featuredImage ?? ''}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Arrow Icon */}
                  <div className="absolute bottom-6 right-6 w-12 h-12 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-primary/90 transition-colors">
                      {featuredPost.title}
                    </h2>
                    
                    <p className="text-white/80 text-base md:text-lg mb-4 line-clamp-2 max-w-2xl">
                      {featuredPost.excerpt}
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                        <ImageWithFallback
                          src={featuredPost.author?.avatar || featuredPost.author?.avatarUrl || ''}
                          alt={featuredPost.author?.name || 'Author'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">{featuredPost.author?.name}</span>
                        <span className="text-white/60 text-sm ml-2">• {formatRelativeTime(featuredPost.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          )}
          
          {/* Sidebar Posts */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {sidebarPosts.slice(0, 3).map((post) => (
              <SidebarPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

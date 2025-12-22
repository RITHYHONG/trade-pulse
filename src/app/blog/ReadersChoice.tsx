"use client";

import { useMemo } from 'react';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ReadersChoiceProps {
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

// Skeleton for loading state
function ReadersChoiceSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <Skeleton className="h-7 w-40" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Featured Card Skeleton */}
          <div className="lg:col-span-5 h-[520px] rounded-2xl overflow-hidden bg-slate-800/50">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Right Side Grid Skeleton */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl bg-slate-800/30">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Small card component for the right side grid
function SmallPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="flex gap-4 p-3 rounded-xl bg-white/5 dark:bg-slate-800/30 hover:bg-white/10 dark:hover:bg-slate-700/40 transition-all duration-300 group cursor-pointer border border-transparent hover:border-violet-500/20">
        <div className="flex-1 min-w-0">
          {/* Category and Time */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-violet-500 dark:text-violet-400 text-sm font-medium">
              {post.category}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs">•</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">
              {formatRelativeTime(post.publishedAt)}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-slate-800 dark:text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {post.title}
          </h3>
        </div>

        {/* Thumbnail */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </article>
    </Link>
  );
}

// Large featured card component
function LargeFeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="relative h-full min-h-[520px] rounded-2xl overflow-hidden group cursor-pointer">
        {/* Background Image */}
        <ImageWithFallback
          src={post.featuredImage ?? ''}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Category and Time */}
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-violet-600 text-white border-0 hover:bg-violet-700">
              {post.category}
            </Badge>
            <span className="text-white/60 text-sm">•</span>
            <span className="text-white/60 text-sm">
              {formatRelativeTime(post.publishedAt)}
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-violet-300 transition-colors">
            {post.title}
          </h2>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="text-white/70 text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export function ReadersChoice({ posts, isLoading }: ReadersChoiceProps) {
  // Get featured post (first one) and remaining posts
  const featuredPost = useMemo(() => posts[0] || null, [posts]);
  const gridPosts = useMemo(() => posts.slice(1, 7), [posts]);

  if (isLoading) {
    return <ReadersChoiceSkeleton />;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              READERS&apos; CHOICE
            </h2>
          </div>
          
          <Link 
            href="/blog" 
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors group"
          >
            <span className="text-sm font-medium">View more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Featured Card - Left Side */}
          {featuredPost && (
            <div className="lg:col-span-5">
              <LargeFeaturedCard post={featuredPost} />
            </div>
          )}

          {/* Right Side Grid - 2 columns, 3 rows */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
            {gridPosts.map((post) => (
              <SmallPostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

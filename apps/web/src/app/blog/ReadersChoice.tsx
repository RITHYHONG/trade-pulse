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
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 h-[520px] rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-xl bg-card border border-border">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
                <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
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
      <article className="flex gap-4 p-3 rounded-xl bg-card hover:bg-muted/50 transition-all duration-300 group cursor-pointer border border-border hover:border-primary/20 hover:shadow-lg">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">
              {post.category}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs">
              {formatRelativeTime(post.publishedAt)}
            </span>
          </div>

          <h3 className="text-foreground text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </div>

        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
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
        <ImageWithFallback
          src={post.featuredImage ?? ''}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Arrow Icon */}
        <div className="absolute bottom-6 right-6 w-12 h-12 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12">
          <ArrowRight className="w-5 h-5 text-white" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <Badge className="bg-primary text-white border-0 mb-4">
            {post.category}
          </Badge>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-primary/90 transition-colors">
            {post.title}
          </h2>

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
  const featuredPost = useMemo(() => posts[0] || null, [posts]);
  const gridPosts = useMemo(() => posts.slice(1, 7), [posts]);

  if (isLoading) {
    return <ReadersChoiceSkeleton />;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Readers&apos; Choice
          </h2>

          <Link
            href="/blog"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="text-sm font-medium">View more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {featuredPost && (
            <div className="lg:col-span-5">
              <LargeFeaturedCard post={featuredPost} />
            </div>
          )}

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
            {gridPosts.map((post) => (
              <SmallPostCard key={post.id || post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


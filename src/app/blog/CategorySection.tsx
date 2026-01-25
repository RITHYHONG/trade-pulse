"use client";

import { useMemo } from 'react';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthorProfile } from '@/hooks/use-author-profile';

interface CategorySectionProps {
  category: string;
  posts: BlogPost[];
  isLeft: boolean;
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

function formatViews(count?: number): string {
  if (!count) return '0 views';
  if (count < 1000) return `${count} views`;
  if (count < 1000000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k views`;
  return `${(count / 1000000).toFixed(1)}M views`;
}

// Skeleton for loading state
function CategorySectionSkeleton({ isLeft }: { isLeft: boolean }) {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isLeft ? '' : 'lg:grid-flow-col-dense'}`}>
          <div className={`lg:col-span-5 h-[520px] rounded-2xl overflow-hidden ${isLeft ? '' : 'lg:col-start-8'}`}>
            <Skeleton className="w-full h-full" />
          </div>

          <div className={`lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 ${isLeft ? '' : 'lg:col-start-1 lg:col-span-7'}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
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

// Small card component
function SmallPostCard({ post }: { post: BlogPost }) {
  const fallbackAuthor = useMemo(() => ({
    name: post.author.name,
    avatar: post.author.avatar,
    avatarUrl: post.author.avatarUrl,
    bio: post.author.bio,
    role: post.author.role
  }), [post.author.name, post.author.avatar, post.author.avatarUrl, post.author.bio, post.author.role]);

  const { authorProfile } = useAuthorProfile({
    authorId: post.authorId,
    fallbackAuthor
  });

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="flex flex-col p-4 rounded-xl bg-card hover:bg-muted/50 transition-all duration-300 group cursor-pointer border border-border hover:border-primary/20 hover:shadow-lg h-full">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 min-w-0">
            {/* Category and Time */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary text-xs font-semibold uppercase tracking-wide">
                {post.category}
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-muted-foreground text-xs">
                {formatRelativeTime(post.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-foreground text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </div>

          {/* Thumbnail */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={post.featuredImage ?? ''}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Author and Views */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-border mt-auto">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <ImageWithFallback
                src={authorProfile?.avatar ?? ''}
                alt={authorProfile?.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm text-foreground font-medium">{authorProfile?.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">{formatViews(post.views)}</span>
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

export function CategorySection({ category, posts, isLeft, isLoading }: CategorySectionProps) {
  const featuredPost = useMemo(() => posts[0] || null, [posts]);
  const gridPosts = useMemo(() => posts.slice(1, 7), [posts]);

  if (isLoading) {
    return <CategorySectionSkeleton isLeft={isLeft} />;
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
            {category}
          </h2>

          <Link
            href={`/blog?category=${encodeURIComponent(category)}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <span className="text-sm font-medium">View more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isLeft ? '' : 'lg:grid-flow-col-dense'}`}>
          {featuredPost && (
            <div className={`lg:col-span-5 ${isLeft ? '' : 'lg:col-start-8'}`}>
              <LargeFeaturedCard post={featuredPost} />
            </div>
          )}

          <div className={`lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 content-start ${isLeft ? '' : 'lg:col-start-1 lg:col-span-7'}`}>
            {gridPosts.map((post) => (
              <SmallPostCard key={post.id || post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

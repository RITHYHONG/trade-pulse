"use client";

import { useMemo } from 'react';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Bell } from 'lucide-react';
import useWatchlistStore from '@/stores/watchlistStore';
import Sparkline from '@/components/Sparkline';

interface CategoryNewsSectionProps {
  posts: BlogPost[];
  isLoading?: boolean;
  category?: string;
  compact?: boolean;
}

function CategoryNewsSkeleton() {
  return (
    <section className="py-12 bg-muted/30 dark:bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <Skeleton className="w-full h-[500px] rounded-2xl" />
          </div>

          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <Skeleton className="w-full h-64 rounded-2xl mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-3/5">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Small card for bottom grid
function SmallNewsCard({ post, compact }: { post: BlogPost; compact?: boolean }) {
  const { addToWatchlist, removeFromWatchlist, addAlert, removeAlert, isInWatchlist, hasAlert } = useWatchlistStore();
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-35 overflow-hidden">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); isInWatchlist(post.slug) ? removeFromWatchlist(post.slug) : addToWatchlist(post.slug); }}
              aria-label="toggle watchlist"
              className="w-8 h-8 rounded-lg bg-white/90 dark:bg-black/70 flex items-center justify-center shadow-sm"
            >
              <Heart className={`w-4 h-4 ${isInWatchlist(post.slug) ? 'text-red-500' : 'text-slate-700'}`} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); hasAlert(post.slug) ? removeAlert(post.slug) : addAlert(post.slug); }}
              aria-label="toggle alert"
              className="w-8 h-8 rounded-lg bg-white/90 dark:bg-black/70 flex items-center justify-center shadow-sm"
            >
              <Bell className={`w-4 h-4 ${hasAlert(post.slug) ? 'text-yellow-500' : 'text-slate-700'}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`p-4 ${compact ? 'py-3' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {post.title}
            </h4>
            {/* Primary asset badge */}
            {post.primaryAsset && (
              <Badge variant="outline" className="text-xs h-fit self-start">{post.primaryAsset}</Badge>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
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

            {/* Sparkline */}
            <div className="hidden md:block">
              <Sparkline data={(post as any)._sparkline || []} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Featured large card (left side)
function FeaturedNewsCard({ post, compact }: { post: BlogPost; compact?: boolean }) {
  const { addToWatchlist, removeFromWatchlist, addAlert, removeAlert, isInWatchlist, hasAlert } = useWatchlistStore();
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="relative h-full min-h-[500px] rounded-2xl overflow-hidden group cursor-pointer">
        {/* Background Image */}
        <ImageWithFallback
          src={post.featuredImage ?? ''}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Quick actions */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); isInWatchlist(post.slug) ? removeFromWatchlist(post.slug) : addToWatchlist(post.slug); }}
            aria-label="toggle watchlist"
            className="w-10 h-10 rounded-lg bg-white/90 dark:bg-black/60 flex items-center justify-center shadow"
          >
            <Heart className={`w-5 h-5 ${isInWatchlist(post.slug) ? 'text-red-500' : 'text-slate-700'}`} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); hasAlert(post.slug) ? removeAlert(post.slug) : addAlert(post.slug); }}
            aria-label="toggle alert"
            className="w-10 h-10 rounded-lg bg-white/90 dark:bg-black/60 flex items-center justify-center shadow"
          >
            <Bell className={`w-5 h-5 ${hasAlert(post.slug) ? 'text-yellow-400' : 'text-slate-700'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Category */}
          <Badge className="bg-primary text-white border-0 mb-4">
            {post.category}
          </Badge>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-primary/90 transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-white/70 text-sm mb-4 line-clamp-2 max-w-md">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                <ImageWithFallback
                  src={post.author?.avatar || post.author?.avatarUrl || ''}
                  alt={post.author?.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-white font-medium text-sm">{post.author?.name}</span>
            </div>

            {/* Small sparkline */}
            <div className="hidden md:block">
              <Sparkline data={(post as any)._sparkline || []} stroke="#fff" height={28} width={96} />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Main featured card (right side top)
function MainNewsCard({ post, compact }: { post: BlogPost; compact?: boolean }) {
  const { addToWatchlist, removeFromWatchlist, addAlert, removeAlert, isInWatchlist, hasAlert } = useWatchlistStore();
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-48 md:h-64 overflow-hidden">
            <ImageWithFallback
              src={post.featuredImage ?? ''}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Quick actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); isInWatchlist(post.slug) ? removeFromWatchlist(post.slug) : addToWatchlist(post.slug); }}
                aria-label="toggle watchlist"
                className="w-9 h-9 rounded-lg bg-white/95 dark:bg-black/60 flex items-center justify-center shadow"
              >
                <Heart className={`w-4 h-4 ${isInWatchlist(post.slug) ? 'text-red-500' : 'text-slate-700'}`} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); hasAlert(post.slug) ? removeAlert(post.slug) : addAlert(post.slug); }}
                aria-label="toggle alert"
                className="w-9 h-9 rounded-lg bg-white/95 dark:bg-black/60 flex items-center justify-center shadow"
              >
                <Bell className={`w-4 h-4 ${hasAlert(post.slug) ? 'text-yellow-400' : 'text-slate-700'}`} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col justify-between">
            {/* Category Badge */}
            <div>
              <Badge variant="outline" className="w-fit mb-3 border-primary/30 text-primary text-xs">
                {post.category}
              </Badge>

              {/* Title */}
              <h3 className="text-xl font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            </div>

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
        </div>
      </article>
    </Link>
  );
}

export function CategoryNewsSection({ posts, isLoading, category = 'News' }: CategoryNewsSectionProps) {
  // Filter posts by category, or use all posts if no category matches
  const categoryPosts = useMemo(() => {
    return posts.filter(post => post.category === category);
  }, [posts, category]);

  const featuredPost = useMemo(() => categoryPosts[0] || null, [categoryPosts]);
  const mainPost = useMemo(() => categoryPosts[1] || null, [categoryPosts]);
  const gridPosts = useMemo(() => categoryPosts.slice(2, 5), [categoryPosts]);

  if (isLoading) {
    return <CategoryNewsSkeleton />;
  }

  if (categoryPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30 dark:bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {category} News
          </h2>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            See more {category.toLowerCase()}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left - Large Featured Card */}
          {featuredPost && (
            <div className="lg:col-span-5">
              <FeaturedNewsCard post={featuredPost} />
            </div>
          )}

          {/* Right - Main + Grid */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            {/* Main News Card */}
            {mainPost && (
              <MainNewsCard post={mainPost} />
            )}

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-3/5">
              {gridPosts.map((post) => (
                <SmallNewsCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useMemo } from 'react';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { HiArrowRight, HiFire, HiClock } from 'react-icons/hi2';
import { Star, Bell } from 'lucide-react';
import Sparkline from '@/components/Sparkline';
import useWatchlistStore from '@/stores/watchlistStore';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'motion/react';

interface PopularStorySectionProps {
  posts: BlogPost[];
  isLoading?: boolean;
  compact?: boolean;
}

function PopularStorySkeleton() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <Skeleton className="h-10 w-48 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <Skeleton className="w-full h-[600px] rounded-[2.5rem]" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="w-full h-72 rounded-[2.5rem]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SmallStoryCard({ post, compact }: { post: BlogPost; compact?: boolean }) {
  const addToWatchlist = useWatchlistStore(state => state.addToWatchlist);
  const setAlert = useWatchlistStore(state => state.addAlert);

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article 
        whileHover={{ y: -5 }}
        className={`bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer h-full flex flex-col shadow-lg shadow-black/5 ${compact ? 'p-3' : ''}`}
      >
        <div className="relative h-32 overflow-hidden">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-primary text-xs font-semibold uppercase tracking-wide">{post.category}</span>
                {post.primaryAsset && (
                  <span className="text-xs px-2 py-0.5 bg-muted/20 rounded-full">{post.primaryAsset}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.preventDefault(); addToWatchlist(post.slug); }} aria-label="Add to watchlist" className="p-2 rounded-md hover:bg-muted">
                    <Star className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); setAlert(post.slug); }} aria-label="Set alert" className="p-2 rounded-md hover:bg-muted">
                    <Bell className="w-4 h-4" />
                  </button>
              </div>
            </div>

            <h4 className="text-xs font-bold text-foreground leading-tight line-clamp-2 mb-4 group-hover:text-primary transition-colors uppercase tracking-tight">
              {post.title}
            </h4>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <div className="relative w-5 h-5 rounded-full overflow-hidden border border-primary/20">
              <ImageWithFallback
                src={post.author?.avatar || post.author?.avatarUrl || ''}
                alt={post.author?.name || 'Author'}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-bold">{post.author?.name}</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function FeaturedStoryCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="relative h-full min-h-[550px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl">
        <ImageWithFallback
          src={post.featuredImage ?? ''}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
        
        <div className="absolute top-6 left-6">
          <Badge className="bg-primary/90 text-white border-0 px-4 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            Trending Story
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-white/70 text-sm mb-6 line-clamp-2 max-w-md font-medium">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 p-0.5">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <ImageWithFallback
                  src={post.author?.avatar || post.author?.avatarUrl || ''}
                  alt={post.author?.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xs uppercase tracking-tight">{post.author?.name}</span>
              <span className="text-white/50 text-[10px] uppercase tracking-widest">{post.category}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function MainStoryCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article 
        whileHover={{ scale: 1.01 }}
        className="bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-300 group cursor-pointer shadow-xl"
      >
        <div className="grid md:grid-cols-2">
          <div className="relative h-56 md:h-72 overflow-hidden">
            <ImageWithFallback
              src={post.featuredImage ?? ''}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <HiClock className="w-3 h-3" /> 5 MIN READ
                </span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 font-medium">
                {post.excerpt}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/20">
                <ImageWithFallback
                  src={post.author?.avatar || post.author?.avatarUrl || ''}
                  alt={post.author?.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-bold text-foreground uppercase tracking-tight">{post.author?.name}</span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export function PopularStorySection({ posts, isLoading, compact = false }: PopularStorySectionProps) {
  const featuredPost = useMemo(() => posts[0] || null, [posts]);
  const mainPost = useMemo(() => posts[1] || null, [posts]);
  const gridPosts = useMemo(() => posts.slice(2, 5), [posts]);

  if (isLoading) return <PopularStorySkeleton />;
  if (posts.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
              <HiFire className="w-4 h-4" />
              Hot Right Now
            </div>
            <h2 className="cus_h1 font-bold tracking-tight">
              Most <span className="text-primary italic">Popular</span> Intelligence
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-3 bg-card backdrop-blur-md border border-border/50 hover:border-primary/50 text-foreground px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-xl transition-all hover:translate-x-1 group"
          >
            Explore News Stream
            <HiArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {featuredPost && (
            <div className="lg:col-span-5">
              <FeaturedStoryCard post={featuredPost} />
            </div>
          )}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
            {mainPost && <MainStoryCard post={mainPost} />}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
              {gridPosts.map((post) => (
                <SmallStoryCard key={post.id || post.slug} post={post} compact={compact} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

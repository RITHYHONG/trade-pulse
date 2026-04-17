"use client";

import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { HiArrowRight, HiChevronLeft, HiChevronRight, HiNewspaper } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useRef } from 'react';
import { formatRelativeTime } from '@/lib/dateUtils';
import { motion, AnimatePresence } from 'motion/react';

interface LatestNewsSectionProps {
  posts: BlogPost[];
  isLoading?: boolean;
  compact?: boolean;
}

function LatestNewsSkeleton() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <Skeleton className="h-10 w-48 rounded-full" />
          <div className="flex gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="w-12 h-12 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card/50 rounded-3xl p-8 border border-border">
              <Skeleton className="w-full h-64 rounded-2xl mb-6" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-8 w-3/4 mb-6" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestNewsCard({ post, compact }: { post: BlogPost; compact?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article 
        whileHover={{ y: -4 }}
        className={`bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 group cursor-pointer h-full flex flex-col shadow-2xl shadow-primary/5 ${compact ? 'p-4' : ''}`}
      >
        <div className="relative h-64 md:h-72 overflow-hidden">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className={`object-cover transition-transform duration-1000 group-hover:scale-105 ${compact ? 'h-40 md:h-48' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 shadow-xl shadow-primary/20">
            <HiArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="p-8 md:p-10 flex-grow flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              {formatRelativeTime(post.publishedAt)}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors tracking-tight">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-base line-clamp-2 mb-8 flex-grow leading-relaxed font-medium">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 pt-6 border-t border-border/50">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-primary/5">
                <ImageWithFallback
                  src={post.author?.avatar || post.author?.avatarUrl || ''}
                  alt={post.author?.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground uppercase tracking-tight">{post.author?.name}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Market Analyst</span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export function LatestNewsSection({ posts, isLoading, compact = false }: LatestNewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 2;

  const pages = [];
  for (let i = 0; i < posts.length; i += postsPerPage) {
    pages.push(posts.slice(i, i + postsPerPage));
  }

  const totalPages = pages.length;

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoPlay = true;
  const autoPlayInterval = 6000; // ms

  // Helper to clear existing timer
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current as ReturnType<typeof setInterval>);
      timerRef.current = null;
    }
  };

  // Start autoplay timer (respects hover and totalPages)
  const startTimer = () => {
    clearTimer();
    if (!autoPlay || totalPages <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, autoPlayInterval);
  };

  // Reset timer after manual interaction
  const resetTimer = () => {
    clearTimer();
    // restart after a short tick to avoid immediate change
    setTimeout(() => startTimer(), 50);
  };

  // Manage autoplay lifecycle
  useEffect(() => {
    if (!autoPlay || totalPages <= 1) return;
    if (!isHovered) startTimer();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, totalPages, isHovered]);

  if (isLoading) return <LatestNewsSkeleton />;
  if (posts.length === 0) return null;

  return (
    <section
      className="py-24 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-12 px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HiNewspaper className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Latest <span className="text-primary italic">Intelligence</span>
            </h2>
          </div>

          {totalPages > 1 && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  prevPage();
                  resetTimer();
                }}
                className="w-12 h-12 rounded-full border-2 border-border hover:bg-muted hover:border-primary/30 transition-all"
              >
                <HiChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  nextPage();
                  resetTimer();
                }}
                className="w-12 h-12 rounded-full border-2 border-border hover:bg-muted hover:border-primary/30 transition-all"
              >
                <HiChevronRight className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {pages[currentPage].map((post) => (
                <LatestNewsCard key={post.id || post.slug} post={post} compact={compact} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Page Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i);
                  resetTimer();
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentPage === i ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/40"
                 }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

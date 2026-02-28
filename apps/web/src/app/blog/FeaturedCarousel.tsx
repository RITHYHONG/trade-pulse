"use client";

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { useAuthorProfile } from '@/hooks/use-author-profile';
import { Skeleton } from '@/components/ui/skeleton';
interface FeaturedCarouselProps {
  posts: BlogPost[];
  isLoading?: boolean;
}

function FeaturedCarouselSkeleton() {
  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-muted">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        {/* Title Skeleton */}
        <div className="mb-4 space-y-3">
          <Skeleton className="h-8 w-3/4 rounded-md" />
          <Skeleton className="h-8 w-1/2 rounded-md" />
        </div>

        {/* Author Info Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
      </div>

      {/* Dots Skeleton */}
      <div className="absolute bottom-4 right-8 flex gap-2">
        {[...Array(3)].map((_, index) => (
          <Skeleton
            key={index}
            className="w-3 h-3 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

export function FeaturedCarousel({ posts, isLoading }: FeaturedCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reset currentSlide if it's out of bounds when posts change
  useEffect(() => {
    if (currentSlide >= posts.length && posts.length > 0) {
      setCurrentSlide(0);
    }
  }, [posts.length, currentSlide]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (posts.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [posts.length]);

  // Get current post based on slide
  const currentPost = useMemo(() => {
    return posts.length > 0 && currentSlide < posts.length ? posts[currentSlide] : null;
  }, [posts, currentSlide]);

  const fallbackAuthor = useMemo(() => ({
    name: currentPost?.author?.name || 'Anonymous',
    avatar: currentPost?.author?.avatar || '/images/default-avatar.svg',
    avatarUrl: currentPost?.author?.avatarUrl,
    bio: currentPost?.author?.bio,
    role: currentPost?.author?.role
  }), [currentPost?.author?.name, currentPost?.author?.avatar, currentPost?.author?.avatarUrl, currentPost?.author?.bio, currentPost?.author?.role]);

  // Use the optimized author profile hook
  const { authorProfile } = useAuthorProfile({
    authorId: currentPost?.authorId,
    fallbackAuthor
  });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % posts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
  return <FeaturedCarouselSkeleton />;
  }

  if (posts.length === 0 || !currentPost) return null;

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden group">
      {/* Carousel Images */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={currentPost.featuredImage || '/images/placeholder-blog.svg'}
            alt={currentPost.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Arrow Icon */}
          <div className="absolute bottom-8 right-8 w-14 h-14 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {/* Category Badge */}
            <Badge className="mb-4 bg-primary text-white border-0">
              {currentPost.category}
            </Badge>
            
            {/* Title and Excerpt */}
            <Link href={`/blog/${currentPost.slug}`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight cursor-pointer hover:text-primary/90 transition-colors max-w-3xl">
                {currentPost.title}
              </h2>
            </Link>
            <p className="text-white/80 text-base md:text-lg mb-6 max-w-2xl leading-relaxed line-clamp-2">
              {currentPost.excerpt}
            </p>
            
            {/* Author Info */}
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
                <ImageWithFallback
                  src={authorProfile?.avatar ?? ''}
                  alt={authorProfile?.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-white">
                <div className="font-medium">{authorProfile?.name}</div>
                <div className="text-sm text-white/60">{currentPost.readingTime || currentPost.readTime}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 right-8 flex gap-2">
        {posts.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary shadow-lg shadow-primary/30' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
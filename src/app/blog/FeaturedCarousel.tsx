"use client";

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
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
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gray-800/50">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-800/30 to-transparent" />
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
            className="object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {/* Featured Badge */}
            <div className="mb-4">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 backdrop-blur-sm">
                <Star className="w-4 h-4 mr-1" />
                Featured
              </Badge>
            </div>
            
            {/* Category Badge */}
            <Badge variant="secondary" className="mb-4 bg-blue-600 text-white border-0">
              {currentPost.category}
            </Badge>
            
            {/* Title and Excerpt */}
            <Link href={`/blog/${currentPost.slug}`}>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight cursor-pointer hover:text-cyan-300 transition-colors">
                {currentPost.title}
              </h2>
            </Link>
            <p className="text-gray-200 text-lg mb-6 max-w-2xl leading-relaxed">
              {currentPost.excerpt}
            </p>
            
            {/* Author Info */}
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={authorProfile?.avatar ?? ''}
                alt={authorProfile?.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="text-white">
                <div className="font-medium">{authorProfile?.name}</div>
                <div className="text-sm text-gray-300">{currentPost.readingTime || currentPost.readTime}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
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
                ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
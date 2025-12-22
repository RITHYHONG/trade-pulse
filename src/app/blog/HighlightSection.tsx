"use client";

import { useMemo } from 'react';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface HighlightSectionProps {
  posts: BlogPost[];
  isLoading?: boolean;
}

function HighlightSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
        
        {/* Main Highlight */}
        <Skeleton className="w-full h-[400px] rounded-2xl mb-6" />
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightGridCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
        {/* Image */}
        <div className="relative h-36 overflow-hidden">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Arrow Icon */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h4>
          
          {/* Author */}
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
        </div>
      </article>
    </Link>
  );
}

export function HighlightSection({ posts, isLoading }: HighlightSectionProps) {
  const mainPost = useMemo(() => posts[0] || null, [posts]);
  const gridPosts = useMemo(() => posts.slice(1, 5), [posts]);

  if (isLoading) {
    return <HighlightSkeleton />;
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
            Highlight
          </h2>
          
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            Grab it for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Main Highlight */}
        {mainPost && (
          <Link href={`/blog/${mainPost.slug}`}>
            <article className="relative w-full h-[350px] md:h-[400px] rounded-2xl overflow-hidden group cursor-pointer mb-6">
              {/* Background Image */}
              <ImageWithFallback
                src={mainPost.featuredImage ?? ''}
                alt={mainPost.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Arrow Icon */}
              <div className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 max-w-3xl">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-primary/90 transition-colors">
                  {mainPost.title}
                </h2>
                
                {/* Excerpt */}
                <p className="text-white/70 text-sm md:text-base line-clamp-3 mb-4 max-w-2xl">
                  {mainPost.excerpt}
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                    <ImageWithFallback
                      src={mainPost.author?.avatar || mainPost.author?.avatarUrl || ''}
                      alt={mainPost.author?.name || 'Author'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-white font-medium text-sm">{mainPost.author?.name}, Staff Writer</span>
                </div>
              </div>
            </article>
          </Link>
        )}
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gridPosts.map((post) => (
            <HighlightGridCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

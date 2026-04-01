"use client";

import { Badge } from '@/components/ui/badge';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/dateUtils';

interface BlogCardProps {
  post: BlogPost;
  compact?: boolean;
}

export function BlogCard({ post, compact = false }: BlogCardProps) {

  return (
    <Link href={`/blog/${post.slug}`}>
      <article
        className={`flex gap-4 ${compact ? 'p-3' : 'p-4'} rounded-xl bg-card border border-border cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 group h-full`}
      >
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Category and Time */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary text-xs font-semibold uppercase tracking-wide">
              {post.category}
            </span>
            {/* Primary asset badge (for traders) */}
            {post.primaryAsset && (
              <Badge className="text-xs px-2 py-0.5 ml-1 bg-muted/30 text-foreground border-0">{post.primaryAsset}</Badge>
            )}
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs">
              {formatRelativeTime(post.publishedAt)}
            </span>

            {/* Confidence level */}
            {typeof post.confidenceLevel === 'number' && (
              <span className="ml-2">
                <Badge className="text-[11px] px-2 py-0.5 bg-primary/10 text-primary border-0">{Math.round(post.confidenceLevel)}%</Badge>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {post.title}
          </h3>

          {/* Excerpt - Optional for larger cards */}
          {!compact && (
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed hidden sm:block">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Thumbnail */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Arrow Icon on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Featured Badge */}
          {post.isFeatured && (
            <div className="absolute top-1.5 right-1.5">
              <Badge className="bg-primary text-white text-[0.7rem] px-1.5 py-0.5 border-0">
                Featured
              </Badge>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export function BlogCardSkeleton() {
  return (
    <article className="flex gap-4 p-4 rounded-xl bg-card border border-border h-full">
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <SkeletonText className="h-4 w-24" />
          <SkeletonText className="h-3 w-16" />
        </div>
        <SkeletonText className="h-5 w-full mb-2" />
        <SkeletonText className="h-5 w-3/4 mb-2" />
        <SkeletonText className="h-4 w-full hidden sm:block" />
      </div>
      <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl flex-shrink-0" />
    </article>
  );
}
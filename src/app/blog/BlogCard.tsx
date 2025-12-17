"use client";

import { Badge } from '@/components/ui/badge';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

interface BlogCardProps {
  post: BlogPost;
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

export function BlogCard({ post }: BlogCardProps) {

  return (
    <Link href={`/blog/${post.slug}`}>
      <article 
        className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:border-violet-500/30 group h-full"
      >
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Category and Time */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-violet-600 dark:text-violet-400 text-sm font-medium">
              {post.category}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs">•</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">
              {formatRelativeTime(post.publishedAt)}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-2">
            {post.title}
          </h3>
          
          {/* Excerpt - Optional for larger cards */}
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed hidden sm:block">
            {post.excerpt}
          </p>
        </div>

        {/* Thumbnail */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Featured Badge */}
          {post.isFeatured && (
            <div className="absolute top-1.5 right-1.5">
              <Badge className="bg-violet-500/90 text-white text-[10px] px-1.5 py-0.5 border-0">
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
    <article className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 h-full">
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <SkeletonText className="h-4 w-24" />
          <SkeletonText className="h-3 w-16" />
        </div>
        <SkeletonText className="h-5 w-full mb-2" />
        <SkeletonText className="h-5 w-3/4 mb-2" />
        <SkeletonText className="h-4 w-full hidden sm:block" />
      </div>
      <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg flex-shrink-0" />
    </article>
  );
}
"use client";

import { Badge } from '@/components/ui/badge';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { useAuthorProfile } from '@/hooks/use-author-profile';
import { useMemo } from 'react';
import { Skeleton, SkeletonText, SkeletonImage } from '@/components/ui/skeleton';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
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
      <article 
        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-[#2D3246] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 group flex flex-col h-full"
      >
        {/* Image Header */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        
        {/* Category Overlay */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className="bg-primary text-primary-foreground border-0 backdrop-blur-sm"
          >
            {post.category}
          </Badge>
        </div>
        
        {/* Featured Badge */}
        {post.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 backdrop-blur-sm">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 leading-tight transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-slate-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
        
        {/* Footer: Author/Meta + Tags - push to bottom */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={authorProfile.avatar ?? ''}
                alt={authorProfile.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">{authorProfile.name}</div>
                <div className="text-xs text-slate-500 dark:text-gray-500">{post.publishDate}</div>
              </div>
            </div>

            <div className="text-sm text-slate-500 dark:text-gray-500">
              {post.readTime}
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-4 pt-4 border-t border-[#2D3246]">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs text-slate-600 dark:text-gray-400 border-slate-300 dark:border-[#2D3246] hover:border-cyan-500/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
    </Link>
  );
}

export function BlogCardSkeleton() {
  return (
    <article className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-[#2D3246] rounded-xl overflow-hidden group flex flex-col h-full">
      <div className="relative aspect-[3/2] overflow-hidden">
        <SkeletonImage className="w-full h-full" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <SkeletonText className="h-6 w-3/4 mb-4" />
        <SkeletonText className="h-4 w-full mb-4" />
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div>
              <SkeletonText className="h-4 w-24 mb-2" />
              <SkeletonText className="h-3 w-16" />
            </div>
          </div>
          <SkeletonText className="h-4 w-10" />
        </div>
      </div>
    </article>
  );
}
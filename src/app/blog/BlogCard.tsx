import { Badge } from '@/components/ui/badge';
import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article 
        className="bg-[#1A1D28] border border-[#2D3246] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 group flex flex-col h-full"
      >
        {/* Image Header */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <ImageWithFallback
            src={post.featuredImage}
            alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category Overlay */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className="bg-blue-600 text-white border-0 backdrop-blur-sm"
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
        <h3 className="text-xl font-semibold text-white mb-3 leading-tight group-hover:text-cyan-300 transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
        
        {/* Footer: Author/Meta + Tags - push to bottom */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="text-sm font-medium text-white">{post.author.name}</div>
                <div className="text-xs text-gray-500">{post.publishDate}</div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
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
                  className="text-xs text-gray-400 border-[#2D3246] hover:border-cyan-500/30"
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
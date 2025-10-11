import { ArrowLeft, Share2, Bookmark, ThumbsUp, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost as BlogPostType } from '../../types/blog';
import { blogPosts } from '../../data/blogData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AdPlaceholder } from './AdPlaceholder';
import { NewsletterCTA } from './NewsletterCTA';
import { BlogCard } from './BlogCard';
import Link from 'next/link';
import { CustomBreadcrumb } from '@/components/navigation/Breadcrumb';

interface BlogPostProps {
  post: BlogPostType;
  relatedPosts?: BlogPostType[];
}

export function BlogPost({ post, relatedPosts }: BlogPostProps) {
  const defaultRelatedPosts = relatedPosts || blogPosts
    .filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag))))
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0F1116]">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-[#0F1116]/95 backdrop-blur-sm border-b border-[#2D3246]">
        <div className="container mx-auto px-4 py-4">
          <CustomBreadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: `/blog/${post.slug}` }
            ]} 
            className="mb-3" 
          />
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-[#1A1D28]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Button>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Badge variant="secondary" className="bg-blue-600 text-white border-0 mb-4">
                {post.category}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* Author and Meta Info */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-white">{post.author.name}</div>
                  <div className="text-sm text-gray-400">{post.author.bio}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime}
                </div>
              </div>
            </div>
            
            {/* Featured Image */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <ImageWithFallback
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* First Ad Placement */}
          <div className="mb-8 flex justify-center">
            <AdPlaceholder type="rectangle" />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div className="text-gray-300 leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-3xl font-bold text-white mt-12 mb-6">
                      {paragraph.replace('# ', '')}
                    </h1>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-semibold text-white mt-10 mb-4 border-l-4 border-cyan-500 pl-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-white mt-8 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <div key={index} className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-6 my-6">
                      <h4 className="font-semibold text-cyan-300 mb-2">Key Takeaway</h4>
                      <p className="text-gray-300">{paragraph.replace(/\*\*/g, '')}</p>
                    </div>
                  );
                }
                if (paragraph.includes('- ')) {
                  const items = paragraph.split('\n').filter(item => item.trim().startsWith('- '));
                  return (
                    <ul key={index} className="space-y-2 ml-4">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-300">
                          {item.replace('- ', '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>

          {/* Mid-Article Ad */}
          <div className="my-12 flex justify-center">
            <AdPlaceholder type="banner" />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-[#2D3246]">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-gray-400 border-[#2D3246] hover:border-cyan-500/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Actions */}
            <div className="flex items-center justify-between py-6 border-y border-[#2D3246] mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="border-[#2D3246] text-gray-300 hover:text-white hover:border-cyan-500">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful
                </Button>
                <Button variant="outline" className="border-[#2D3246] text-gray-300 hover:text-white hover:border-cyan-500">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
              </div>
              
              <Button variant="outline" className="border-[#2D3246] text-gray-300 hover:text-white hover:border-cyan-500">
                <Bookmark className="w-4 h-4 mr-2" />
                Save for Later
              </Button>
            </div>

            {/* Author Bio */}
            <div className="bg-[#1A1D28] border border-[#2D3246] rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <ImageWithFallback
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white mb-2">
                    About {post.author.name}
                  </h4>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {post.author.bio}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#2D3246] text-gray-300 hover:text-white">
                      Follow
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#2D3246] text-gray-300 hover:text-white">
                      More Articles
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="mb-12">
              <NewsletterCTA />
            </div>

            {/* Related Posts */}
            {defaultRelatedPosts.length > 0 && (
              <section>
                <h3 className="text-2xl font-semibold text-white mb-8">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {defaultRelatedPosts.map((relatedPost) => (
                    <BlogCard 
                      key={relatedPost.slug} 
                      post={relatedPost} 
                    />
                  ))}
                </div>
              </section>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}
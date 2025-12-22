"use client";
import { Share2, Bookmark, ThumbsUp, Clock, Calendar, TrendingUp, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost as BlogPostType } from '../../types/blog';
import { blogPosts } from '../../data/blogData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { CustomBreadcrumb } from '@/components/navigation/Breadcrumb';
import DOMPurify from 'isomorphic-dompurify';
import { useAuthorProfile } from '@/hooks/use-author-profile';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Lazy load below-the-fold components
const AdPlaceholder = dynamic(() => import('./AdPlaceholder').then(mod => ({ default: mod.AdPlaceholder })), {
  loading: () => <div className="h-24 bg-card/20 animate-pulse rounded-lg" />
});

const NewsletterCTA = dynamic(() => import('./NewsletterCTA').then(mod => ({ default: mod.NewsletterCTA })), {
  loading: () => <div className="h-32 bg-card/20 animate-pulse rounded-lg" />
});

const BlogCard = dynamic(() => import('./BlogCard').then(mod => ({ default: mod.BlogCard })), {
  loading: () => <div className="h-64 bg-card/20 animate-pulse rounded-lg" />
});


interface BlogPostProps {
  post: BlogPostType;
  relatedPosts?: BlogPostType[];
}

import useRecordView from '@/hooks/use-view-count';

export function BlogPost({ post, relatedPosts }: BlogPostProps) {
  // record a view on initial render (client-side only) - uses localStorage TTL to avoid duplicates
  useRecordView(post.id, { ttlHours: 1, requireConsent: false });

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

  const formatViews = (count?: number) => {
    if (!count) return '0 views';
    if (count < 1000) return `${count} views`;
    if (count < 1000000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k views`;
    return `${(count / 1000000).toFixed(1)}M views`;
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">

      </div>

      {/* Hero Section - Clean & Organized */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb - Simplified */}
            <CustomBreadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: post.title, href: `/blog/${post.slug}` }
              ]} 
              className="mb-6" 
            />

            {/* Article Header */}
            <header className="space-y-6">
              {/* Category Badge - Standalone */}
              <div>
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-4 py-1.5 text-sm font-medium shadow-lg shadow-cyan-500/20"
                >
                  {post.category}
                </Badge>
                {/* <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>2.3k views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending</span>
                  </div>
                </div> */}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                {post.title}
              </h1>
              
              {/* Excerpt */}
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
              
              {/* Author and Meta Info - Cleaner Layout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 pb-8 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-0.5 from-cyan-500 to-blue-500 rounded-full opacity-75 blur"></div>
                    <ImageWithFallback
                        src={authorProfile.avatar ?? ''}
                      alt={authorProfile.name}
                      className="relative w-12 h-12 rounded-full ring-2 ring-background"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{authorProfile.name}</div>
                    {/* <div className="text-sm text-muted-foreground">{authorProfile.bio || 'Market Analyst'}</div> */}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{post.readingTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span>{formatViews(post.views)}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Featured Image - Cleaner Style */}
            <div className="relative my-10 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-10 group-hover:opacity-20 blur transition duration-300"></div>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden ring-1 ring-border">
                <ImageWithFallback
                  src={post.featuredImage ?? ''}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          
          {/* First Ad Placement */}
          <div className="mb-12 flex justify-center">
            <AdPlaceholder type="rectangle" />
          </div>

          {/* Article Content - Premium Typography */}
          <article className="prose prose-lg prose-invert max-w-none text-gray-800 dark:text-gray-200">
            {isLikelyHtml(post.content) ? (
              <div
                className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-cyan-400 hover:prose-a:text-cyan-300"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />
            ) : (
              <div className="text-muted-foreground leading-relaxed space-y-8">
                {post.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-4xl font-bold text-foreground mt-16 mb-8 tracking-tight">
                        {paragraph.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="relative text-3xl font-bold text-foreground mt-12 mb-6 pl-6">
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></span>
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-2xl font-semibold text-foreground mt-10 mb-4">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <div key={index} className="relative my-8 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl"></div>
                        <div className="relative border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-cyan-500/20 rounded-lg">
                              <TrendingUp className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-cyan-300 mb-2 text-lg">Key Takeaway</h4>
                              <p className="text-muted-foreground leading-relaxed">{paragraph.replace(/\*\*/g, '')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  if (paragraph.includes('- ')) {
                    const items = paragraph.split('\n').filter(item => item.trim().startsWith('- '));
                    return (
                      <ul key={index} className="space-y-3 ml-6 my-6">
                        {items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-muted-foreground leading-relaxed relative pl-4 before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:bg-cyan-500 before:rounded-full">
                            {item.replace('- ', '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={index} className="text-muted-foreground leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            )}
          </article>

          {/* Mid-Article Ad */}
          <div className="my-16 flex justify-center">
            <AdPlaceholder type="banner" />
          </div>

          {/* Article Footer - Modern Design */}
          <footer className="mt-16 space-y-12">
            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-8 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Topics</h4>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-muted-foreground bg-card/5 border-border hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 px-4 py-1.5"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Engagement Actions - Glassmorphism Style */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border border-border backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    className="border-border bg-card/5 text-muted-foreground hover:text-foreground hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Found this helpful</span>
                    <span className="sm:hidden">Helpful</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-border bg-card/5 text-muted-foreground hover:text-foreground hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-border bg-card/5 text-muted-foreground hover:text-foreground hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Save for Later</span>
                  <span className="sm:hidden">Save</span>
                </Button>
              </div>
            </div>

            {/* Author Bio - Premium Card */}
            <div className="relative overflow-hidden rounded-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-50"></div>
              <div className="relative border border-border backdrop-blur-sm p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300"></div>
                    <ImageWithFallback
                      src={authorProfile.avatar ?? ''}
                      alt={authorProfile.name}
                      className="relative w-20 h-20 rounded-full ring-2 ring-background"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-card-foreground mb-3">
                      About <span className='text-foreground'>{authorProfile.name}</span>
                    </h4>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {authorProfile.bio || 'Experienced market analyst and trading expert, providing insights and strategies to help traders navigate the financial markets.'}
                    </p>
                    <div className="flex gap-3">
                      {/* <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300"
                      >
                        Follow
                      </Button> */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-border bg-card/5 text-muted-foreground hover:text-foreground hover:bg-card/10 transition-all duration-300"
                      >
                        More Articles
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter CTA */}
            <div>
              <NewsletterCTA />
            </div>

            {/* Related Posts - Grid Layout */}
            {defaultRelatedPosts.length > 0 && (
              <section className="pt-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-foreground">Related Articles</h3>
                  <Link
                    href="/blog"
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300 flex items-center gap-1"
                  >
                    View all articles
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
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

function isLikelyHtml(content: string): boolean {
  // quick heuristic: any tag-like structure will trigger HTML rendering
  return /<\s*\w+[^>]*>/.test(content) || /&[a-zA-Z]+;/.test(content);
}
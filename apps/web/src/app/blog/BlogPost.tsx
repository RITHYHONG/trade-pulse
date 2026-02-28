"use client";
import { Share2, Bookmark, ThumbsUp, Clock, Calendar, TrendingUp, ArrowRight, Eye, ShieldCheck, Target, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost as BlogPostType } from '../../types/blog';
import { blogPosts } from '../../data/blogData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { useAuthorProfile } from '@/hooks/use-author-profile';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import './blog-content.css';

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
  useRecordView(post.id!, { ttlHours: 1, requireConsent: false });

  const fallbackAuthor = useMemo(() => ({
    name: post.author.name,
    avatar: post.author.avatar,
    avatarUrl: post.author.avatarUrl,
    bio: post.author.bio,
    role: post.author.role
  }), [post.author.name, post.author.avatar, post.author.avatarUrl, post.author.bio, post.author.role]);

  const { authorProfile } = useAuthorProfile({
    fallbackAuthor,
    authorId: post.authorId
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Badge className="mb-6 bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/30 border-cyan-500/20 dark:border-cyan-500/30 px-4 py-1">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-8 leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border/50 py-6 mb-12">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={authorProfile.avatar ?? ''}
                  alt={authorProfile.name}
                  className="w-10 h-10 rounded-full border border-border"
                />
                <span className="font-medium text-foreground">{authorProfile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime || '5 min'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{formatViews(post.views)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">

          {/* Main Content Side */}
          <div className="flex-1 min-w-0">
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12 ring-1 ring-border shadow-2xl">
              <ImageWithFallback
                src={post.featuredImage ?? ''}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            <article className="blog-content-container">
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />
            </article>

            {/* Engagement */}
            <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
              <div className="flex gap-4">
                <Button variant="ghost" className="gap-2 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                  <span>{post.views ? Math.floor(post.views * 0.1) : 0} Helpful</span>
                </Button>
                <Button variant="ghost" className="gap-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </Button>
              </div>
              <Button variant="ghost">
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Sidebar / Intelligence Panel */}
          <aside className="lg:w-80 space-y-8">
            <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-md sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Market Intelligence
              </h3>

              <div className="space-y-6">
                {/* Sentiment */}
                <div className="space-y-3">
                  <span className="text-sm text-muted-foreground block uppercase tracking-wider font-semibold">Current Sentiment</span>
                  <div className={`flex items-center gap-2 p-3 rounded-xl border ${post.sentiment === 'Bullish' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                    post.sentiment === 'Bearish' ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400' :
                      'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}>
                    <TrendingUp className={`w-5 h-5 ${post.sentiment === 'Bearish' ? 'rotate-180' : ''}`} />
                    <span className="font-bold">{post.sentiment || 'Neutral'}</span>
                  </div>
                </div>

                {/* Confidence */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm uppercase tracking-wider font-semibold">
                    <span className="text-muted-foreground">AI Confidence</span>
                    <span className="text-cyan-600 dark:text-cyan-400">{post.confidenceLevel || 85}%</span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000"
                      style={{ width: `${post.confidenceLevel || 85}%` }}
                    />
                  </div>
                </div>

                {/* Asset Focus */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground block uppercase tracking-wider font-semibold">Asset Focus</span>
                  {post.primaryAsset && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border group hover:border-cyan-500/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center font-bold text-cyan-400 text-xs">
                          {post.primaryAsset}
                        </div>
                        <span className="font-semibold text-foreground">{post.primaryAsset}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30">PRIMARY</Badge>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {post.relatedAssets?.map((asset: string) => (
                      <Badge key={asset} variant="secondary" className="bg-border/50 text-muted-foreground hover:text-foreground">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Time Horizon */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground block uppercase tracking-wider font-semibold">Trading Horizon</span>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span>{post.timeHorizon || 'Short-term'}</span>
                  </div>
                </div>
              </div>

              {/* Verified Intelligence Badge */}
              <div className="mt-8 flex items-center gap-2 text-[10px] text-muted-foreground bg-cyan-500/5 p-3 rounded-lg border border-cyan-500/10">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                SYSTEM VERIFIED ANALYSIS
              </div>
            </div>

            <AdPlaceholder type="rectangle" />
          </aside>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="bg-card/30 border-t border-border py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-foreground">Next Up</h2>
              <Link href="/blog" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from(new Map(defaultRelatedPosts.map(item => [item.slug, item])).values()).map((relatedPost, idx) => (
                <BlogCard key={relatedPost.id || relatedPost.slug || idx} post={relatedPost} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <NewsletterCTA />
        </div>
      </div>
    </div>
  );
}

"use client";
import { Share2, Bookmark, ThumbsUp, Clock, Calendar, TrendingUp, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost as BlogPostType } from '../../types/blog';
import { blogPosts } from '../../data/blogData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { useAuthorProfile } from '@/hooks/use-author-profile';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { ShareButton } from './ShareButton';

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
  useRecordView(post.id, { ttlHours: 1, requireConsent: false });

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

  const [helpfulCount, setHelpfulCount] = useState<number>(post.helpfulCount ?? 0);
  const [helpfulSelected, setHelpfulSelected] = useState<boolean>(false);
  const [helpfulState, setHelpfulState] = useState<'idle' | 'saving'>('idle');

  useEffect(() => {
    const postId = post.id || post.slug;
    if (!postId) return;

    const stored = typeof window !== 'undefined'
      ? window.localStorage.getItem(`post_helpful_feedback_${postId}`)
      : null;

    setHelpfulSelected(stored === 'true');
  }, [post.id, post.slug]);

  const handleHelpfulClick = async () => {
    if (helpfulState !== 'idle') return;
    const postId = post.id || post.slug;
    if (!postId) {
      toast.error('Cannot record feedback for this article.');
      return;
    }

    const nextSelected = !helpfulSelected;
    const delta = nextSelected ? 1 : -1;
    const storageKey = `post_helpful_feedback_${postId}`;
    const previousCount = helpfulCount;
    const previousSelected = helpfulSelected;

    setHelpfulSelected(nextSelected);
    setHelpfulCount(Math.max(0, helpfulCount + delta));
    setHelpfulState('saving');

    if (typeof window !== 'undefined') {
      if (nextSelected) {
        window.localStorage.setItem(storageKey, 'true');
      } else {
        window.localStorage.removeItem(storageKey);
      }
    }

    try {
      const response = await fetch('/api/blog/helpful', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, delta }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to submit feedback');
      }

      setHelpfulCount(typeof data.helpfulCount === 'number' ? data.helpfulCount : helpfulCount);
      toast.success(nextSelected ? 'Marked helpful.' : 'Removed helpful vote.');
    } catch (error) {
      console.error('Helpful feedback error:', error);
      toast.error('Failed to update helpful feedback.');
      setHelpfulSelected(previousSelected);
      setHelpfulCount(previousCount);
      if (typeof window !== 'undefined') {
        if (previousSelected) {
          window.localStorage.setItem(storageKey, 'true');
        } else {
          window.localStorage.removeItem(storageKey);
        }
      }
    } finally {
      setHelpfulState('idle');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">

      </div>

      {/* Hero Section - Redesigned for Impact */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-32 -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 blur-[80px] rounded-full -ml-32 -mb-16 -z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Category / Date Header */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
               <span className="px-5 py-1.5 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{post.readingTime}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>{formatViews(post.views)}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-12">
              {post.title}
            </h1>

            {/* Author Profile Card */}
            <div className="flex justify-between items-center gap-6 p-6 rounded-[2rem] bg-card border border-border/50 shadow-xl shadow-black/5 max-w-full mb-16">
              <div className='flex items-center gap-6'>
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/20">
                <ImageWithFallback
                  src={authorProfile.avatar || ''}
                  fallbackSrc={post.author.avatarUrl || post.author.avatar || '/images/default-avatar.svg'}
                  alt={authorProfile.name}
                  fill
                  className="object-cover"
                />
              </div>


              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">{authorProfile.name}</span>
                {/* <span className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em]">{authorProfile.role || 'Market Analyst'}</span> */}
              </div>
              </div>


              <div className="ml-8 pr-4">
                <ShareButton 
                  title={post.title} 
                  excerpt={post.excerpt}
                />
              </div>
            </div>
            
            {/* Featured Image - High Fidelity */}
            <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-card group">
              <ImageWithFallback
                src={post.featuredImage ?? ''}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]" />
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

          {/* Market Outlook Widget - RECONSTRUCTED FROM IMAGE */}
          {(post.sentiment || post.primaryAsset || post.confidenceLevel || post.timeHorizon) && (
            <div className="mb-24 space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#121212] shadow-2xl">
                {/* Header Section */}
                <div className="p-8 pb-0 flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
                        {post.primaryAsset || "MARKET"}
                      </h2>
                      <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] font-bold text-orange-500 tracking-widest uppercase">
                        Live Forecast
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">
                      {post.category || "Asset Class Trust"}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-2 text-orange-500">
                      <TrendingUp className={`w-5 h-5 ${post.sentiment?.toLowerCase() === 'bearish' ? 'rotate-180' : ''}`} />
                      <span className="text-sm font-black uppercase tracking-widest">
                        {post.sentiment || "NEUTRAL"}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-right">
                      Sentiment Score: 5.2/10
                    </p>
                  </div>
                </div>

                {/* Main Chart Area */}
                <div className="px-8 mt-4 relative h-64 w-full group/chart">
                  <div className="absolute top-4 right-8 z-10">
                    <div className="bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded text-[10px] font-mono text-orange-500">
                      PROJ. $512.40
                    </div>
                  </div>
                  
                  <svg viewBox="0 0 800 200" className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(249,115,22,0.3)]">
                    <defs>
                      <linearGradient id="imageTrendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M0,150 L100,140 L200,160 L300,110 L400,120 L500,80 L600,90 L700,50" 
                      stroke="url(#imageTrendGradient)" 
                      strokeWidth="4" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <circle cx="700" cy="50" r="6" fill="#f97316" className="animate-pulse" />
                  </svg>
                  
                  <div className="absolute bottom-4 left-8 flex items-center justify-between w-[calc(100%-4rem)]">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                      Medium-Term Projection (90D)
                    </span>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/10"></div>
                        <span className="text-[10px] font-bold text-white/20 uppercase">Historical</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-[10px] font-bold text-white/20 uppercase">Predicted</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Stats Bar */}
                <div className="px-8 py-6 border-t border-white/5 bg-white/[0.02] flex flex-wrap items-center justify-between gap-8">
                  <div className="flex-1 min-w-[200px] flex items-center gap-6">
                    <div className="w-full max-w-[240px] space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Model Confidence</span>
                        <span className="text-2xl font-black text-white leading-none">{post.confidenceLevel}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${post.confidenceLevel}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Vol. Risk</span>
                        <span className="text-sm font-black text-white">LOW-MOD</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Alpha Prob.</span>
                        <span className="text-sm font-black text-white">+12.4%</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Signals</span>
                        <span className="text-sm font-black text-white">8 ACTIVE</span>
                     </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="px-8 py-4 border-t border-white/5 bg-[#0a0a0a] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Correlated:</span>
                    <div className="flex gap-2">
                      {["USO", "QQQ", "VIX"].map(ticker => (
                        <span key={ticker} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white/40 border border-white/10 uppercase tracking-widest">
                          {ticker}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:translate-x-1 transition-transform">
                    View Full Analysis <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Detail Analysis Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Immediate Trigger", icon: "⚡", content: "CPI data release scheduled for 08:30 EST may invalidate current bullish trajectory.", color: "text-blue-400" },
                  { title: "Liquidity Alert", icon: "⚠️", content: "Order book depth narrowing in SPY options chain at the $500.00 strike price.", color: "text-orange-400" },
                  { title: "Structural Note", icon: "◇", content: "Consolidation pattern entering its 4th session. Expansion anticipated within 48h.", color: "text-white/40" }
                ].map((card, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-[#121212] border border-white/5 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className={card.color}>{card.icon}</span>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${card.color}`}>
                        {card.title}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white/60 leading-relaxed">
                      {card.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Summary - Key Highlights */}
          {post.excerpt && (
            <div className="mb-32 relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent rounded-full opacity-50"></div>
              
              <div className="pl-12 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500/60">Executive Summary</span>
                </div>

                <p className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight selection:bg-cyan-500 selection:text-black">
                  {post.excerpt}
                </p>

                {/* <div className="flex items-center gap-8 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white/40 ring-1 ring-white/5">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="h-px w-12 bg-border"></div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Validated Insights</span>
                </div> */}
              </div>
            </div>
          )}

          {/* Article Content - Elegant Minimalist / "Notion" Style */}
          <article className="prose prose-lg dark:prose-invert w-full mx-auto md:text-xl lg:text-2xl font-sans selection:bg-cyan-500/20">
            {isLikelyHtml(post.content) ? (
              <div className="prose-custom-html relative space-y-12">
                <style>{`
                  .prose-custom-html {
                    line-height: 1.7;
                    color: var(--foreground);
                    letter-spacing: -0.015em;
                  }
                  .prose-custom-html h1, 
                  .prose-custom-html h2, 
                  .prose-custom-html h3 {
                    color: var(--foreground);
                    font-weight: 800;
                    margin-top: 3.5em;
                    margin-bottom: 1.25em;
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                  }
                  .prose-custom-html h1 { font-size: 3.5em; }
                  .prose-custom-html h2 { font-size: 2.25em; }
                  .prose-custom-html h3 { font-size: 1.5em; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.1em; }
                  
                  .prose-custom-html p {
                    margin-bottom: 2em;
                    opacity: 0.9;
                  }
                  .prose-custom-html a {
                    color: var(--foreground);
                    text-decoration: none;
                    box-shadow: inset 0 -4px 0 var(--cyan-500);
                    transition: all 0.2s ease;
                    font-weight: 600;
                  }
                  .prose-custom-html a:hover {
                    background: var(--cyan-500/10);
                    box-shadow: inset 0 -8px 0 var(--cyan-500);
                  }
                  .prose-custom-html blockquote {
                    position: relative;
                    padding: 2.5rem;
                    margin: 4rem 0;
                    background: var(--white/0.02);
                    border-radius: 2rem;
                    border-left: 4px solid var(--cyan-500);
                    color: var(--foreground);
                    font-size: 1.1em;
                    font-style: italic;
                    line-height: 1.6;
                  }
                  .prose-custom-html blockquote p {
                    margin: 0;
                  }
                  .prose-custom-html ul {
                    list-style-type: none;
                    padding-left: 0;
                    margin-bottom: 3rem;
                  }
                  .prose-custom-html li {
                    position: relative;
                    padding-left: 2rem;
                    margin-bottom: 1rem;
                    opacity: 0.85;
                  }
                  .prose-custom-html li::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0.7em;
                    width: 0.6em;
                    height: 2px;
                    background: var(--cyan-500);
                  }
                  .prose-custom-html img {
                    border-radius: 2.5rem;
                    margin: 4.5rem 0;
                    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5);
                    border: 1px solid var(--white/0.05);
                  }
                `}</style>
                <div
                  className="relative z-10"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            ) : (
              <div className="space-y-12">
                {post.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-5xl md:text-6xl font-black text-foreground mt-24 mb-10 tracking-tighter leading-none">
                        {paragraph.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-3xl md:text-4xl font-extrabold text-foreground mt-20 mb-8 tracking-tight">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-black text-muted-foreground mt-16 mb-4 uppercase tracking-[0.2em]">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  // Regular paragraph with better typography
                  return (
                    <p key={index} className="text-foreground/85 leading-relaxed tracking-tight mb-8">
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
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-[2rem] blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-md">
                {/* <div className="flex items-center gap-4 justify-between"> */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="ghost"
                      onClick={handleHelpfulClick}
                      disabled={helpfulState !== 'idle'}
                      aria-pressed={helpfulSelected}
                      className={`h-12 px-6 rounded-xl border border-white/10 transition-all duration-300 ${helpfulSelected ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20 hover:bg-emerald-500/20' : 'bg-white/5 text-white/70 hover:text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/20'} disabled:cursor-not-allowed disabled:text-white/40 disabled:border-white/5`}
                    >
                      <ThumbsUp className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                      <span className="font-bold tracking-tight">
                        {helpfulSelected ? 'Helpful' : 'Helpful Insight'}
                      </span>
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">
                      {helpfulCount} {helpfulCount === 1 ? 'helpful vote' : 'helpful votes'}
                    </span>
                  </div>
                  <ShareButton 
                    variant="ghost"
                    size="default"
                    className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/20 transition-all duration-300"
                    showText={true}
                    title={post.title}
                    excerpt={post.excerpt}
                  />
                {/* </div> */}

                {/* <div className="flex items-center gap-3">
                  <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
                  <Button
                    variant="ghost"
                    className="h-12 w-12 sm:w-auto sm:px-6 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/20 transition-all duration-300"
                  >
                    <Bookmark className="w-5 h-5 sm:mr-3" />
                    <span className="hidden sm:inline font-bold tracking-tight">Save Reference</span>
                  </Button>
                </div> */}
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
                      src={authorProfile.avatar || ''}
                      fallbackSrc={post.author.avatarUrl || post.author.avatar || '/images/default-avatar.svg'}
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
                    className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-300 flex items-center gap-1"
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
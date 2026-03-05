"use client";
import { Share2, Bookmark, ThumbsUp, Clock, Calendar, TrendingUp, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost as BlogPostType } from '../../types/blog';
import { blogPosts } from '../../data/blogData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
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

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">

      </div>

      {/* Hero Section - Clean & Organized */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 mt-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb - Simplified */}
            {/* <CustomBreadcrumb 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: post.title, href: `/blog/${post.slug}` }
              ]} 
              className="mb-6" 
            /> */}

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

          {/* Market Outlook Widget */}
          {(post.sentiment || post.primaryAsset || post.confidenceLevel || post.timeHorizon) && (
            <div className="mb-20 relative group overflow-visible">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative overflow-visible rounded-[2.5rem] border-4 border-white/[0.05] bg-slate-900/80 backdrop-blur-3xl p-8 sm:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                  
                  {/* Left Side: Asset & Trend */}
                  <div className="space-y-6 flex-shrink-0">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Live Forecast</span>
                    </div>
                    
                    <div>
                      <h2 className="text-6xl sm:text-7xl font-black text-white tracking-tighter mb-2 italic">
                        {post.primaryAsset || "MARKET"}
                      </h2>
                      <div className="flex items-center gap-4">
                        <span className={`text-3xl font-black uppercase tracking-widest ${post.sentiment?.toLowerCase() === 'bullish' ? 'text-green-500' : post.sentiment?.toLowerCase() === 'bearish' ? 'text-red-500' : 'text-yellow-500'}`}>
                          {post.sentiment || "NEUTRAL"}
                        </span>
                        <div className={`p-2 rounded-full ${post.sentiment?.toLowerCase() === 'bullish' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                           <TrendingUp className={`w-8 h-8 ${post.sentiment?.toLowerCase() === 'bearish' ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Simple Trend Graph */}
                  {post.sentiment && post.primaryAsset && (
                    <div className="w-full lg:w-72 h-48 bg-slate-950/60 rounded-[2rem] border border-white/10 p-6 flex flex-col justify-between overflow-hidden relative group/graph">
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/[0.03] to-transparent pointer-events-none"></div>
                      <div className="flex justify-between items-center text-[10px] font-black text-white/40 uppercase tracking-widest">
                        <span>Projection</span>
                        <span>{post.timeHorizon || "H1"}</span>
                      </div>
                      
                      <div className="h-24 py-4">
                        <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor={post.sentiment.toLowerCase() === 'bullish' ? '#10b981' : post.sentiment.toLowerCase() === 'bearish' ? '#ef4444' : '#f59e0b'} />
                              <stop offset="100%" stopColor={post.sentiment.toLowerCase() === 'bullish' ? '#059669' : post.sentiment.toLowerCase() === 'bearish' ? '#dc2626' : '#d97706'} />
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          {post.sentiment.toLowerCase() === 'bullish' ? (
                            <path d="M0,50 Q50,40 100,25 T200,5" stroke="url(#trendGradient)" strokeWidth="4" fill="none" filter="url(#glow)" className="group-hover/graph:translate-y-[-5px] transition-transform duration-700" />
                          ) : post.sentiment.toLowerCase() === 'bearish' ? (
                            <path d="M0,10 Q50,20 100,35 T200,55" stroke="url(#trendGradient)" strokeWidth="4" fill="none" filter="url(#glow)" className="group-hover/graph:translate-y-[5px] transition-transform duration-700" />
                          ) : (
                            <path d="M0,30 Q50,20 100,40 T200,30" stroke="url(#trendGradient)" strokeWidth="4" fill="none" filter="url(#glow)" />
                          )}
                        </svg>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-white/30 uppercase">Confidence</span>
                           <span className="text-xl font-black text-white">{post.confidenceLevel}%</span>
                        </div>
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" style={{ width: `${post.confidenceLevel}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Related Asset Badges */}
                {post.relatedAssets && post.relatedAssets.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-3">
                    {post.relatedAssets.map(asset => (
                      <span key={asset} className="px-6 py-2 bg-white/5 hover:bg-cyan-500 hover:text-black hover:font-black rounded-full text-sm font-bold border border-white/10 transition-all cursor-pointer">
                        {asset}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Article Summary - Key Highlights */}
          {post.excerpt && (
            <div className="mb-24 relative">
              {/* Abstract Background Decoration */}
              <div className="absolute -left-12 top-0 w-24 h-full bg-cyan-500/10 [clip-path:polygon(0_0,100%_0,0_100%)]"></div>
              
              <div className="relative pl-12 border-l-2 border-cyan-500/30 py-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full border border-cyan-500/50 flex items-center justify-center bg-cyan-500/5">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.5em] text-cyan-500/80">Executive Brief</h3>
                </div>
                
                <p className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tighter max-w-3xl selection:bg-cyan-500 selection:text-black">
                  {post.excerpt}
                </p>
                
                <div className="mt-12 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white/40">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Core Insights identified</span>
                </div>
              </div>
            </div>
          )}

          {/* Article Content - Premium Typography */}
          <article className="prose prose-lg prose-invert max-w-none text-gray-800 dark:text-gray-200">
            {isLikelyHtml(post.content) ? (
              <div
                className="prose-custom-html relative"
              >
                <style>{`
                  .prose-custom-html mark {
                    background: linear-gradient(120deg, rgba(6, 182, 212, 0.4) 0%, rgba(6, 182, 212, 0) 100%);
                    color: #fff;
                    padding: 0.2em 0.4em;
                    border-radius: 0.5rem;
                    font-weight: 700;
                  }
                  .prose-custom-html blockquote {
                    border: none;
                    background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 100%);
                    padding: 3rem;
                    border-radius: 2rem;
                    margin: 4rem 0;
                    position: relative;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05);
                    overflow: visible;
                  }
                  .prose-custom-html blockquote::before {
                    content: '“';
                    position: absolute;
                    top: -1rem;
                    left: 2rem;
                    font-size: 8rem;
                    color: rgba(6, 182, 212, 0.2);
                    font-family: serif;
                    line-height: 1;
                  }
                  .prose-custom-html blockquote p {
                    font-size: 1.75rem;
                    line-height: 1.4;
                    font-weight: 800;
                    color: #fff;
                    font-style: italic;
                    letter-spacing: -0.02em;
                  }
                  .prose-custom-html h1 {
                    font-size: 4rem;
                    font-weight: 900;
                    letter-spacing: -0.05em;
                    background: linear-gradient(to bottom right, #fff, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-top: 6rem;
                  }
                  .prose-custom-html h2 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    border-left: 8px solid #06b6d4;
                    padding-left: 1.5rem;
                    margin-top: 5rem;
                    color: #fff;
                  }
                  .prose-custom-html p {
                    font-size: 1.25rem;
                    line-height: 1.8;
                    color: rgba(255,255,255,0.7);
                    margin-bottom: 2rem;
                  }
                  .prose-custom-html ul {
                    list-style: none;
                    padding-left: 0;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin: 3rem 0;
                  }
                  .prose-custom-html li {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 1.5rem;
                    border-radius: 1.25rem;
                    position: relative;
                    transition: all 0.3s ease;
                  }
                  .prose-custom-html li:hover {
                    background: rgba(6, 182, 212, 0.05);
                    border-color: rgba(6, 182, 212, 0.2);
                    transform: translateY(-5px);
                  }
                  .prose-custom-html li::before {
                    content: '→';
                    color: #06b6d4;
                    margin-right: 0.75rem;
                    font-weight: 900;
                  }
                `}</style>
                <div
                  className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-strong:text-foreground relative z-10"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                {/* Visual purely decorative element for background depth */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
              </div>
            ) : (
              <div className="text-muted-foreground/90 leading-relaxed overflow-visible space-y-24">
                {post.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <div key={index} className="relative py-24 border-y border-white/5 group">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                          <h1 className="text-6xl sm:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase italic select-none">
                            {paragraph.replace('# ', '')}
                          </h1>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-black uppercase tracking-[0.5em] text-cyan-500 block mb-2 underline decoration-2">Priority_Analysis</span>
                            <span className="text-4xl font-black text-white/10 font-mono tracking-tighter">0{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <div key={index} className="flex flex-col lg:flex-row gap-12 group">
                        <div className="lg:w-1/3 flex-shrink-0">
                          <div className="sticky top-32 space-y-4">
                            <div className="h-0.5 w-16 bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">
                              {paragraph.replace('## ', '')}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Market_Intelligence_Module</p>
                          </div>
                        </div>
                        <div className="lg:w-2/3 h-px bg-white/10 self-center hidden lg:block"></div>
                      </div>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <div key={index} className="relative pl-8">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-transparent opacity-30"></div>
                        <h3 className="text-2xl font-black text-white/90 uppercase tracking-tighter italic">
                          {paragraph.replace('### ', '')}
                        </h3>
                      </div>
                    );
                  }
                  if (paragraph.includes('- ')) {
                    const lines = paragraph.split('\n');
                    const items = lines.filter(item => item.trim().startsWith('- '));
                    const listTitle = lines[0].trim().startsWith('- ') ? null : lines[0];
                    
                    return (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-[2px] bg-white/5 border border-white/5 rounded-3xl overflow-hidden group">
                        {listTitle && (
                          <div className="col-span-1 md:col-span-2 p-10 bg-slate-900 border-b border-white/5">
                             <h4 className="text-lg font-black uppercase tracking-[0.3em] text-cyan-500 italic select-none">{listTitle}</h4>
                          </div>
                        )}
                        {items.map((item, itemIndex) => {
                          const content = item.replace('- ', '');
                          const match = content.match(/^\*\*(.*?)\*\*(.*)/);
                          
                          return (
                            <div key={itemIndex} className="p-10 bg-slate-950 hover:bg-slate-900 transition-all duration-500 group/item relative overflow-hidden">
                              <div className="absolute -inset-1 bg-cyan-500/5 opacity-0 group-item/hover:opacity-100 transition-opacity blur-2xl"></div>
                              <div className="space-y-6 relative z-10">
                                {match ? (
                                  <>
                                    <div className="flex items-center gap-4">
                                       <span className="text-xs font-black text-white/20 font-mono tracking-tighter">I_{itemIndex + 1}</span>
                                       <p className="font-black text-white text-xl tracking-tight uppercase underline decoration-cyan-500/30 decoration-4 underline-offset-4">{match[1]}</p>
                                    </div>
                                    <p className="text-white/60 text-lg leading-relaxed font-medium group-item/hover:text-white transition-colors">{match[2]}</p>
                                  </>
                                ) : (
                                  <div className="flex gap-4">
                                     <ArrowRight className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                                     <p className="text-white text-lg font-bold leading-relaxed">{content}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    const text = paragraph.replace(/\*\*/g, '');
                    return (
                      <div key={index} className="py-24 relative overflow-visible">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-32 bg-cyan-500/5 rotate-[-2deg] flex items-center justify-center font-black text-[12vw] text-white/[0.02] select-none pointer-events-none uppercase">Insight</div>
                        <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
                           <p className="text-5xl sm:text-6xl font-black text-white tracking-[0.02em] leading-[0.9] italic selection:bg-cyan-500 selection:text-black hover:scale-[1.02] transition-transform duration-700 cursor-default">
                              "{text}"
                           </p>
                           <div className="mt-12 flex flex-col items-center gap-4">
                              <TrendingUp className="w-12 h-12 text-cyan-500 animate-bounce" />
                              <div className="px-6 py-2 border-2 border-cyan-500 text-cyan-500 font-bold uppercase tracking-[0.4em] skew-x-[-20deg] text-[10px] hover:bg-cyan-500 hover:text-black transition-all">
                                STRATEGIC_EXTRACTION
                              </div>
                           </div>
                        </div>
                      </div>
                    );
                  }
                  if (paragraph.startsWith('Disclaimer:')) {
                    return (
                      <div key={index} className="mt-40 border-l-[20px] border-red-500 bg-red-500/[0.03] p-16 rounded-[4rem] group hover:bg-black transition-colors duration-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-40 bg-red-500/5 rounded-full blur-[120px] group-hover:bg-red-500/10 transition-colors"></div>
                        <div className="flex flex-col md:flex-row gap-12 relative z-10">
                          <div className="md:w-1/4">
                             <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center text-red-500 font-black text-5xl">!</div>
                          </div>
                          <div className="md:w-3/4 space-y-6">
                             <h4 className="text-4xl font-black text-red-500 uppercase tracking-tighter">Structural_Risk_Warning</h4>
                             <p className="text-xl text-red-100/30 leading-relaxed font-bold group-hover:text-red-100/60 uppercase">
                                {paragraph.replace('Disclaimer:', '')}
                             </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  if (paragraph.startsWith('Source:')) {
                    return (
                      <div key={index} className="pt-24 mt-24 border-t-2 border-dashed border-white/10">
                        <div className="inline-block p-8 border border-white/10 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.05] transition-all group cursor-pointer">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-500 group-hover:rotate-[360deg] transition-transform duration-1000">
                               <Eye className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-1">Authenticated_Link</p>
                               <span className="text-xl font-black uppercase tracking-tighter text-white/60 group-hover:text-white transition-colors">{paragraph}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  // ULTRA High-Contrast First Paragraph or Regular
                  return (
                    <p key={index} className="text-2xl sm:text-3xl text-white/60 font-medium leading-[1.6] my-16 max-w-5xl group/p first-letter:text-8xl first-letter:font-black first-letter:text-cyan-500 first-letter:float-left first-letter:mr-6 first-letter:leading-none hover:text-white transition-colors duration-500">
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
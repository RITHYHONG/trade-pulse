import { ArrowRight, Calendar, Clock, Eye, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost as BlogPostType } from '../../types/blog';
import { blogPosts } from '../../data/blogData';
import Image from 'next/image';
import Link from 'next/link';
import { MarketOutlookWidget } from './MarketOutlookWidget';
import { PromoBanner } from './PromoBanner';
import { BlogPostEngagement } from './BlogPostEngagement.client';

interface BlogPostProps {
  post: BlogPostType;
  relatedPosts?: BlogPostType[];
}

export function BlogPost({ post, relatedPosts }: BlogPostProps) {
  const defaultRelatedPosts = relatedPosts || blogPosts
    .filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border" />

      <div className="relative overflow-hidden bg-background pb-10 pt-12">
        <div className="absolute top-0 right-0 -z-10 -mr-32 -mt-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 -ml-32 -mb-16 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-sm">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary/70" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Clock className="h-4 w-4 text-primary/70" />
                <span>{post.readingTime}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Eye className="h-4 w-4 text-primary/70" />
                <span>{formatViews(post.views)}</span>
              </div>
            </div>

            <h1 className="mb-10 text-4xl font-black leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-7xl">
              {post.title}
            </h1>

            <div className="group relative aspect-[21/9] overflow-hidden rounded-2xl border border-border shadow-lg">
              <Image
                src={post.featuredImage ?? '/images/placeholder-blog.svg'}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 flex justify-center">
            <PromoBanner />
          </div>

          <MarketOutlookWidget post={post} />

          {post.excerpt && (
            <div className="relative mb-32">
              <div className="absolute -left-4 top-0 bottom-0 w-1.5 rounded-full bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent opacity-50" />

              <div className="space-y-8 pl-12">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-cyan-500/60">Executive Summary</span>
                </div>

                <p className="text-4xl font-black leading-[1.1] tracking-tight text-foreground selection:bg-cyan-500 selection:text-black md:text-5xl lg:text-6xl">
                  {post.excerpt}
                </p>
              </div>
            </div>
          )}

          <article className="prose prose-lg dark:prose-invert mx-auto w-full font-sans selection:bg-cyan-500/20 md:text-xl lg:text-2xl">
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
                  .prose-custom-html p { margin-bottom: 2em; opacity: 0.9; }
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
                  .prose-custom-html blockquote p { margin: 0; }
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
                <div className="relative z-10" dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            ) : (
              <div className="space-y-12">
                {post.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="mb-10 mt-24 text-5xl font-black leading-none tracking-tighter text-foreground md:text-6xl">
                        {paragraph.replace('# ', '')}
                      </h1>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="mb-8 mt-20 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="mb-4 mt-16 text-lg font-black uppercase tracking-[0.2em] text-muted-foreground">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }

                  return (
                    <p key={index} className="mb-8 leading-relaxed tracking-tight text-foreground/85">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            )}
          </article>

          <div className="my-16 flex justify-center">
            <PromoBanner />
          </div>

          <footer className="mt-16 space-y-12">
            {post.tags && post.tags.length > 0 && (
              <div className="border-t border-border pt-8">
                <h4 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">Topics</h4>
                <div className="flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-border bg-card/5 px-4 py-1.5 text-muted-foreground transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-400"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-50 blur transition duration-500 group-hover:opacity-100" />
              <BlogPostEngagement
                postId={post.id || post.slug}
                title={post.title}
                excerpt={post.excerpt}
                helpfulCount={post.helpfulCount ?? 0}
              />
            </div>

            <div className="relative overflow-hidden rounded-2xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-50" />
              <div className="relative border border-border p-8 backdrop-blur-sm">
                <div className="flex flex-col items-start gap-6 sm:flex-row">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-75 blur transition duration-300 group-hover:opacity-100" />
                    <Image
                      src={post.author.avatarUrl || post.author.avatar || '/images/default-avatar.svg'}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      className="relative h-20 w-20 rounded-full object-cover ring-2 ring-background"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-3 text-2xl font-bold text-card-foreground">
                      About <span className="text-foreground">{post.author.name}</span>
                    </h4>
                    <p className="mb-6 leading-relaxed text-muted-foreground">
                      {post.author.bio || 'Experienced market analyst and trading expert, providing insights and strategies to help traders navigate the financial markets.'}
                    </p>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border bg-card/5 text-muted-foreground transition-all duration-300 hover:bg-card/10 hover:text-foreground"
                      >
                        More Articles
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NewsletterCTAPlaceholder />

            {defaultRelatedPosts.length > 0 && (
              <section className="pt-8">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-3xl font-bold text-foreground">Related Articles</h3>
                  <Link
                    href="/blog"
                    className="flex items-center gap-1 text-sm font-medium text-primary transition-colors duration-300 hover:text-primary/80"
                  >
                    View all articles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {defaultRelatedPosts.map((relatedPost) => (
                    <RelatedArticleCard key={relatedPost.slug} post={relatedPost} />
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
  return /<\s*\w+[^>]*>/.test(content) || /&[a-zA-Z]+;/.test(content);
}

function RelatedArticleCard({ post }: { post: BlogPostType }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={post.featuredImage ?? '/images/placeholder-blog.svg'}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-primary">{post.category}</span>
            <span>•</span>
            <span>{formatRelativeDate(post.publishedAt)}</span>
          </div>
          <h4 className="line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h4>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}

function formatRelativeDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

function NewsletterCTAPlaceholder() {
  return (
    <div className="rounded-2xl border border-border bg-card/50 p-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Newsletter</p>
        <h4 className="text-2xl font-bold text-foreground">Get the next market update in your inbox</h4>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Subscribe for weekly market summaries, trade ideas, and breaking news.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="h-12 flex-1 rounded-xl border border-border bg-background/70" />
        <div className="h-12 w-full rounded-xl bg-primary sm:w-40" />
      </div>
    </div>
  );
}
"use client";

import { BlogPost } from '../../types/blog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { HiArrowRight, HiClock, HiUser } from 'react-icons/hi2';
import { formatRelativeTime } from '@/lib/dateUtils';
import { motion } from 'motion/react';

interface HeroSectionProps {
  featuredPost: BlogPost | null;
  sidebarPosts: BlogPost[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
}

// using shared formatRelativeTime from lib/dateUtils

function HeroSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Skeleton className="w-full h-[500px] rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.article 
        whileHover={{ x: 5 }}
        className="flex gap-4 p-4 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
      >
        <div className="relative w-28 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={post.featuredImage ?? ''}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
              {post.category}
            </span>
            <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-2 font-medium">
            <HiClock className="w-3 h-3" />
            <span>{formatRelativeTime(post.publishedAt)}</span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export function HeroSection({ featuredPost, sidebarPosts, isLoading }: HeroSectionProps) {
  if (isLoading) return <HeroSkeleton />;

  return (
    <section className="py-12 mt-8 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Featured Article */}
          {featuredPost && (
            <div className="lg:col-span-8">
              <Link href={`/blog/${featuredPost.slug}`}>
                <article className="relative h-[480px] lg:h-[560px] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl shadow-primary/5">
                  <ImageWithFallback
                    src={featuredPost.featuredImage ?? ''}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                  />

                  {/* Dramatic Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/60 via-transparent to-transparent" />

                  {/* Hot Badge */}
                  <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-1.5 bg-primary rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                    <motion.div 
                      animate={{ opacity: [1, 0.5, 1] }} 
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" 
                    />
                    Featured Report
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="space-y-6 max-w-3xl"
                    >
                      <span className="text-primary-foreground/70 font-mono text-sm tracking-widest uppercase">
                        {featuredPost.category} • {featuredPost.readingTime}
                      </span>
                      
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight lg:leading-[1.1] tracking-tight group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </h2>



                    </motion.div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/40 p-0.5">
                            <div className="relative w-full h-full rounded-full overflow-hidden bg-white/10">
                              <ImageWithFallback
                                src={featuredPost.author?.avatarUrl || featuredPost.author?.avatar || ''}
                                alt={featuredPost.author?.name || 'Author'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">{featuredPost.author?.name}</span>
                            <span className="text-white/50 text-[10px] uppercase tracking-wider">{formatRelativeTime(featuredPost.publishedAt)}</span>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-3 text-white font-bold text-sm group/btn">
                          Read Full Article
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white group-hover/btn:scale-110 group-hover/btn:rotate-12 transition-all">
                            <HiArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                  </div>
                </article>
              </Link>
            </div>
          )}

          {/* Sidebar Headline Stream */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            
            <div className="flex flex-col gap-4 flex-1">
              {sidebarPosts.slice(0, 4).map((post) => (
                <SidebarPostCard key={post.id || post.slug} post={post} />
              ))}
            </div>
            
            {/* Promo Card Placeholder / Micro Widget */}
            <div className="mt-auto p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl -mr-12 -mt-12" />
              <h4 className="font-bold text-lg mb-2 relative z-10">Smart Trading Alert</h4>
              <p className="text-xs text-muted-foreground relative z-10 mb-4 leading-relaxed">Get the daily 5-minute pre-market brief delivered to your inbox.</p>
              <button className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Subscribe Now <HiArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from './HeroSection';
import { NewsTicker } from './NewsTicker';
import { BlogMarketWrap } from './BlogMarketWrap';
import { LatestNewsSection } from './LatestNewsSection';
import { PopularStorySection } from './PopularStorySection';
import { HighlightSection } from './HighlightSection';
import { CategoryNewsSection } from './CategoryNewsSection';
import { BlogCardSkeleton } from './BlogCard';
import { categories } from '../../data/blogData';

export default function Loading() {
  // Render skeletons for the full blog page so layout doesn't jump
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <HeroSection featuredPost={null} sidebarPosts={[]} isLoading />

      {/* News Ticker */}
      <NewsTicker isLoading />

      {/* Market Wrap (has its own loading UI) */}
      <BlogMarketWrap />

      {/* Category Filter - skeleton pills */}
      <div className=" bg-background/95 backdrop-blur-md border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-28 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <LatestNewsSection posts={[]} isLoading />
      <PopularStorySection posts={[]} isLoading />
      <HighlightSection posts={[]} isLoading />

      {/* Render a few category skeleton sections to match the page */}
      {categories.filter(c => c !== 'All Posts').slice(0, 3).map((cat) => (
        <CategoryNewsSection key={cat} posts={[]} isLoading category={cat} />
      ))}

      {/* More Stories Grid */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA skeleton */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
            <Skeleton className="h-8 w-72 mx-auto mb-3" />
            <Skeleton className="h-4 w-full mx-auto mb-6" />
            <div className="flex items-center gap-3 justify-center">
              <Skeleton className="h-10 w-72 rounded-md" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
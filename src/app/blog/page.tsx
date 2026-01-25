import { Metadata } from 'next';
import { BlogIndex } from './BlogIndex';

export const metadata: Metadata = {
  title: 'Trading Insights & Market Analysis | Trader Pulse Blog',
  description: 'Stay ahead with our expert trading insights, market analysis, and pre-market intelligence. Get the latest trends and strategies from professional traders.',
  keywords: 'trading insights, market analysis, pre-market, trading strategies, financial news',
  openGraph: {
    title: 'Trading Insights & Market Analysis | Trader Pulse Blog',
    description: 'Expert trading insights and market analysis to keep you ahead of the curve',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <div className="overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main id="main-content">
        {/* We no longer pass initialPosts from mock data; BlogIndex fetches from Firestore */}
        <BlogIndex />
      </main>
    </div>
  );
}
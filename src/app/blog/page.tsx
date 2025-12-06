import { Metadata } from 'next';
import { BlogIndex } from './BlogIndex';
import { blogPosts } from '@/data/blogData';
import { HeaderMain } from '@/components/HeaderMain';
import ChatbotModal from '@/components/ai/chatbot';

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
    <div className="min-h-screen bg-[#0F1116] text-white">
      <HeaderMain />
      <main id="main-content">
        <BlogIndex initialPosts={blogPosts} />
      </main>
    </div>
  );
}
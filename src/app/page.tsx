import { Features } from "./(marketing)/components/Features";
import { Footer } from "./(marketing)/components/Footer";
import { Hero } from "./(marketing)/components/Hero";
import { Pricing } from "./(marketing)/components/Pricing";
import { ProblemSolution } from "./(marketing)/components/ProblemSolution";
import { SocialProof } from "./(marketing)/components/SocialProof";
import { generateMetadata } from '@/lib/seo';
import { AuthRedirect } from '@/components/auth-redirect';
import type { Metadata } from 'next';

export default function HomePage() {
  return (
    <>
      <AuthRedirect authenticatedPath="/blog" redirectAuthenticated={true} />
      <div className="overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Hero />
        <ProblemSolution />
        <Features />
        <SocialProof />
        <Pricing />
      </div>
    </>
  );
}

export const metadata: Metadata = generateMetadata({
  title: 'Home',
  description:
    'AI-powered pre-market intelligence and real-time trading insights. Start every trading day ahead with Trader Pulse.',
  path: '/',
});


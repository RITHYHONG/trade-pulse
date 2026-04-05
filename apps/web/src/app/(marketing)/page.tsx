import dynamic from 'next/dynamic';
import { Hero } from "./components/Hero";
const ProblemSolution = dynamic(() => import("./components/ProblemSolution").then((mod) => mod.ProblemSolution));
const Features = dynamic(() => import("./components/Features").then((mod) => mod.Features));
const SocialProof = dynamic(() => import("./components/SocialProof").then((mod) => mod.SocialProof));
const Pricing = dynamic(() => import("./components/Pricing").then((mod) => mod.Pricing));
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export default function MarketingHome() {
  return (
    <div className="scroll-smooth overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      <Hero />
      <ProblemSolution />
      <Features />
      <SocialProof />
      <Pricing />
    </div>
  );
}

export const metadata: Metadata = generateMetadata({
  title: 'Home',
  description:
    'AI-powered pre-market intelligence and real-time trading insights. Start every trading day ahead with Trader Pulse.',
  path: '/',
});
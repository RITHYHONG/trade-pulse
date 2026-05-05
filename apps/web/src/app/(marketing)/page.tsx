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
    <div className="relative scroll-smooth overflow-x-hidden min-h-screen bg-[#f5f7fb] text-slate-950 dark:bg-[#07090d] dark:text-slate-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.05),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.08),transparent_26%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.05),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:88px_88px] opacity-70 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.022)_1px,transparent_1px)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent dark:from-white/[0.03]" />
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8),rgba(255,255,255,0)_68%)] opacity-30 blur-3xl dark:bg-[radial-gradient(circle,rgba(14,165,233,0.16),rgba(14,165,233,0)_68%)] dark:opacity-55" />
      </div>

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
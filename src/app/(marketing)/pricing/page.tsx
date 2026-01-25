import { Pricing } from "../components/Pricing";
import { generateMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Pricing - Trade Pulse',
  description: 'Choose the perfect plan for your trading journey. Start free or unlock professional-grade AI insights.',
  path: '/marketing/pricing',
});

export default function PricingPage() {
  return (
    <div className="pt-20">
      <Pricing />
    </div>
  );
}
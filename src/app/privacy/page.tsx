import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy',
  description:
    'Trader Pulse Privacy Policy. Learn how we collect, use, and protect your data. We are committed to protecting your privacy and ensuring transparency.',
  path: '/privacy',
});

export default function Page() {
  return (
    <div>
      <h1>Privacy Policy</h1>
    </div>
  )
}
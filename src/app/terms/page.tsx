import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service',
  description:
    'Trader Pulse Terms of Service. Review site rules, user responsibilities, and legal agreements for using Trader Pulse.',
  path: '/terms',
});

export default function Page() {
  return (
    <div>
      <h1>Terms of Service</h1>
    </div>
  )
}
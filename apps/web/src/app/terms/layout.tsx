import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service',
  description:
    'Trade Pulse Terms of Service. Review site rules, user responsibilities, and legal agreements for using Trade Pulse.',
  path: '/terms',
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

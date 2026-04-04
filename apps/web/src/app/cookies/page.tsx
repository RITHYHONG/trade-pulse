import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import { redirect } from 'next/navigation';

export const metadata: Metadata = generateMetadata({
  title: 'Cookie Policy',
  description: 'Trader Pulse Cookie Policy detailing how cookies and similar technologies are used on the site.',
  path: '/cookies',
});

export default function CookiesPage() {
  // Server-side redirect to canonical cookie-policy page
  redirect('/cookie-policy');
}

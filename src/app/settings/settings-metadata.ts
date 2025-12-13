import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Settings',
  description: 'Manage your Trader Pulse account settings, preferences, and profile information.',
  path: '/settings',
});
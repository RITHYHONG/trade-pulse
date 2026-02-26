import { LoginForm } from '../components/LoginForm';
import { SessionSync } from '../../../components/session-sync';
import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <SessionSync />
      <LoginForm />
    </Suspense>
  );
}

export const metadata: Metadata = generateMetadata({
  title: 'Login',
  description: 'Sign in to access your Trader Pulse dashboard, watchlists, and personalized alerts.',
  path: '/login',
});
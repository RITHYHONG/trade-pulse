import { LoginForm } from '../components/LoginForm';
import { SessionSync } from '../../../components/session-sync';
import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export default function LoginPage() {
  return (
    <>
      <SessionSync />
      <LoginForm />
    </>
  );
}

export const metadata: Metadata = generateMetadata({
  title: 'Login',
  description: 'Sign in to access your Trader Pulse dashboard, watchlists, and personalized alerts.',
  path: '/login',
});
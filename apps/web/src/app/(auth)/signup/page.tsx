import { SignUpForm } from '../components/SignUpForm';
import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export default function SignUpPage() {
  return <SignUpForm />;
}

export const metadata: Metadata = generateMetadata({
  title: 'Sign Up',
  description: 'Create a Trader Pulse account to get AI-powered pre-market summaries, alerts, and market insights.',
  path: '/signup',
});
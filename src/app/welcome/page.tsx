import { AuthRedirect } from '@/components/auth-redirect';

export default function WelcomePage() {
  return <AuthRedirect authenticatedPath="/dashboard" redirectAuthenticated={true} />;
}
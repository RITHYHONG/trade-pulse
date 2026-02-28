import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import { getCurrentUser } from '../lib/auth';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (user && !loading) {
        // Wait a bit to ensure Firebase auth token is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const firebaseUser = getCurrentUser();
        if (firebaseUser) {
          // Check if we can get the ID token
          try {
            await firebaseUser.getIdToken();
            setIsFullyAuthenticated(true);
          } catch (error) {
            console.error('Error getting ID token:', error);
            setIsFullyAuthenticated(false);
          }
        }
      } else {
        setIsFullyAuthenticated(false);
      }
    };

    checkAuth();
  }, [user, loading]);

  if (loading || !isFullyAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-slate-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';

export function useAuth() {
  const {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signOut,
    resetPassword,
    initializeAuth,
    setError,
  } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signOut,
    resetPassword,
    clearError: () => setError(null),
  };
}
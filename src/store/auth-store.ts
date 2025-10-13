import { create } from 'zustand';
import { AuthUser, signUp, signIn, signOutUser, resetPassword, onAuthStateChange, toAuthUser } from '../lib/auth';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signUp: async (email, password, displayName) => {
    try {
      set({ loading: true, error: null });
      const user = await signUp({ email, password, displayName });
      // Set auth cookie for middleware
      document.cookie = `auth-token=${user.uid}; path=/; max-age=86400; samesite=strict`;
      set({ user: toAuthUser(user), loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const user = await signIn({ email, password });
      // Set auth cookie for middleware
      document.cookie = `auth-token=${user.uid}; path=/; max-age=86400; samesite=strict`;
      set({ user: toAuthUser(user), loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await signOutUser();
      // Remove auth cookie
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      set({ user: null, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign out failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      set({ loading: true, error: null });
      await resetPassword(email);
      set({ loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  initializeAuth: () => {
    set({ loading: true });
    const unsubscribe = onAuthStateChange((user) => {
      set({ user: toAuthUser(user), loading: false });
    });
    return unsubscribe;
  },
}));
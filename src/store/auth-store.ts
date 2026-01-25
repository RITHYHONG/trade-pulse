import { create } from "zustand";
import {
  AuthUser,
  signUp,
  signIn,
  signOutUser,
  resetPassword,
  onAuthStateChange,
  toAuthUser,
} from "../lib/auth";
import {
  signInWithGoogle,
  signInWithGoogleRedirect,
  handleGoogleRedirectResult,
} from "../lib/google-auth";
import { initializeUserProfile } from "../lib/firestore-service";
import { clearAuthorProfileCache } from "../hooks/use-author-profile";
import { mapToAppError, logError } from "../lib/error";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGoogleRedirect: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  loading: false, // Changed from true to false for faster initial render
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signUp: async (email, password, displayName) => {
    try {
      set({ loading: true, error: null });
      const user = await signUp({ email, password, displayName });

      // Initialize user profile in Firestore
      await initializeUserProfile(user);

      // Fetch ID token for secure session cookie creation
      const idToken = await user.getIdToken();

      // Set auth cookies via API route (secure, HTTP-only)
      await fetch("/api/auth/set-cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }),
      });

      set({ user: toAuthUser(user), loading: false });
    } catch (error) {
      const appError = mapToAppError(error);
      logError(appError, { operation: "signUp", email });
      set({ error: appError.userMessage, loading: false });
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const user = await signIn({ email, password });

      // Fetch ID token for secure session cookie creation
      const idToken = await user.getIdToken();

      // Set auth cookies via API route (secure, HTTP-only)
      await fetch("/api/auth/set-cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }),
      });

      set({ user: toAuthUser(user), loading: false });
    } catch (error) {
      const appError = mapToAppError(error);
      logError(appError, { operation: "signIn", email });
      set({ error: appError.userMessage, loading: false });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      console.log("Starting Google sign-in...");

      const user = await signInWithGoogle();
      console.log("Google sign-in completed, user:", user);

      // Initialize user profile in Firestore for new Google users
      console.log("Initializing user profile...");
      await initializeUserProfile(user);
      console.log("User profile initialization completed");

      // Set auth cookies via API route (secure, HTTP-only)
      console.log("Setting auth cookies...");
      const idToken = await user.getIdToken();
      await fetch("/api/auth/set-cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }),
      });
      console.log("Auth cookies set successfully");

      const authUser = toAuthUser(user);
      console.log("Final auth user object:", authUser);
      set({ user: authUser, loading: false });
    } catch (error) {
      const appError = mapToAppError(error);
      logError(appError, { operation: "signInWithGoogle" });
      set({ error: appError.userMessage, loading: false });
      throw error;
    }
  },

  signInWithGoogleRedirect: async () => {
    try {
      set({ loading: true, error: null });
      // This will redirect the page, so we don't need to handle the result here
      await signInWithGoogleRedirect();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google redirect sign in failed";
      set({ error: message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await signOutUser();

      // Clear auth cookies via API route
      await fetch("/api/auth/clear-cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Clear profile cache
      clearAuthorProfileCache();

      set({ user: null, loading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign out failed";
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
      const message =
        error instanceof Error ? error.message : "Password reset failed";
      set({ error: message, loading: false });
      throw error;
    }
  },

  initializeAuth: () => {
    // Check if we have cached auth state
    const cachedAuthState = localStorage.getItem("auth_state");
    if (cachedAuthState) {
      try {
        const cached = JSON.parse(cachedAuthState);
        const cacheAge = Date.now() - cached.timestamp;

        // Use cache if less than 1 minute old
        if (cacheAge < 60 * 1000 && cached.user) {
          set({ user: cached.user, loading: false });
        }
      } catch (e) {
        console.error("Error parsing cached auth state:", e);
      }
    }

    set({ loading: true });

    // Handle Google redirect result first
    handleGoogleRedirectResult()
      .then(async (user) => {
        if (user) {
          // User signed in via redirect
          await initializeUserProfile(user);

          // Set auth cookies
          const idToken = await user.getIdToken();
          await fetch("/api/auth/set-cookies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            }),
          });

          const authUser = toAuthUser(user);
          localStorage.setItem(
            "auth_state",
            JSON.stringify({
              user: authUser,
              timestamp: Date.now(),
            }),
          );

          set({ user: authUser, loading: false });
          return;
        }

        // No redirect result, continue with normal auth state listening
        const unsubscribe = onAuthStateChange(async (user) => {
          const authUser = toAuthUser(user);

          // Cache the auth state
          if (authUser) {
            localStorage.setItem(
              "auth_state",
              JSON.stringify({
                user: authUser,
                timestamp: Date.now(),
              }),
            );

            // Validate and refresh session cookies if needed
            try {
              const idToken = await user!.getIdToken();
              await fetch("/api/auth/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  idToken,
                  uid: user!.uid,
                  email: user!.email,
                  displayName: user!.displayName,
                }),
              });
            } catch (error) {
              console.error("Session validation failed:", error);
            }

            // Initialize user profile after a delay to ensure token is ready
            setTimeout(() => {
              initializeUserProfile(user!).catch(console.error);
            }, 2000);
          } else {
            // Clear cache when signed out
            localStorage.removeItem("auth_state");

            // Proactively clear cookies to prevent middleware redirect loops
            // only if we're not already on a public page or if we've recently been "logged in"
            fetch("/api/auth/clear-cookies", { method: "POST" }).catch(
              console.error,
            );
          }

          set({ user: authUser, loading: false });
        });

        return unsubscribe;
      })
      .catch(console.error);

    return () => {}; // Return empty cleanup function
  },
}));

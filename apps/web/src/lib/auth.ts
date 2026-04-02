import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { auth } from './firebase';

// Note: Google login functions are separated in src/lib/google-auth.ts
// To enable Google login, import and re-export the functions from google-auth.ts:
// import { signInWithGoogle, signInWithGoogleRedirect, handleGoogleRedirectResult } from './google-auth';
// export { signInWithGoogle, signInWithGoogleRedirect, handleGoogleRedirectResult };

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Sign up with email and password
export async function signUp({ email, password, displayName }: SignUpData): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    return user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create account';
    throw new Error(message);
  }
}

// Sign in with email and password
export async function signIn({ email, password }: SignInData): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign in';
    throw new Error(message);
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign out';
    throw new Error(message);
  }
}

// Send password reset email
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send password reset email';
    throw new Error(message);
  }
}

export async function sendMagicLink(email: string): Promise<void> {
  try {
    if (typeof window === 'undefined') {
      throw new Error('sendMagicLink must be called from the client');
    }

    const actionCodeSettings = {
      // After sign-in, the user will be redirected to this URL
      url: `${window.location.origin}/magic-link`,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    // Persist email to localStorage so the magic-link landing page can read it
    try {
      window.localStorage.setItem('magic_email', email);
    } catch (e) {
      // ignore
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send sign-in link';
    throw new Error(message);
  }
}

export async function completeMagicSignIn(email?: string): Promise<User> {
  try {
    if (typeof window === 'undefined') {
      throw new Error('completeMagicSignIn must be called from the client');
    }

    const href = window.location.href;
    if (!isSignInWithEmailLink(auth, href)) {
      throw new Error('Not a valid sign-in link');
    }

    let userEmail = email;
    if (!userEmail) {
      userEmail = window.localStorage.getItem('magic_email') || '';
    }

    if (!userEmail) {
      // Ask caller to provide email if not available
      throw new Error('Missing email for magic sign-in');
    }

    const userCredential = await signInWithEmailLink(auth, userEmail, href);
    return userCredential.user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to complete sign-in';
    throw new Error(message);
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Convert Firebase User to AuthUser
export function toAuthUser(user: User | null): AuthUser | null {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

// Get current Firebase user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
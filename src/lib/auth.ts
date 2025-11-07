import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './firebase';

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

// Sign in with Google (popup method)
export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider();
    // Add additional scopes to get more profile information
    provider.addScope('profile');
    provider.addScope('email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    
    // Configure the provider to force account selection
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const result = await signInWithPopup(auth, provider);
    
    console.log('Google sign-in successful:', {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      providerData: result.user.providerData
    });
    
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    if (error instanceof Error) {
      // Handle specific Google auth errors
      if (error.message.includes('auth/popup-closed-by-user')) {
        throw new Error('Sign-in was cancelled');
      } else if (error.message.includes('auth/popup-blocked')) {
        throw new Error('Pop-up was blocked by browser. Please allow pop-ups for this site.');
      } else if (error.message.includes('auth/cancelled-popup-request')) {
        throw new Error('Another sign-in pop-up is already open');
      }
    }
    const message = error instanceof Error ? error.message : 'Failed to sign in with Google';
    throw new Error(message);
  }
}

// Sign in with Google (redirect method - alternative for CSP issues)
export async function signInWithGoogleRedirect(): Promise<void> {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    await signInWithRedirect(auth, provider);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to initiate Google sign in';
    throw new Error(message);
  }
}

// Handle redirect result (call this on app initialization)
export async function handleGoogleRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error('Error handling Google redirect result:', error);
    return null;
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
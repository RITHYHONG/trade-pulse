import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
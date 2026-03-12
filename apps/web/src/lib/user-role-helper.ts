/**
 * Helper function to get user role from Firestore
 * Add this to src/lib/firestore-service.ts or create it separately
 */

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function getUserRole(uid: string): Promise<'user' | 'admin'> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data()?.role || 'user';
    }
    
    return 'user'; // Default to user role
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user'; // Default to user role on error
  }
}

/**
 * Helper function to set user role
 * Use this to promote users to admin
 */
export async function setUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { role });
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
}

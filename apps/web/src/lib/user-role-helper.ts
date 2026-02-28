/**
 * Helper function to get user role from Firestore
 * Add this to src/lib/firestore-service.ts or create it separately
 */

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export type UserRole = 'user' | 'moderator' | 'editor' | 'admin' | 'superadmin';

export const ROLE_PERMISSIONS = {
  user: ['read:news'],
  moderator: ['read:news', 'read:blog', 'manage:editor_requests'],
  editor: ['read:news', 'read:blog', 'create:blog', 'edit:blog'],
  admin: ['read:news', 'read:blog', 'create:blog', 'edit:blog', 'delete:blog', 'manage:users', 'manage:editor_requests'],
  superadmin: ['read:news', 'read:blog', 'create:blog', 'edit:blog', 'delete:blog', 'manage:users', 'manage:admins', 'manage:editor_requests'],
} as const;

export async function getUserRole(uid: string): Promise<UserRole> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return (userDoc.data()?.role as UserRole) || 'user';
    }
    
    return 'user'; // Default to user role
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user'; // Default to user role on error
  }
}

/**
 * Helper function to set user role
 * Use this to promote users or change permissions
 */
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { 
      role,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
}

/**
 * Check if a user has a specific role or higher
 */
export function hasRole(currentRole: UserRole, requiredRole: UserRole): boolean {
  const roles: UserRole[] = ['user', 'moderator', 'editor', 'admin', 'superadmin'];
  const currentIndex = roles.indexOf(currentRole);
  const requiredIndex = roles.indexOf(requiredRole);
  
  return currentIndex >= requiredIndex;
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] as readonly string[];
  return permissions.includes(permission);
}

/**
 * Submit a request to become an editor
 */
export async function requestEditorStatus(uid: string, reason: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      editorRequest: {
        status: 'pending',
        reason,
        requestedAt: new Date(),
      }
    });
  } catch (error) {
    console.error('Error requesting editor status:', error);
    throw error;
  }
}

/**
 * Handle editor request (approve/deny)
 */
export async function handleEditorRequest(
  uid: string, 
  action: 'approve' | 'deny',
  adminUid: string
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const updates: any = {
      'editorRequest.status': action === 'approve' ? 'approved' : 'denied',
      'editorRequest.handledBy': adminUid,
      'editorRequest.handledAt': new Date(),
    };

    if (action === 'approve') {
      updates.role = 'editor';
    }

    await updateDoc(userDocRef, updates);
  } catch (error) {
    console.error('Error handling editor request:', error);
    throw error;
  }
}

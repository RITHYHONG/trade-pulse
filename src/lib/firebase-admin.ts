import admin from 'firebase-admin';

let _adminReady = false;

// Initialize admin SDK once (server-side only)
if (!admin.apps?.length) {
  // Option 1: single JSON blob (easiest for Vercel — paste the downloaded service account JSON)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  // Option 2: individual env vars
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY as string | undefined;
  if (privateKey) {
    // Private key may have literal `\n` sequences in env; convert to real newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  try {
    if (serviceAccountJson) {
      // Parse and use the full service account JSON
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      _adminReady = true;
    } else if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        } as admin.ServiceAccount),
      });
      _adminReady = true;
    } else {
      // Missing credentials — log clearly and skip init to avoid ADC fallback crash
      console.warn(
        '[firebase-admin] Missing credentials. Set FIREBASE_SERVICE_ACCOUNT (JSON string) ' +
        'or FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY. ' +
        'Admin SDK features (session cookies, server-side auth) will be disabled.'
      );
    }
  } catch (err) {
    console.error('[firebase-admin] Failed to initialize Firebase Admin SDK:', err);
  }
}

/** True when the Admin SDK was successfully initialized with real credentials. */
export const isAdminReady = _adminReady;

export const adminApp = admin;

// Lazy accessor — only call admin.firestore() if the SDK was initialized
export const adminDb = _adminReady ? admin.firestore() : null as unknown as admin.firestore.Firestore;

export async function incrementPostViews(postId: string, amount: number = 1) {
  if (!_adminReady) {
    console.warn('[firebase-admin] incrementPostViews: Admin SDK not initialized, skipping.');
    return null;
  }
  const postRef = adminDb.collection('posts').doc(postId);
  // Use FieldValue.increment for atomic increments
  const increment = admin.firestore.FieldValue.increment(amount) as any;

  try {
    // Try to update existing doc
    await postRef.update({ views: increment });
  } catch (err) {
    // If update fails (for example: document does not exist), fall back to set with merge
    console.warn('incrementPostViews: update failed, attempting set with merge', err);
    await postRef.set({ views: increment }, { merge: true });
  }

  // Return the current views value after increment
  const snap = await postRef.get();
  const data = snap.data();
  const views = typeof data?.views === 'number' ? data.views : (data?.views ?? null);
  return views;
}

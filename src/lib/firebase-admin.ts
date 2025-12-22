import admin from 'firebase-admin';

// Initialize admin SDK once (server-side only)
if (!admin.apps?.length) {
  // Expect these env vars to be set in deployment: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY as string | undefined;

  if (privateKey) {
    // Private key may have literal `\n` sequences in env; convert them to newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      } as any),
    });
  } else {
    // Fallback to application default credentials if available
    try {
      admin.initializeApp();
    } catch (err) {
      // If initialization fails, rethrow with context
      console.error('Failed to initialize Firebase Admin SDK:', err);
      throw err;
    }
  }
}

export const adminApp = admin;
export const adminDb = admin.firestore();

export async function incrementPostViews(postId: string, amount: number = 1) {
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

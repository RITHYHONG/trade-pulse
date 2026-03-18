import admin from 'firebase-admin';

let _adminReady = false;

// Initialize admin SDK once (server-side only)
if (admin.apps?.length) {
  // Already initialized — e.g., Next.js HMR caused module re-evaluation.
  // The firebase-admin singleton persists across module reloads so we can
  // safely mark it as ready without re-calling initializeApp.
  _adminReady = true;
} else {
  // Option 1: single JSON blob (easiest for Vercel — paste the downloaded service account JSON)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  // Option 2: individual env vars
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY as string | undefined;
  const privateKeyB64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_B64;

  // Normalize a raw PEM key from env-file format (handles literal \n and surrounding quotes)
  function normalizePem(key: string): string {
    let k = key.replace(/\\n/g, '\n');
    if (k.startsWith('"') && k.endsWith('"')) k = k.slice(1, -1);
    return k.trim();
  }

  // Prefer the raw key; only decode B64 as a fallback when no raw key is provided.
  // This avoids a corrupt B64 value silently overriding a working raw key.
  let privateKey: string | undefined;
  if (rawPrivateKey) {
    privateKey = normalizePem(rawPrivateKey);
  } else if (privateKeyB64) {
    try {
      privateKey = Buffer.from(privateKeyB64, 'base64').toString('utf8').trim();
    } catch (err) {
      console.error('[firebase-admin] Failed to decode FIREBASE_ADMIN_PRIVATE_KEY_B64:', err);
    }
  }

  try {
    const storageBucket =
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    if (serviceAccountJson) {
      // Parse and use the full service account JSON
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        ...(storageBucket ? { storageBucket } : {}),
      });
      _adminReady = true;
    } else if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        } as admin.ServiceAccount),
        ...(storageBucket ? { storageBucket } : {}),
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
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[firebase-admin] Failed to initialize Firebase Admin SDK:', msg);
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

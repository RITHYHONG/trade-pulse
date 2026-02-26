import admin from "firebase-admin";

// Initialize admin SDK once (server-side only)
try {
  if (!admin.apps?.length) {
    // Expect these env vars to be set in deployment: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY as
      | string
      | undefined;

    if (privateKey) {
      // Private key may have literal `\n` sequences in env; convert them to newlines
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey,
        }),
      });
      console.log("Firebase Admin initialized successfully with credentials.");
    } else {
      // Fallback to application default credentials if available
      try {
        admin.initializeApp();
        console.log("Firebase Admin initialized with default credentials.");
      } catch (err) {
        // If initialization fails, log it but don't crash the whole process
        console.error(
          "Failed to initialize Firebase Admin SDK (is the environment configured?):",
          err,
        );
      }
    }
  }
} catch (error) {
  console.error(
    "Critical error during Firebase Admin top-level initialization:",
    error,
  );
}

export const adminApp = admin;

// Lazy-initialized Firestore instance to prevent import crashes
let _db: admin.firestore.Firestore | null = null;
export const getAdminDb = () => {
  if (!_db) {
    if (!admin.apps.length) {
      throw new Error(
        "Firebase Admin SDK not initialized. Check your environment variables.",
      );
    }
    _db = admin.firestore();
  }
  return _db;
};

// For backward compatibility
export const adminDb = admin.apps.length ? admin.firestore() : null;

export async function incrementPostViews(postId: string, amount: number = 1) {
  const db = getAdminDb();
  const postRef = db.collection("posts").doc(postId);
  const increment = admin.firestore.FieldValue.increment(amount);

  try {
    // Try to update existing doc
    await postRef.update({ views: increment });
  } catch (err) {
    // If update fails (for example: document does not exist), fall back to set with merge
    console.warn(
      "incrementPostViews: update failed, attempting set with merge",
      err,
    );
    await postRef.set({ views: increment }, { merge: true });
  }

  // Return the current views value after increment
  const snap = await postRef.get();
  const data = snap.data();
  const views =
    typeof data?.views === "number" ? data.views : (data?.views ?? null);
  return views;
}

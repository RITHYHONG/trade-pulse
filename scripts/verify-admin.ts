import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

console.log('--- Firebase Admin Check ---');
console.log('Project ID:', projectId || 'MISSING');
console.log('Client Email:', clientEmail || 'MISSING');
console.log('Has Private Key:', !!privateKey);

if (projectId && clientEmail && privateKey) {
  try {
    privateKey = privateKey.replace(/\\n/g, '\n');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        } as admin.ServiceAccount),
      });
    }
    console.log('SUCCESS: Admin SDK initialized.');
    
    const db = admin.firestore();
    db.collection('posts').limit(1).get()
      .then(snap => {
        console.log('SUCCESS: Firestore access verified. Posts found:', snap.size);
        process.exit(0);
      })
      .catch(err => {
        console.error('ERROR: Firestore access failed:', err.message);
        process.exit(1);
      });
  } catch (err: any) {
    console.error('ERROR: Initialization failed:', err.message);
    process.exit(1);
  }
} else {
  console.error('ERROR: Missing required environment variables.');
  process.exit(1);
}

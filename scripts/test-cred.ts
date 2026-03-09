import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const pkToken = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
if (!pkToken) { console.log('MISSING KEY'); process.exit(1); }

// The most robust way to fix the key from .env
const cleanKey = pkToken.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1');

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: cleanKey,
    } as any)
  });
  console.log('--- HANDSHAKE SUCCESS ---');
} catch (e: any) {
  console.log('--- ERROR ---', e.message);
}

import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

const pk = process.env.FIREBASE_ADMIN_PRIVATE_KEY || '';
const processedPk = pk.replace(/\\n/g, '\n').replace(/"/g, '');

const config = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: processedPk
};

try {
  if (!getApps().length) {
    initializeApp({
      credential: cert(config)
    });
  }
  
  const db = getFirestore();
  const collections = await db.listCollections();
  console.log('--- ADMIN SDK HANDSHAKE: SUCCESS ---');
  console.log('--- FIRESTORE REACHED: ', collections.map(c => c.id).join(', '));
} catch (error: any) {
  console.error('--- ADMIN SDK HANDSHAKE: FAILED ---');
  console.error(error.message);
}

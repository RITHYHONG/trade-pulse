
import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const accountFile = 'trade-pulse-b9fc4-firebase-adminsdk-fbsvc-c881bed5c1.json';
const account = JSON.parse(fs.readFileSync(accountFile, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(account),
  });
}

const db = admin.firestore();

async function listUsers() {
  console.log('--- Listing Users in Firestore ---');
  const snap = await db.collection('users').limit(20).get();
  if (snap.empty) {
    console.log('No users found in collection "users".');
    return;
  }
  snap.docs.forEach(doc => {
    const data = doc.data();
    console.log(`- ${data.email || 'No Email'} (Role: ${data.role || 'user'}) [UID: ${doc.id}]`);
  });
}

listUsers().catch(console.error);

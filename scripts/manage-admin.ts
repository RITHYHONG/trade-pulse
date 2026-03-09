
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

async function manageAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.log('Usage: npx ts-node scripts/manage-admin.ts <email>');
    process.exit(1);
  }

  const userSnap = await db.collection('users').where('email', '==', email).limit(1).get();
  
  if (userSnap.empty) {
    console.log(`User ${email} not found in Firestore.`);
    process.exit(1);
  }

  const userDoc = userSnap.docs[0];
  const userData = userDoc.data();
  
  console.log(`Current Role for ${email}: ${userData.role || 'user'}`);
  
  await userDoc.ref.update({ role: 'admin' });
  console.log(`SUCCESS: User ${email} promoted to admin.`);
}

manageAdmin().catch(console.error);

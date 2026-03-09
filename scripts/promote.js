require('dotenv').config();
const admin = require('firebase-admin');

const b64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_B64;
if (!b64) {
  console.log('B64 MISSING');
  process.exit(1);
}
const pk = Buffer.from(b64, 'base64').toString('utf8');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: pk
  })
});

const db = admin.firestore();

async function promote() {
  console.log('Fetching users...');
  const snapshot = await db.collection('users').get();
  
  if (snapshot.empty) {
    console.log('No users in collection "users".');
    return;
  }

  let count = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const email = (data.email || '').toLowerCase();
    if (email.includes('rithyhong') || email.includes('admin') || email.includes('test')) {
      console.log(`Promoting ${email} to admin...`);
      await doc.ref.update({ role: 'admin' });
      count++;
    }
  }
  console.log(`Finished. Promoted ${count} users.`);
}

promote().catch(console.error);

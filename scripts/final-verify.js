require('dotenv').config();
const admin = require('firebase-admin');
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const b64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_B64;
if (b64) privateKey = Buffer.from(b64, 'base64').toString('utf8');
async function v() {
  try {
    admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
    const db = admin.firestore();
    const colls = await db.listCollections();
    console.log('SUCCESS:', colls.map(c => c.id).join(', '));
  } catch (e) { console.log('FAIL:', e.message); }
}
v();
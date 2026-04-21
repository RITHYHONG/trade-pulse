const admin = require('firebase-admin');
const fs = require('fs');

function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.length === 0 || trimmed[0] === '#') continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val[0] === '"' && val[val.length-1] === '"') || (val[0] === "'" && val[val.length-1] === "'")) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
    return result;
  } catch (e) {
    return {};
  }
}

const envMain = parseEnvFile('./apps/web/.env');
const envLocal = parseEnvFile('./apps/web/.env.local');
const env = Object.assign({}, envMain, envLocal);

const projectId = env.FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKey = env.FIREBASE_ADMIN_PRIVATE_KEY;

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, '\n').trim();
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();

async function checkPost() {
  const postId = 'UKIa02K415wFJFl3u9ad';
  console.log(`Checking post: ${postId}`);
  
  try {
    const doc = await db.collection('posts').doc(postId).get();
    if (!doc.exists) {
      console.log('Post not found');
      return;
    }
    
    const data = doc.data();
    console.log('Post Data:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n--- Market Outlook Fields Check ---');
    console.log('projectedPrice:', data.projectedPrice);
    console.log('volatilityRisk:', data.volatilityRisk);
    console.log('marketSentiment:', data.marketSentiment);
    console.log('technicalAnalysis:', data.technicalAnalysis);
    console.log('recommendation:', data.recommendation);
  } catch (error) {
    console.error('Error fetching post:', error);
  }
}

checkPost();

const admin = require('./node_modules/firebase-admin');
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
    console.error('Could not parse', filePath, ':', e.message);
    return {};
  }
}

const envMain = parseEnvFile('./apps/web/.env');
const envLocal = parseEnvFile('./apps/web/.env.local');
const env = Object.assign({}, envMain, envLocal);

const projectId = env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL;
const rawKey = env.FIREBASE_ADMIN_PRIVATE_KEY;
const b64Key = env.FIREBASE_ADMIN_PRIVATE_KEY_B64;

console.log('PROJECT_ID:', projectId);
console.log('CLIENT_EMAIL:', clientEmail);

// Test B64 key
if (b64Key) {
  const decoded = Buffer.from(b64Key, 'base64').toString('utf8');
  console.log('\nB64 decoded length:', decoded.length);
  console.log('B64 starts with:', decoded.slice(0, 50));
  console.log('B64 ends with:', decoded.slice(-50));
}

// Test raw key
if (rawKey) {
  const processed = rawKey.replace(/\\n/g, '\n').trim();
  console.log('\nRAW KEY length:', processed.length);
  console.log('RAW starts with:', processed.slice(0, 50));
  console.log('RAW ends with:', processed.slice(-50));
  console.log('RAW has real newlines:', processed.includes('\n'));
}

// Now try init with raw key (skip B64 since it was corrupt)
const adminRef = admin.default || admin;

// Try raw first
if (rawKey) {
  console.log('\n--- Trying init with RAW key from .env.local ---');
  const processedKey = rawKey.replace(/\\n/g, '\n').trim();
  try {
    adminRef.initializeApp({
      credential: adminRef.credential.cert({ projectId, clientEmail, privateKey: processedKey }),
    }, 'test-raw');
    console.log('SUCCESS with raw key');
    adminRef.app('test-raw').delete();
  } catch (e) {
    console.error('FAILED with raw key:', e.message);
  }
}

// Try B64
if (b64Key) {
  console.log('\n--- Trying init with B64 key from .env ---');
  const decodedKey = Buffer.from(b64Key, 'base64').toString('utf8').trim();
  try {
    adminRef.initializeApp({
      credential: adminRef.credential.cert({ projectId, clientEmail, privateKey: decodedKey }),
    }, 'test-b64');
    console.log('SUCCESS with B64 key');
    adminRef.app('test-b64').delete();
  } catch (e) {
    console.error('FAILED with B64 key:', e.message);
  }
}

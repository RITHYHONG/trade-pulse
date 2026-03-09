import fs from 'fs';
import * as dotenv from 'dotenv';

const envRaw = fs.readFileSync('.env', 'utf8');
const account = JSON.parse(fs.readFileSync('trade-pulse-b9fc4-firebase-adminsdk-fbsvc-c881bed5c1.json', 'utf8'));

let lines = envRaw.split('\n');
lines = lines.filter(l => !l.startsWith('FIREBASE_ADMIN_PRIVATE_KEY'));

// Write key WITHOUT quotes to .env
const pk = account.private_key.replace(/\n/g, '\\n');
lines.push(`FIREBASE_ADMIN_PRIVATE_KEY=${pk}`);

fs.writeFileSync('.env', lines.join('\n'));
console.log('--- .env CLEANED AND REWRITTEN ---');

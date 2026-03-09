const fs = require('fs');
const account = JSON.parse(fs.readFileSync('trade-pulse-b9fc4-firebase-adminsdk-fbsvc-c881bed5c1.json', 'utf8'));
const envRaw = fs.readFileSync('.env', 'utf8');

// Filter out all related lines
const lines = envRaw.split('\n').filter(l => {
  const trim = l.trim();
  return !trim.startsWith('FIREBASE_ADMIN_') && !trim.startsWith('-----') && (trim.length > 5);
});

lines.push('FIREBASE_ADMIN_PROJECT_ID=trade-pulse-b9fc4');
lines.push('FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@trade-pulse-b9fc4.iam.gserviceaccount.com');

// BASE64 ENCODE THE WHOLE PRIVATE KEY
const pkBase64 = Buffer.from(account.private_key).toString('base64');
lines.push('FIREBASE_ADMIN_PRIVATE_KEY_B64=' + pkBase64);

fs.writeFileSync('.env', lines.join('\n'));
console.log('--- ENV OVERHAULED (BASE64) ---');

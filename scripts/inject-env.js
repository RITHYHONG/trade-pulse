const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'trade-pulse-b9fc4-firebase-adminsdk-fbsvc-c881bed5c1.json');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(jsonPath)) {
  const account = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let env = fs.readFileSync(envPath, 'utf8');

  // CLEANUP EXISTING ADMIN VARS
  env = env.replace(/^FIREBASE_ADMIN_.*$/gm, '').trim();

  // APPEND CLEAN VARS
  env += '\n\n# Firebase Admin (Service Account)';
  env += `\nFIREBASE_ADMIN_PROJECT_ID="${account.project_id}"`;
  env += `\nFIREBASE_ADMIN_CLIENT_EMAIL="${account.client_email}"`;
  env += `\nFIREBASE_ADMIN_PRIVATE_KEY="${account.private_key.replace(/\n/g, '\\n')}"`;

  fs.writeFileSync(envPath, env);
  console.log('--- .env INJECTED SUCCESSFULLY ---');
} else {
  console.error('JSON FILE NOT FOUND');
}

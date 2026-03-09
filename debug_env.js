require('dotenv').config();
const pk = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
console.log('LENGTH:', pk ? pk.length : 'NULL');
if (pk) console.log('LAST 10:', JSON.stringify(pk.slice(-10)));
import { adminDb } from '../src/lib/firebase-admin';

async function main() {
  console.log('Starting migration: setting views to 0 where missing...');
  const postsSnapshot = await adminDb.collection('posts').get();
  console.log(`Found ${postsSnapshot.size} posts`);

  let updated = 0;

  for (const doc of postsSnapshot.docs) {
    const data = doc.data();
    if (typeof data.views !== 'number') {
      await doc.ref.update({ views: 0 });
      updated++;
      console.log(`Updated ${doc.id} -> views: 0`);
    }
  }

  console.log(`Migration complete. Updated ${updated} documents.`);
}

main().catch((err) => {
  console.error('Migration error', err);
  process.exit(1);
});
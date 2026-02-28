import { adminApp, adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email || '').toLowerCase();
    const source = body?.source || 'unknown';

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
    }

    // Prevent duplicates
    const existing = await adminDb.collection('newsletter_subscribers').where('email', '==', email).limit(1).get();
    if (!existing.empty) {
      return new Response(JSON.stringify({ error: 'Already subscribed' }), { status: 409 });
    }

    await adminDb.collection('newsletter_subscribers').add({
      email,
      source,
      createdAt: adminApp.firestore.FieldValue.serverTimestamp(),
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    console.error('newsletter subscribe error', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

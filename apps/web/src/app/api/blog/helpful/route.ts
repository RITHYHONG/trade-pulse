import { NextRequest, NextResponse } from 'next/server';
import { incrementPostHelpful } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, delta } = body || {};

    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    if (typeof delta !== 'number' || ![1, -1].includes(delta)) {
      return NextResponse.json({ error: 'Missing or invalid delta' }, { status: 400 });
    }

    const helpfulCount = await incrementPostHelpful(postId, delta);
    return NextResponse.json({ success: true, helpfulCount });
  } catch (err) {
    console.error('Error incrementing helpful feedback:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

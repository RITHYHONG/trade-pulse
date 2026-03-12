import { NextRequest, NextResponse } from 'next/server';
import { incrementPostViews } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId } = body || {};

    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    // TODO: implement rate-limiting / dedupe (per-anonId / per-IP / per-cookie TTL)

    const views = await incrementPostViews(postId, 1);

    return NextResponse.json({ success: true, views });
  } catch (err) {
    console.error('Error incrementing post views:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

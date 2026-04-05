import { NextResponse } from 'next/server';

declare global {
  var __WATCHLIST__: Map<string, Set<string>> | undefined;
}

type WatchlistStore = Map<string, Set<string>>;

const WATCHLIST: WatchlistStore = globalThis.__WATCHLIST__ || new Map();
// persist in global for dev hot reload
globalThis.__WATCHLIST__ = WATCHLIST;

function getSessionId(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/watchlist-session=([^;]+)/);
  if (match) return match[1];
  return null;
}

export async function GET(req: Request) {
  let session = getSessionId(req);
  if (!session) {
    session = crypto.randomUUID();
    const res = NextResponse.json({ watchlist: [] });
    res.headers.set('Set-Cookie', `watchlist-session=${session}; Path=/; HttpOnly`);
    return res;
  }

  const set = WATCHLIST.get(session) || new Set<string>();
  return NextResponse.json({ watchlist: Array.from(set) });
}

export async function POST(req: Request) {
  const session = getSessionId(req) || crypto.randomUUID();
  const body = await req.json().catch(() => ({}));
  const slug = body?.slug;
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const set = WATCHLIST.get(session) || new Set<string>();
  set.add(slug);
  WATCHLIST.set(session, set);

  const res = NextResponse.json({ watchlist: Array.from(set) });
  res.headers.set('Set-Cookie', `watchlist-session=${session}; Path=/; HttpOnly`);
  return res;
}

export async function DELETE(req: Request) {
  const session = getSessionId(req);
  const body = await req.json().catch(() => ({}));
  const slug = body?.slug;
  if (!session) return NextResponse.json({ error: 'No session' }, { status: 400 });
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const set = WATCHLIST.get(session);
  if (set) {
    set.delete(slug);
    WATCHLIST.set(session, set);
  }

  return NextResponse.json({ watchlist: Array.from(set || []) });
}

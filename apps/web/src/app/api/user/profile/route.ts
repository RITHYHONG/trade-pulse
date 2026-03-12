import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, saveUserProfile } from '../../../../lib/firestore-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return NextResponse.json({ error: 'UID is required' }, { status: 400 });
  }

  try {
    const profile = await getUserProfile(uid);
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, profileData } = body;

    if (!uid || !profileData) {
      return NextResponse.json({ error: 'UID and profile data are required' }, { status: 400 });
    }

    await saveUserProfile(uid, profileData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
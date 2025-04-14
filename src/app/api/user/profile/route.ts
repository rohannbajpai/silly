import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

// Get user profile
export async function GET(request: Request) {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!auth || !db) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized' },
        { status: 500 }
      );
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    const { uid } = decodedToken;

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    return NextResponse.json({
      profile: userData?.profile,
      stats: userData?.stats,
      blobby: userData?.blobby,
      onboardingCompleted: userData?.onboardingCompleted,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: Request) {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!auth || !db) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized' },
        { status: 500 }
      );
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    const { uid } = decodedToken;

    const body = await request.json();
    const { profile, stats, blobby } = body;

    // Update user profile in Firestore
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      profile,
      stats,
      blobby,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

// Update specific fields in user profile
export async function PATCH(request: Request) {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!auth || !db) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized' },
        { status: 500 }
      );
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    const { uid } = decodedToken;

    const body = await request.json();
    const updates = body;

    // Update user profile in Firestore
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
} 
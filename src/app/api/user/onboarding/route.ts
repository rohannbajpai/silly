import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';

export async function PUT(request: Request) {
  try {
    // Verify auth token
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

    // Get request body
    const body = await request.json();
    const { vibe, focusAreas, learningStyle, timeCommitment } = body;

    // Validate required fields
    if (!vibe || !focusAreas || !learningStyle || !timeCommitment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update user profile in Firestore
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      'profile.vibe': vibe,
      'profile.focusAreas': focusAreas,
      'profile.learningStyle': learningStyle,
      'profile.timeCommitment': timeCommitment,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating onboarding data:', error);
    return NextResponse.json(
      { error: 'Failed to update onboarding data' },
      { status: 500 }
    );
  }
} 
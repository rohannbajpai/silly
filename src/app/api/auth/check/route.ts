import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase-admin';

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

// Check if a user is logged in
export async function GET() {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!auth) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized' },
        { status: 500 }
      );
    }

    // Verify the session cookie
    await auth.verifySessionCookie(sessionCookie);
    
    // If verification succeeded, user is authenticated
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Error verifying auth status:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
} 
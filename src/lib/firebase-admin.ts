import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const apps = getApps();

let auth: Auth | undefined;
let db: Firestore | undefined;

if (!apps.length) {
  // Check if all required environment variables are present
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      'Firebase Admin SDK credentials are missing. Some server-side features will not work.'
    );
  } else {
    try {
      const app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });

      auth = getAuth(app);
      db = getFirestore(app);
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
    }
  }
}

// Create mock implementations for development when Firebase Admin is not initialized
if (!auth) {
  auth = {
    verifySessionCookie: async () => ({ uid: 'mock-uid' }),
    createSessionCookie: async (idToken: string, options: { expiresIn: number }) => 'mock-session-cookie',
  } as unknown as Auth;
}

if (!db) {
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        update: async () => {},
        delete: async () => {},
      }),
      where: () => ({
        get: async () => ({ docs: [] }),
      }),
      add: async () => ({ id: 'mock-id' }),
    }),
  } as unknown as Firestore;
}

export { auth, db }; 
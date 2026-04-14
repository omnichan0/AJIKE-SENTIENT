import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, signOut, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import the real Firebase configuration from the root
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
// Use the specific firestoreDatabaseId if provided in the config
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Set persistence to local to handle refresh better
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error("Auth persistence error:", err);
});

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
  try {
    return await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
    if (error.code === 'auth/network-request-failed') {
      console.error("Network request failed. This often happens if the domain is not allowlisted in Firebase Console > Authentication > Settings > Authorized Domains.");
    }
    throw error;
  }
};

export const logout = () => signOut(auth);

export { onAuthStateChanged };
export type { User };

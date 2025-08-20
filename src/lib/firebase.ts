import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if config is available
let app;
let auth: ReturnType<typeof getAuth>;
let googleProvider: GoogleAuthProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  // Optional: Add additional scopes
  googleProvider.addScope('profile');
  googleProvider.addScope('email');
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.warn('Google Sign-In will not be available');
}

/**
 * Sign in with Google using popup
 */
export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !googleProvider) {
    throw new Error('Firebase is not initialized');
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    // Handle specific errors
    if (error.code === 'auth/popup-blocked') {
      // Fallback to redirect method
      return signInWithGoogleRedirect();
    }
    throw error;
  }
}

/**
 * Sign in with Google using redirect (mobile-friendly)
 */
export async function signInWithGoogleRedirect(): Promise<User | null> {
  if (!auth || !googleProvider) {
    throw new Error('Firebase is not initialized');
  }
  
  await signInWithRedirect(auth, googleProvider);
  return null; // Will handle result in checkRedirectResult
}

/**
 * Check for redirect result (call on app load)
 */
export async function checkRedirectResult(): Promise<User | null> {
  if (!auth) return null;
  
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error('Redirect result error:', error);
    return null;
  }
}

/**
 * Sign out from Firebase
 */
export async function signOut(): Promise<void> {
  if (!auth) return;
  
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current Firebase user
 */
export function getCurrentFirebaseUser(): User | null {
  if (!auth) return null;
  return auth.currentUser;
}

/**
 * Get ID token for backend authentication
 */
export async function getIdToken(): Promise<string | null> {
  if (!auth || !auth.currentUser) return null;
  
  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
}

export { auth, googleProvider };
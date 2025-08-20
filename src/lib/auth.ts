import { api } from './api';
import { useStore } from './store';
import { 
  signInWithGoogle as firebaseSignInWithGoogle,
  signOut as firebaseSignOut,
  getIdToken,
  checkRedirectResult
} from './firebase';

export async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login', { email, password });
  const { token, user } = response.data;
  useStore.getState().setAuth(token, user);
  return response.data;
}

export async function register(email: string, password: string) {
  const response = await api.post('/api/auth/register', { email, password });
  const { token, user } = response.data;
  useStore.getState().setAuth(token, user);
  return response.data;
}

export async function loginAsGuest() {
  const response = await api.post('/api/auth/guest');
  const { token, user } = response.data;
  useStore.getState().setAuth(token, user);
  return response.data;
}

export async function signInWithGoogle() {
  try {
    // First, sign in with Firebase
    const firebaseUser = await firebaseSignInWithGoogle();
    
    if (!firebaseUser) {
      // Redirect method was used, will handle on page load
      return null;
    }
    
    // Get the ID token
    const idToken = await getIdToken();
    
    if (!idToken) {
      throw new Error('Failed to get authentication token');
    }
    
    // Send the ID token to our backend
    const response = await api.post('/api/auth/google', { idToken });
    const { token, user } = response.data;
    
    // Store the JWT token from our backend
    useStore.getState().setAuth(token, user);
    
    return response.data;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    
    // Sign out from Firebase if backend auth failed
    await firebaseSignOut();
    
    // Handle specific errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your connection.');
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error('Failed to sign in with Google');
  }
}

export async function handleGoogleRedirectResult() {
  try {
    const firebaseUser = await checkRedirectResult();
    
    if (!firebaseUser) {
      return null;
    }
    
    // Get the ID token
    const idToken = await getIdToken();
    
    if (!idToken) {
      throw new Error('Failed to get authentication token');
    }
    
    // Send the ID token to our backend
    const response = await api.post('/api/auth/google', { idToken });
    const { token, user } = response.data;
    
    // Store the JWT token from our backend
    useStore.getState().setAuth(token, user);
    
    return response.data;
  } catch (error) {
    console.error('Google redirect result error:', error);
    await firebaseSignOut();
    return null;
  }
}

export async function logout() {
  // Sign out from Firebase if user was signed in with Google
  await firebaseSignOut();
  
  // Clear local auth state
  useStore.getState().logout();
}

export async function getCurrentUser() {
  const response = await api.get('/api/auth/me');
  return response.data;
}
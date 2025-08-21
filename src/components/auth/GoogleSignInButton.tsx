import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useStore } from '../../lib/store';

interface GoogleSignInButtonProps {
  mode: 'login' | 'register';
}

export function GoogleSignInButton({ mode }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load the Google Sign-In script if not already loaded
      if (!window.gapi) {
        await loadGoogleScript();
      }

      // Initialize Google Sign-In
      await initializeGoogleSignIn();

      // Trigger Google Sign-In
      const googleUser = await signInWithGoogle();
      const idToken = googleUser.getAuthResponse().id_token;

      // Send token to backend
      const response = await api.post('/api/auth/google', { idToken });
      const { token, user } = response.data;
      
      // Store auth data
      setAuth(token, user);
      
      // Navigate to home
      navigate('/');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.response?.status === 503) {
        setError('Google Sign-In is not configured. Please use email/password authentication.');
      } else {
        setError(err.response?.data?.error || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="text-red-600 text-sm text-center mb-2">
          {error}
        </div>
      )}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="text-gray-600">Signing in...</span>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700">
              {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
            </span>
          </>
        )}
      </button>
    </>
  );
}

// Google Sign-In helper functions
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (document.getElementById('google-signin-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-signin-script';
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
    document.body.appendChild(script);
  });
}

function initializeGoogleSignIn(): Promise<void> {
  return new Promise((resolve, reject) => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        scope: 'profile email'
      }).then(() => {
        resolve();
      }).catch((error: any) => {
        reject(error);
      });
    });
  });
}

function signInWithGoogle(): Promise<any> {
  return new Promise((resolve, reject) => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser: any) => {
      resolve(googleUser);
    }).catch((error: any) => {
      reject(error);
    });
  });
}
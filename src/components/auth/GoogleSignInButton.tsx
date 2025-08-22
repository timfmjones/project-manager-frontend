import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useStore } from '../../lib/store';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  mode?: 'signin' | 'signup';
}

export function GoogleSignInButton({ mode = 'signin' }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);

  useEffect(() => {
    // Load the Google Identity Services library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the button
        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: mode === 'signup' ? 'signup_with' : 'signin_with',
          });
        }
      }
    };

    return () => {
      // Cleanup
      const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, [mode]);

  const handleCredentialResponse = async (response: any) => {
    try {
      // Send the credential to your backend
      const result = await api.post('/api/auth/google', {
        credential: response.credential,
      });

      const { token, user } = result.data;
      setAuth(token, user);
      navigate('/');
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      // You might want to show an error message to the user
      alert(error.response?.data?.error || 'Google Sign-In failed. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="mt-4">
        <div ref={buttonRef} className="flex justify-center"></div>
      </div>
    </div>
  );
}
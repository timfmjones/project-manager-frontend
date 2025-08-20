import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAsGuest } from '../../lib/auth';

export function GuestCTA() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      navigate('/');
    } catch (error) {
      console.error('Guest login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center pt-4 border-t">
      <p className="text-sm text-gray-600 mb-2">Just want to try it out?</p>
      <button
        onClick={handleGuestLogin}
        disabled={loading}
        className="text-blue-600 hover:underline text-sm"
      >
        {loading ? 'Loading...' : 'Continue as Guest'}
      </button>
    </div>
  );
}
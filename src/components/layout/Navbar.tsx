import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { logout } from '../../lib/auth';

export function Navbar() {
  const { user } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getUserDisplay = () => {
    if (!user) return null;
    
    if (user.isGuest) {
      return 'Guest User';
    }
    
    if (user.displayName) {
      return user.displayName;
    }
    
    return user.email;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            ProjectMind
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              {user.photoUrl && (
                <img
                  src={user.photoUrl}
                  alt={user.displayName || user.email}
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="text-sm text-gray-600">
                {getUserDisplay()}
              </span>
              {user.isGoogleUser && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  Google
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
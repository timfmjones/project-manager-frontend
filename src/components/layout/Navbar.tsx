import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';

export function Navbar() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
              <span className="text-sm text-gray-600">
                {user.isGuest ? 'Guest User' : user.email}
              </span>
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
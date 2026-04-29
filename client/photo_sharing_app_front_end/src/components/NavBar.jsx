// components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl transform transition-transform group-hover:scale-110">📸</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PhotoVault
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Home
            </Link>
            
            {!isAuthenticated ? (
              <>
                <Link to="/signup" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:shadow-lg transition shadow-md"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  Dashboard
                </Link>
                <Link to="/uploads" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  Upload
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition font-medium"
                >
                  Logout
                </button>
                
                {/* User Avatar - Just for display, no dropdown */}
                <div className="flex items-center space-x-2 ml-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                    {user?.name?.split(' ')[0]}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
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
    <nav className="flex justify-between items-center p-6 bg-slate-900 text-white shadow-lg">
      <Link to="/" className="text-xl font-bold tracking-tight">PhotoVault</Link>
      
      <div className="space-x-6 flex items-center">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        
        {!isAuthenticated ? (
          <>
            <Link to="/signup" className="hover:text-blue-400 transition">Sign Up</Link>
            <Link to="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
            <Link to="/uploads" className="hover:text-blue-400 transition">Upload</Link>
            
            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 hover:text-blue-400 transition">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden hidden group-hover:block">
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-slate-900 text-white shadow-lg">
      <Link to="/" className="text-xl font-bold tracking-tight">PhotoVault</Link>
      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-400">Home</Link>
        {!token ? (
          <>
            <Link to="/signup" className="hover:text-blue-400">Sign Up</Link>
            <Link to="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Login</Link>
          </>
        ) : (
          <>
            <Link to="/uploads" className="hover:text-blue-400">Upload</Link>
            <button onClick={logout} className="text-red-400 hover:text-red-300">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
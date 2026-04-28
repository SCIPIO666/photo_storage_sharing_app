import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/users/auth/log-in', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/uploads');
    } catch (err) {
      alert('Invalid credentials',err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input className="w-full p-3 border rounded" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-3 border rounded" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition">Login</button>
      </form>
    </div>
  );
}
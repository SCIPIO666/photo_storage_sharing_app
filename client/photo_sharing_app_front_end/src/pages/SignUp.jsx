import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/users', formData);
      alert('Account created! Please login.');
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-3 border rounded" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} />
        <input className="w-full p-3 border rounded" type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} />
        <input className="w-full p-3 border rounded" type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} />
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">Register</button>
      </form>
    </div>
  );
}
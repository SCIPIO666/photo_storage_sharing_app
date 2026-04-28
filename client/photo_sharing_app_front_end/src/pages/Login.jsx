// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            console.log('Attempting login with:', { email });
            
            const res = await axios.post('http://localhost:3000/users/auth/log-in', { 
                email, 
                password 
            });
            
            // Log the entire response to see what we're getting
            console.log('Full login response:', res);
            console.log('Response data:', res.data);
            console.log('Response status:', res.status);
            console.log('Response headers:', res.headers);
            
            // Check different possible token locations
            const token = res.data.token || res.data.accessToken || res.data.jwt;
            
            if (token) {
                console.log('Token found:', token.substring(0, 30) + '...');
                localStorage.setItem('token', token);
                
                // Verify storage
                const storedToken = localStorage.getItem('token');
                console.log('Token stored successfully:', !!storedToken);
                
                alert('Login successful!');
                navigate('/uploads');
            } else {
                console.error('No token in response. Response structure:', Object.keys(res.data));
                alert('No token received from server. Please check server response.');
            }
            
        } catch (err) {
            console.error('Login error details:', err);
            
            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
                alert(err.response.data?.error || err.response.data?.message || 'Login failed');
            } else if (err.request) {
                console.error('No response received:', err.request);
                alert('Server not responding. Please check if backend is running.');
            } else {
                console.error('Error:', err.message);
                alert(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white border rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                    className="w-full p-3 border rounded" 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)} 
                    required
                    disabled={loading}
                />
                <input 
                    className="w-full p-3 border rounded" 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)} 
                    required
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
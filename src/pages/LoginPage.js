import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful!');
        navigate('/');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card max-w-lg w-full p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="pill">Welcome back</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2">Sign in to continue</h2>
        <p className="text-slate-400 mb-8">Access your library, orders, and admin tools.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          New here?{' '}
          <button onClick={() => navigate('/signup')} className="text-purple-200 font-semibold underline">
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

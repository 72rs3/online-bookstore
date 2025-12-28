import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Signup successful! Please login.');
        navigate('/login');
      } else {
        alert(data.error || 'Signup failed');
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
          <span className="pill">Join the club</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2">Create your account</h2>
        <p className="text-slate-400 mb-8">Unlock curated picks, orders, and admin tools.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Username</label>
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
            Sign up
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-purple-200 font-semibold underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

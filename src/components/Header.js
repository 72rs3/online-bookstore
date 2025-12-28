import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart } from '../utils/cart';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [cartCount, setCartCount] = useState(getCart().reduce((sum, item) => sum + (item.qty || 0), 0));

  useEffect(() => {
    const refresh = () => setCartCount(getCart().reduce((sum, item) => sum + (item.qty || 0), 0));
    window.addEventListener('storage', refresh);
    const id = setInterval(refresh, 1000);
    return () => {
      window.removeEventListener('storage', refresh);
      clearInterval(id);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(15,23,42,0.72)] border-b border-white/10">
      <div className="page-shell py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-400 shadow-lg shadow-purple-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Fareed</span>
            <span className="text-2xl font-extrabold tracking-tight text-white">Bookshop</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-200">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/services" className="hover:text-white transition">Services</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative hover:text-white transition flex items-center gap-2 text-sm font-semibold text-slate-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l1 7h12l1-7h2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13h10l-1 8H8l-1-8z" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-3 -top-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-white">{user.username}</span>
                <span className="text-xs text-slate-400 capitalize">{user.role}</span>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 bg-white/10 p-2 rounded-full hover:bg-white/16 transition border border-white/10">
                  <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-3 w-52 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-xl">Admin Dashboard</Link>
                    )}
                    <Link to="/orders" className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-xl">My Orders</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-xl">Profile Settings</Link>
                    <hr className="my-2 border-white/10" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-300 hover:bg-rose-500/10 rounded-xl">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition">Login</Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-blue-400 rounded-xl hover:opacity-95 transition shadow-lg shadow-purple-500/30">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

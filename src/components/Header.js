import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gray-900">
            Fareed<span className="text-blue-600">Books</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition">About</Link>
          <Link to="/services" className="text-gray-600 hover:text-blue-600 font-medium transition">Services</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition">Contact</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-gray-900">{user.username}</span>
                <span className="text-xs text-gray-500 capitalize">{user.role}</span>
              </div>
              <div className="relative group">
                <button className="flex items-center space-x-1 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Admin Dashboard</Link>
                    )}
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">My Orders</Link>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Profile Settings</Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition">Login</Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-200">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

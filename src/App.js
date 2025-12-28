import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPanel from './pages/AdminPanel';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';

const App = () => {
  const location = useLocation();
  const hideChrome = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen text-slate-100">
      {!hideChrome && <Header />}
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* The dynamic page, using a URL parameter for the book ID */}
          <Route path="/book/:bookId" element={<BookDetailPage />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

export default App;

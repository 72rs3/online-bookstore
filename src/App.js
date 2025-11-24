import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

const App = () => {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '50px' }}>
      <Header />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* The dynamic page, using a URL parameter for the book ID */}
          <Route path="/book/:bookId" element={<BookDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

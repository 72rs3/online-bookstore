import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../utils/cart';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', ...new Set(books.map(book => book.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4" />
          <p className="text-slate-300 font-medium">Curating your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[28px] card">
        <div className="absolute inset-0 opacity-50">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000"
            alt="Library"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-slate-900/40" />
        <div className="relative z-10 text-left page-shell py-16">
          <div className="pill mb-6 w-fit">Curated reads • Fast delivery</div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight max-w-3xl">
            Your next great <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">adventure</span> starts here.
          </h1>
          <p className="text-lg text-slate-200/90 mb-10 max-w-2xl leading-relaxed">
            Explore modern hits and timeless classics with a bookstore that feels tailor-made for your shelf.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl">
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full sm:flex-1 px-5 py-3 rounded-xl text-white placeholder:text-slate-400 bg-white/10 border border-white/10 focus:ring-4 focus:ring-purple-500/40 outline-none shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-primary w-full sm:w-auto">
              Search Catalog
            </button>
          </div>
        </div>
      </div>

      <div className="page-shell">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between mb-10 gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Featured</p>
            <h2 className="text-3xl font-extrabold text-white">Collections picked for you</h2>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 border-transparent shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 text-slate-200 border-white/10 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map(book => (
              <Link to={`/book/${book.id}`} key={book.id} className="group">
                <div className="card overflow-hidden hover:-translate-y-2 transition-all duration-500">
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                    <img
                      src={book.coverImage || 'https://via.placeholder.com/400x600?text=No+Cover'}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white font-semibold text-xs bg-white/15 px-3 py-1 rounded-lg border border-white/10">View details</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-[11px] font-extrabold text-purple-200 uppercase tracking-[0.2em]">{book.category}</div>
                    <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-purple-200 transition">{book.title}</h3>
                    <p className="text-slate-400 text-sm">by {book.author}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-2xl font-black text-white">
                        {isNaN(Number(book.price)) ? '$—' : `$${Number(book.price).toFixed(2)}`}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(book);
                        }}
                        className="text-xs font-bold text-purple-200 hover:text-white underline"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 card">
            <h3 className="text-2xl font-bold text-white mb-2">No books found</h3>
            <p className="text-slate-400">Try a different search or reset your filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="btn-primary mt-6"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

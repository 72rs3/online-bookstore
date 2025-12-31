import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Curating your library...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 py-24 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" alt="Library" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Your Next Great <span className="text-blue-500">Adventure</span> Awaits
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore thousands of titles from world-renowned authors. From timeless classics to modern masterpieces, find the perfect book for your journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:ring-4 focus:ring-blue-500/50 outline-none shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition shadow-xl shadow-blue-600/20">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between mb-12 gap-6">
          <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition whitespace-nowrap ${
                  selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredBooks.map(book => (
              <Link to={`/book/${book.id}`} key={book.id} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img 
                      src={book.coverImage || 'https://via.placeholder.com/400x600?text=No+Cover'} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-bold text-sm bg-blue-600 px-3 py-1 rounded-lg">View Details</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{book.category}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition">{book.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">by {book.author}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-2xl font-black text-gray-900">${book.price.toFixed(2)}</span>
                      <div className="flex text-yellow-400 text-xs">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500">We couldn't find any books matching your criteria.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

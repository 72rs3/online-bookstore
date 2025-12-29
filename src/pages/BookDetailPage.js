import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import BOOKS from '../data/books';
import { useEffect } from 'react';

const BookDetailPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/books`)
      .then(res => res.json())
      .then(data => {
        const foundBook = data.find(b => b.id.toString() === bookId);
        setBook(foundBook);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [bookId]);

  if (loading) return <div className="p-20 text-center">Loading book details...</div>;

  if (!book) {
    return <div className="container mx-auto p-8 text-center"><h2>Book Not Found</h2></div>;
  }

  const handleBuyNow = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    setOrderLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          book_id: book.id,
          quantity: 1,
          total_price: book.price
        }),
      });

      if (response.ok) {
        alert('Order placed successfully! Check your email for confirmation.');
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <img src={book.coverImage} alt={book.title} className="w-full md:w-64 h-auto shadow-lg rounded" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <h2 className="text-xl text-gray-600 mb-4">by {book.author}</h2>
          <p className="text-2xl font-bold text-red-700 mb-4">${book.price.toFixed(2)}</p>
          <div className="space-y-2 mb-6">
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>Status:</strong> <span className={book.inStock ? 'text-green-600' : 'text-red-600'}>{book.inStock ? 'In Stock' : 'Out of Stock'}</span></p>
          </div>
          <p className="text-gray-700 leading-relaxed mb-8">{book.description}</p>
          <button 
            onClick={handleBuyNow}
            disabled={!book.inStock || orderLoading}
            className={`px-8 py-3 rounded-lg font-bold text-white transition ${book.inStock ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {orderLoading ? 'Processing...' : (book.inStock ? 'Buy Now' : 'Out of Stock')}
          </button>
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-2xl font-bold mb-6">Customer Reviews ({book.reviews.length})</h3>
        {book.reviews.length > 0 ? (
          <div className="space-y-4">
            {book.reviews.map(review => (
              <div key={review.id} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{review.user}</span>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first to review this book!</p>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;

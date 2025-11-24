import React from 'react';
import { useParams } from 'react-router-dom';
import BOOKS from '../data/books';

const BookDetailPage = () => {
  const { bookId } = useParams();
  const book = BOOKS.find(b => b.id === bookId);

  if (!book) {
    return <h2>Book Not Found</h2>;
  }

  return (
    <div style={containerStyle}>
      <div style={bookInfoStyle}>
        <img src={book.coverImage} alt={book.title} style={imageStyle} />
        <div>
          <h1>{book.title}</h1>
          <h2>by {book.author}</h2>
          <p style={priceStyle}>${book.price.toFixed(2)}</p>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Status:</strong> {book.inStock ? 'In Stock' : 'Out of Stock'}</p>
          <p style={descriptionStyle}>{book.description}</p>
          <button style={buttonStyle} disabled={!book.inStock}>
            {book.inStock ? 'Add to Cart' : 'Notify Me'}
          </button>
        </div>
      </div>

      <div style={reviewsStyle}>
        <h3>Customer Reviews ({book.reviews.length})</h3>
        {book.reviews.length > 0 ? (
          book.reviews.map(review => (
            <div key={review.id} style={reviewCardStyle}>
              <p><strong>{review.user}</strong> - Rating: {review.rating}/5</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this book!</p>
        )}
      </div>
    </div>
  );
};

// Basic inline styles for demonstration
const containerStyle = {
  maxWidth: '900px',
  margin: '0 auto',
};

const bookInfoStyle = {
  display: 'flex',
  gap: '30px',
  marginBottom: '40px',
  alignItems: 'flex-start',
};

const imageStyle = {
  width: '250px',
  height: 'auto',
  flexShrink: 0,
  backgroundColor: '#eee',
};

const priceStyle = {
  fontSize: '1.5em',
  color: '#b12704',
  fontWeight: 'bold',
};

const descriptionStyle = {
  lineHeight: '1.6',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '1em',
  backgroundColor: '#ff9900',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '15px',
};

const reviewsStyle = {
  borderTop: '1px solid #ccc',
  paddingTop: '20px',
};

const reviewCardStyle = {
  border: '1px solid #eee',
  padding: '15px',
  marginBottom: '10px',
  borderRadius: '5px',
};

export default BookDetailPage;

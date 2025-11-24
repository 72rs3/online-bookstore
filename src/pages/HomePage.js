import React from 'react';
import BOOKS from '../data/books';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h2>Welcome to Fareed Al Sayegh Book Shop</h2>
      <p>Browse our featured collection of books below.</p>
      <div style={bookListStyle}>
        {BOOKS.map(book => (
          <div key={book.id} style={bookCardStyle}>
            <img src={book.coverImage} alt={book.title} style={imageStyle} />
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <p>Price: ${book.price.toFixed(2)}</p>
            <Link to={`/book/${book.id}`} style={buttonStyle}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Basic inline styles for demonstration
const bookListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  marginTop: '20px',
};

const bookCardStyle = {
  border: '1px solid #ccc',
  padding: '15px',
  width: '200px',
  textAlign: 'center',
};

const imageStyle = {
  width: '100%',
  height: 'auto',
  marginBottom: '10px',
  backgroundColor: '#eee', // Placeholder for missing image
};

const buttonStyle = {
  display: 'inline-block',
  padding: '8px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  marginTop: '10px',
};

export default HomePage;

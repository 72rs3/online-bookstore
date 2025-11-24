import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1 style={logoStyle}><Link to="/" style={linkStyle}>Fareed Al Sayegh Book Shop</Link></h1>
      <nav>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/" style={linkStyle}>Home</Link></li>
          <li style={liStyle}><Link to="/about" style={linkStyle}>About</Link></li>
          <li style={liStyle}><Link to="/services" style={linkStyle}>Services</Link></li>
          <li style={liStyle}><Link to="/contact" style={linkStyle}>Contact</Link></li>
          <li style={liStyle}><Link to="/book/978-0321765723" style={linkStyle}>Dynamic Book Example</Link></li>
        </ul>
      </nav>
    </header>
  );
};

// Basic inline styles for demonstration (replace with CSS/Tailwind/Bootstrap)
const headerStyle = {
  background: '#333',
  color: '#fff',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  margin: 0,
  fontSize: '1.5em',
};

const ulStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
};

const liStyle = {
  marginLeft: '20px',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
};

export default Header;

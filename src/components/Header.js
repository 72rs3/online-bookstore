import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Logged out successfully');
    navigate('/login');
  };

  return (
    <header style={headerStyle}>
      <h1 style={logoStyle}><Link to="/" style={linkStyle}>Fareed Al Sayegh Book Shop</Link></h1>
      <nav>
        <ul style={ulStyle}>
          <li style={liStyle}><Link to="/" style={linkStyle}>Home</Link></li>
          <li style={liStyle}><Link to="/about" style={linkStyle}>About</Link></li>
          <li style={liStyle}><Link to="/services" style={linkStyle}>Services</Link></li>
          <li style={liStyle}><Link to="/contact" style={linkStyle}>Contact</Link></li>
          {user ? (
            <>
              {user.role === 'admin' && (
                <li style={liStyle}><Link to="/admin" style={linkStyle}>Admin Panel</Link></li>
              )}
              <li style={liStyle}><Link to="/orders" style={linkStyle}>My Orders</Link></li>
              <li style={liStyle}><Link to="/profile" style={linkStyle}>Profile</Link></li>
              <li style={liStyle}><span style={linkStyle}>Welcome, {user.username}</span></li>
              <li style={liStyle}><button onClick={handleLogout} style={logoutButtonStyle}>Logout</button></li>
            </>
          ) : (
            <>
              <li style={liStyle}><Link to="/login" style={linkStyle}>Login</Link></li>
              <li style={liStyle}><Link to="/signup" style={linkStyle}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

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
  alignItems: 'center',
};

const liStyle = {
  marginLeft: '20px',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const logoutButtonStyle = {
  background: '#f44336',
  color: '#fff',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default Header;

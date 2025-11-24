import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} Fareed Al Sayegh Book Shop Project. All rights reserved.</p>
    </footer>
  );
};

// Basic inline styles for demonstration
const footerStyle = {
  background: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '10px 0',
  position: 'fixed',
  bottom: 0,
  width: '100%',
};

export default Footer;

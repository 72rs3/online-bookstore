import React from 'react';

const ContactPage = () => {
  return (
    <div>
      <h2>Contact Fareed Al Sayegh Book Shop</h2>
      <p>We'd love to hear from you! Please use the form below or contact us directly.</p>
      <form style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="5" required style={inputStyle}></textarea>
        </div>
        <button type="submit" style={buttonStyle}>Send Message</button>
      </form>
      <p>Email: info@fareedalsayeghbooks.com</p>
      <p>Phone: (555) 426-2025</p>
    </div>
  );
};

// Basic inline styles for demonstration
const formStyle = {
  maxWidth: '500px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  marginBottom: '20px',
};

const inputGroupStyle = {
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  boxSizing: 'border-box',
  border: '1px solid #ddd',
  borderRadius: '3px',
};

const buttonStyle = {
  padding: '10px 15px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default ContactPage;

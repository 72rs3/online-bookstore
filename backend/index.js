const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email Transporter (Using Ethereal for demo/testing as requested for "professional" look without real credentials)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'testuser@ethereal.email', // Replace with real credentials in production
        pass: 'testpass'
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = { from: '"Book Shop" <noreply@bookshop.com>', to, subject, text };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log('Email error:', error);
        else console.log('Email sent: ' + info.response);
    });
};

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// User Registration
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully' });
        sendEmail(email, 'Welcome to Fareed Al Sayegh Book Shop', `Hi ${username}, thank you for joining us!`);
    });
});

// User Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    });
});

// CRUD for Orders
app.post('/api/orders', (req, res) => {
    const { user_id, book_id, quantity, total_price } = req.body;

    if (!user_id || !book_id || !quantity || !total_price) {
        return res.status(400).json({ error: 'Missing order details' });
    }

    const query = 'INSERT INTO orders (user_id, book_id, quantity, total_price) VALUES (?, ?, ?, ?)';
    db.query(query, [user_id, book_id, quantity, total_price], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Order placed successfully', orderId: result.insertId });
        // Fetch user email to send confirmation
        db.query('SELECT email FROM users WHERE id = ?', [user_id], (err, results) => {
            if (!err && results.length > 0) {
                sendEmail(results[0].email, 'Order Confirmation', `Your order #${result.insertId} has been placed successfully!`);
            }
        });
    });
});

app.get('/api/orders/:user_id', (req, res) => {
    const { user_id } = req.params;
    const query = 'SELECT * FROM orders WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order updated successfully' });
    });
});

app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM orders WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order deleted successfully' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Admin: Get all users
app.get('/api/admin/users', (req, res) => {
    const query = 'SELECT id, username, email, role FROM users';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Admin: Get all orders with user details
app.get('/api/admin/orders', (req, res) => {
    const query = `
        SELECT orders.*, users.username, users.email 
        FROM orders 
        JOIN users ON orders.user_id = users.id
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Admin: Update order status
app.patch('/api/admin/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order status updated' });
    });
});

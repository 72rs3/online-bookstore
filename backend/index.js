const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '1mb' }));
const upload = multer({ dest: uploadDir });
const TAP_SECRET = process.env.TAP_SECRET_KEY;
const TAP_BASE = process.env.TAP_CHARGE_BASE || 'https://api.tap.company/v2/charges';
const TAP_REDIRECT = process.env.TAP_REDIRECT_URL || 'http://localhost:3000/orders';
const TAP_POST = process.env.TAP_POST_URL || 'http://localhost:3000/payment-hook';

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 25,
    standardHeaders: true,
    legacyHeaders: false
});

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin only' });
    }
    return next();
};

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
app.post('/api/register', authLimiter, async (req, res) => {
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
app.post('/api/login', authLimiter, (req, res) => {
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
app.post('/api/orders', requireAuth, (req, res) => {
    const { book_id, quantity, total_price } = req.body;
    const user_id = req.user.id;

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

app.get('/api/orders/:user_id', requireAuth, (req, res) => {
    const { user_id } = req.params;
    if (parseInt(user_id, 10) !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const query = 'SELECT * FROM orders WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.put('/api/orders/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order updated successfully' });
    });
});

app.delete('/api/orders/:id', requireAuth, (req, res) => {
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
app.get('/api/admin/users', requireAuth, requireAdmin, (req, res) => {
    const query = 'SELECT id, username, email, role FROM users';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Admin: Get all orders with user details
app.get('/api/admin/orders', requireAuth, requireAdmin, (req, res) => {
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
app.patch('/api/admin/orders/:id', requireAuth, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order status updated' });
    });
});

// User: Update Profile
app.put('/api/users/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (parseInt(id, 10) !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    let query = 'UPDATE users SET username = ?, email = ?';
    let params = [username, email];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = ?';
        params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    db.query(query, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Profile updated successfully' });
    });
});

// Admin: Get all books
app.get('/api/books', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Admin: Add a book
app.post('/api/admin/books', requireAuth, requireAdmin, (req, res) => {
    const { title, author, price, category, coverImage, description } = req.body;
    const query = 'INSERT INTO books (title, author, price, category, coverImage, description) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [title, author, price, category, coverImage, description], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Book added successfully' });
    });
});

// Admin: Bulk add books via CSV upload
// Expected CSV headers: title, author, price, category, coverImage, description
app.post('/api/admin/books/bulk', requireAuth, requireAdmin, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'CSV file is required' });

    const rows = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            if (!data.title || !data.author || !data.price) return;
            rows.push([
                data.title,
                data.author,
                parseFloat(data.price) || 0,
                data.category || '',
                data.coverImage || '',
                data.description || ''
            ]);
        })
        .on('end', () => {
            fs.unlink(req.file.path, () => {});
            if (rows.length === 0) {
                return res.status(400).json({ error: 'No valid rows found in CSV' });
            }
            const query = 'INSERT INTO books (title, author, price, category, coverImage, description) VALUES ?';
            db.query(query, [rows], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Books added successfully', inserted: result.affectedRows });
            });
        })
        .on('error', (error) => {
            fs.unlink(req.file.path, () => {});
            res.status(500).json({ error: error.message });
        });
});

// Admin: Delete a book
app.delete('/api/admin/books/:id', requireAuth, requireAdmin, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM books WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Book deleted successfully' });
    });
});

// Payments: create Tap charge
app.post('/api/payments/charge', requireAuth, async (req, res) => {
    if (!TAP_SECRET) return res.status(500).json({ error: 'Tap secret key is not configured' });

    const { amount, currency = 'KWD', customer, reference, description } = req.body;
    if (!amount || !customer || !customer.email) {
        return res.status(400).json({ error: 'amount and customer.email are required' });
    }

    try {
        const tapRes = await axios.post(
            TAP_BASE,
            {
                amount,
                currency,
                customer_initiated: true,
                threeDSecure: true,
                save_card: false,
                description: description || 'Order payment',
                metadata: { source: 'fareed-bookshop' },
                receipt: { email: false, sms: false },
                reference: reference || {},
<<<<<<< HEAD
                // Use Tap hosted page / all sources to redirect user
                source: { id: 'src_all' },
                redirect: { url: TAP_REDIRECT },
                post: { url: TAP_POST },
                customer
            },
            {
                headers: { Authorization: `Bearer ${TAP_SECRET}` }
            }
        );
        res.json(tapRes.data);
    } catch (error) {
        const errData = error.response?.data || error.message;
        res.status(500).json({ error: errData });
    }
});

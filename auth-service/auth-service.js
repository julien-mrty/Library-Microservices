const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

const users = []; // Temporary in-memory user storage (Replace with a database)
const SECRET_KEY = 'your_secret_key'; // Replace with a secure secret key

// Root endpoint
app.get('/', (req, res) => {
  res.send('Auth Service is Running! 🔐');
});

// ✅ User Registration (Signup)
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully' });
});

// ✅ User Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Generate JWT Token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ message: 'Login successful', token });
});

// ✅ Middleware to Verify JWT Token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// ✅ Protected Route Example (Requires Authentication)
app.get('/api/auth/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access! 🔒` });
});

module.exports = app;

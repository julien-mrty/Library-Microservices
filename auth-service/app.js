const express = require('express');
const authRoutes = require('./authRoutes'); // Import routes
require('dotenv').config();

const app = express();
app.use(express.json());

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Auth Service is Running!');
});

// Use authentication routes
app.use('/api/auth', authRoutes);

module.exports = app;

const express = require('express');
const authRoutes = require('./authRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Auth Service is Running!');
});

// Use authentication routes
app.use('/api/auth', authRoutes);

module.exports = app;

const express = require('express');
const oasGenerator = require('express-oas-generator'); // OpenAPI auto-generator
const authRoutes = require('./authRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Initialize OpenAPI generator BEFORE routes are declared
oasGenerator.init(app, {});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Auth Service is Running!');
});

// Use authentication routes
app.use('/api/auth', authRoutes);

module.exports = app;

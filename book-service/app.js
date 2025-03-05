const express = require('express');
const oasGenerator = require('express-oas-generator'); // OpenAPI auto-generator
const bookRoutes = require('./bookRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize OpenAPI generator BEFORE routes are declared
oasGenerator.init(app, {});

app.get('/', (req, res) => {
  res.send('Book Service is Running!');
});

app.use('/api/books', bookRoutes);

module.exports = app;

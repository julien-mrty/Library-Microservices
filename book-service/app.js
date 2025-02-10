const express = require('express');
const bookRoutes = require('./bookRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Book Service is Running!');
});

app.use('/api/books', bookRoutes);

module.exports = app;

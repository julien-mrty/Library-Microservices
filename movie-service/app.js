const express = require('express');
const movieRoutes = require('./movieRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🎬 Movie Service is Running!');
});

app.use('/api/movies', movieRoutes);

module.exports = app;

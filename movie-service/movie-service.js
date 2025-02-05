const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON requests

// Root endpoint
app.get('/', (req, res) => {
  res.send('🎬 Movie Service is Running!');
});

// Temporary in-memory movie data (Replace with a database in production)
let movies = [];

// ✅ Get all movies
app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// ✅ Add a new movie
app.post('/api/movies', (req, res) => {
  const movie = req.body;
  movies.push(movie);
  res.status(201).json({ message: 'Movie added successfully', movie });
});

// ✅ Update a movie by ID
app.put('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const updatedMovie = req.body;

  movies = movies.map((movie, index) => (index == id ? updatedMovie : movie));

  res.json({ message: 'Movie updated successfully', updatedMovie });
});

// ✅ Delete a movie by ID
app.delete('/api/movies/:id', (req, res) => {
  const { id } = req.params;

  movies = movies.filter((_, index) => index != id);

  res.json({ message: 'Movie deleted successfully' });
});

module.exports = app; // Export the app for testing

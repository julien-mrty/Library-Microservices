// movies-service/server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')();
require('dotenv').config();

const app = express();
app.use(express.json());

// Middleware d’authentification
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Connexion PostgreSQL
const db = pgp({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'movies_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// Créer la table movies si pas existante
db.none(`
  CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255),
    release_year INT,
    genre VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  );
`).then(() => {
  console.log("Table 'movies' créée (ou déjà existante).");
}).catch(console.error);

// Routes
app.get('/movies', authMiddleware, async (req, res) => {
  const movies = await db.any('SELECT * FROM movies ORDER BY created_at DESC');
  res.json(movies);
});

app.post('/movies', authMiddleware, async (req, res) => {
  const { title, director, release_year, genre } = req.body;
  try {
    const newMovie = await db.one(
      `INSERT INTO movies (title, director, release_year, genre)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, director, release_year, genre]
    );
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.MOVIES_PORT || 6000;
app.listen(PORT, () => {
  console.log(`Movies service running on port ${PORT}`);
});

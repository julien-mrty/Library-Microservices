// books-service/server.js
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
    req.user = decoded; // stocke l'utilisateur dans req.user
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Connexion PostgreSQL
const db = pgp({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'books_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// Créer la table books si pas existante
db.none(`
  CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    published_year INT,
    genre VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  );
`).then(() => {
  console.log("Table 'books' créée (ou déjà existante).");
}).catch(console.error);

// Routes
app.get('/books', authMiddleware, async (req, res) => {
  const books = await db.any('SELECT * FROM books ORDER BY created_at DESC');
  res.json(books);
});

app.post('/books', authMiddleware, async (req, res) => {
  const { title, author, published_year, genre } = req.body;
  try {
    const newBook = await db.one(
      `INSERT INTO books (title, author, published_year, genre)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, author, published_year, genre]
    );
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.BOOKS_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Books service running on port ${PORT}`);
});

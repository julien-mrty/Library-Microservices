const express = require("express");
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON requests


let books = []; // Temporary in-memory data

// Get all books
app.get("/api/books", (req, res) => {
  res.json(books);
});

// Add a book
app.post("/api/books", (req, res) => {
  const book = req.body;
  books.push(book);
  res.status(201).json({ message: "Book added", book });
});

// Update a book
app.put("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const updatedBook = req.body;
  books = books.map((b, index) => (index == id ? updatedBook : b));
  res.json({ message: "Book updated", updatedBook });
});

// Delete a book
app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  books = books.filter((_, index) => index != id);
  res.json({ message: "Book deleted" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
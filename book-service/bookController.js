const prisma = require('./prismaClient');
const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

// Middleware to extract userId from the token
async function getUserIdFromToken(req) {
  try {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // Verify token by calling Auth Service
    const authRes = await axios.get(`${AUTH_SERVICE_URL}/verify-token`, {
      headers: { Authorization: token },
    });

    return authRes.data.userId; // Extract userId from the auth service response
  } catch (error) {
    console.error('Auth verification failed:', error.response?.data || error.message);
    return null;
  }
}

// Get books only for the authenticated user
exports.getBooks = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Fetch books owned by the authenticated user
    const books = await prisma.book.findMany({ where: { userId } });
    res.json(books);
  } catch (error) {
    res.status(403).json({ message: "Unauthorized access" });
  }
};

// Securely Add a Book (linked to the authenticated user)
exports.addBook = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const { title, author, year } = req.body;

    const book = await prisma.book.create({
      data: { title, author, year, userId }, // Assign book to the logged-in user
    });

    res.status(201).json({ message: 'Book added', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Securely Update a Book (Only the owner can update)
exports.updateBook = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const { id } = req.params;
    const { title, author, year } = req.body;

    // Ensure the book belongs to the requesting user
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });

    if (!book || book.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this book' });
    }

    // Update the book
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, year },
    });

    res.json({ message: 'Book updated', updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Securely Delete a Book (Only the owner can delete)
exports.deleteBook = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const { id } = req.params;

    // Ensure the book belongs to the requesting user
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });

    if (!book || book.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this book' });
    }

    // Delete the book
    await prisma.book.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Book deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

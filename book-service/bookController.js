const prisma = require('./prismaClient');
const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

// Middleware to extract userId from the token
async function getUserIdFromToken(req) {
  const token = req.header('Authorization');

  // 1) Check if token is missing or doesn't start with "Bearer "
  if (!token || !token.startsWith('Bearer ')) {
    return { error: 'missingToken' };
  }

  // 2) Validate token via Auth Service
  try {
    const authRes = await axios.get(`${AUTH_SERVICE_URL}/verify-token`, {
      headers: { Authorization: token },
    });
    console.log('BookController AUTH_SERVICE_URL:', AUTH_SERVICE_URL);
    // Return the userId if valid
    return { userId: authRes.data.userId };
  } catch (error) {
    console.error('Auth verification failed:', error.response?.data || error.message);
    // Return an invalidToken error
    return { error: 'invalidToken' };
  }
}

// Get books only for the authenticated user
// For example, inside getBooks:
exports.getBooks = async (req, res) => {
  try {
    const { userId, error } = await getUserIdFromToken(req);

    // 1) If there's no token:
    if (error === 'missingToken') {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    // 2) If the token is invalid/expired:
    if (error === 'invalidToken') {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    // Now userId is valid, fetch the books
    const books = await prisma.book.findMany({ where: { userId } });
    return res.json(books);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Securely Add a Book (linked to the authenticated user)
exports.addBook = async (req, res) => {
  try {
    const { userId, error } = await getUserIdFromToken(req);

    if (error === 'missingToken') {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    if (error === 'invalidToken') {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    const { title, author, year } = req.body;
    const book = await prisma.book.create({
      data: { title, author, year, userId },
    });

    return res.status(201).json({ message: 'Book added', book });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// Securely Update a Book (Only the owner can update)
exports.updateBook = async (req, res) => {
  try {
    const { userId, error } = await getUserIdFromToken(req);

    if (error === 'missingToken') {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    if (error === 'invalidToken') {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    const { id } = req.params;
    const { title, author, year } = req.body;

    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book || book.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this book' });
    }

    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, year },
    });

    return res.json({ message: 'Book updated', updatedBook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Securely Delete a Book (Only the owner can delete)
exports.deleteBook = async (req, res) => {
  try {
    const { userId, error } = await getUserIdFromToken(req);

    if (error === 'missingToken') {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    if (error === 'invalidToken') {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    const { id } = req.params;
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });

    if (!book || book.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this book' });
    }

    await prisma.book.delete({ where: { id: parseInt(id) } });
    return res.json({ message: 'Book deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

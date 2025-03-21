const prisma = require('./prismaClient');
const axios = require('axios');
const dotenv = require('dotenv');
const Joi = require('joi');

// Determine the environment
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

// Load the environment file
dotenv.config({ path: envFile });

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
    console.log('token : ', token);

    //  Return the userId if valid
    return { userId: authRes.data.userId };
  } catch (error) {
    console.error(
      'Auth verification failed:',
      error.response?.data || error.message
    );
    // Return an invalidToken error
    return { error: 'invalidToken' };
  }
}

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
      return res
        .status(403)
        .json({ message: 'Forbidden: You do not own this book' });
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
      return res
        .status(403)
        .json({ message: 'Forbidden: You do not own this book' });
    }

    await prisma.book.delete({ where: { id: parseInt(id) } });
    return res.json({ message: 'Book deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Validation schema for query params (Joi)
const paginationFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(5),
  title: Joi.string().optional(),
  author: Joi.string().optional(),
  year: Joi.number().integer().optional(),
});

exports.getAllBooksPaginated = async (req, res) => {
  try {
    // 1) Validate the token, get userId
    const { userId, error } = await getUserIdFromToken(req);
    if (error === 'missingToken') {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    if (error === 'invalidToken') {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    // 2) Validate query params with Joi
    const { error: joiError, value } = paginationFilterSchema.validate(req.query, {
      abortEarly: false, // Collect all errors if any
    });
    if (joiError) {
      // Return 400 with details about which params are invalid
      return res.status(400).json({
        message: 'Invalid query parameters',
        details: joiError.details.map((d) => d.message),
      });
    }

    // 3) Extract validated fields
    const { page, limit, title, author, year } = value;
    console.log(`Page: ${page}, Limit: ${limit}`);

    const skip = (page - 1) * limit;

    // 4) Build dynamic filter
    const filter = { userId };
    if (title) {
      filter.title = { contains: title, mode: 'insensitive' };
    }
    if (author) {
      filter.author = { contains: author, mode: 'insensitive' };
    }
    if (year) {
      filter.year = parseInt(year, 10); // exact match
    }

    // 5) Fetch paginated and count
    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where: filter,
        skip: skip,
        take: limit,
      }),
      prisma.book.count({ where: filter }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // 6) Return paginated result
    return res.json({
      data: books,
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    });
  } catch (error) {
    console.error('[getAllBooksPaginated] Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
const prisma = require('./prismaClient');
const axios = require('axios');
const dotenv = require('dotenv');

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
    console.log("token : ", token)

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

exports.getAllBooksPaginated = async (req, res) => {
  try {
    // Vérification du token et récupération de l'userId
    const { userId, error } = await getUserIdFromToken(req);

    // Gestion des erreurs liées au token
    if (error === 'missingToken') {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    if (error === 'invalidToken') {
      return res.status(403).json({ message: 'Unauthorized: Invalid token' });
    }

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    console.log(`Page: ${page}, Limit: ${limit}`);
    const skip = (page - 1) * limit;

    // Récupération paginée des livres de l'utilisateur authentifié
    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where: { userId }, // Filtrer uniquement les livres de l'utilisateur
        skip: skip,
        take: limit, // Prendre uniquement le nombre spécifié de livres
        // orderBy: { createdAt: 'desc' } // Facultatif : si tu veux trier par date de création
      }),
      prisma.book.count({ where: { userId } }), // Nombre total de livres de cet utilisateur
    ]);

    // Calcul du nombre total de pages
    const totalPages = Math.ceil(totalCount / limit);

    // Réponse avec les données paginées
    return res.json({
      data: books,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      limit: limit,
    });
  } catch (error) {
    console.error('[getAllBooksPaginated] Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const prisma = require('./prismaClient');

// Get movies only for the authenticated user
exports.getMovies = async (req, res) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' });
    }

    // Call Auth Service to verify token
    const authRes = await axios.get(AUTH_SERVICE_URL, {
      headers: { Authorization: token },
    });

    const userId = authRes.data.userId;

    // Fetch movies owned by the authenticated user
    const movies = await prisma.movie.findMany({ where: { userId } });
    res.json(movies);
  } catch (error) {
    res.status(403).json({ message: 'Unauthorized access' });
  }
};

// Add a new movie
exports.addMovie = async (req, res) => {
  try {
    const { title, director, year } = req.body;
    const movie = await prisma.movie.create({
      data: { title, director, year },
    });
    res.status(201).json({ message: 'Movie added successfully', movie });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, director, year } = req.body;

    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: { title, director, year },
    });

    res.json({ message: 'Movie updated successfully', updatedMovie });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.movie.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

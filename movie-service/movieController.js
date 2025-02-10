const prisma = require('./prismaClient');

// Get all movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new movie
exports.addMovie = async (req, res) => {
  try {
    const { title, director, year } = req.body;
    const movie = await prisma.movie.create({ data: { title, director, year } });
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

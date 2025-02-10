exports.validateMovie = (req, res, next) => {
  const { title, director, year } = req.body;
  if (!title || !director || typeof year !== 'number') {
    return res.status(400).json({ message: 'Invalid movie data' });
  }
  next();
};

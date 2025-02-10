exports.validateBook = (req, res, next) => {
  const { title, author, year } = req.body;
  if (!title || !author || typeof year !== 'number') {
    return res.status(400).json({ message: 'Invalid book data' });
  }
  next();
};

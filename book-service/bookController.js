const prisma = require('./prismaClient');

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a book
exports.addBook = async (req, res) => {
  try {
    const { title, author, year } = req.body;
    const book = await prisma.book.create({ data: { title, author, year } });
    res.status(201).json({ message: 'Book added', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year } = req.body;
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

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.book.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

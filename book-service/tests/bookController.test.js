const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require('../bookController');
const prisma = require('./setup');

describe('📚 Book Controller Tests', () => {
  let bookId;

  beforeAll(async () => {
    // Insert a sample book
    const book = await prisma.book.create({
      data: { title: 'Test Book', author: 'John Doe', year: 2024 },
    });
    bookId = book.id;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
  });

  test('✅ getBooks returns a list of books', async () => {
    const mockReq = {};
    const mockRes = { json: jest.fn() };
    await getBooks(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
  });

  test('✅ addBook adds a book successfully', async () => {
    const mockReq = {
      body: { title: 'New Book', author: 'Jane Doe', year: 2023 },
    };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await addBook(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Book added' })
    );
  });

  test('✅ updateBook updates an existing book', async () => {
    const mockReq = {
      params: { id: bookId },
      body: { title: 'Updated Title', author: 'John Doe', year: 2025 },
    };
    const mockRes = { json: jest.fn() };
    await updateBook(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Book updated' })
    );
  });

  test('✅ deleteBook removes a book', async () => {
    const mockReq = { params: { id: bookId } };
    const mockRes = { json: jest.fn() };
    await deleteBook(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Book deleted' });
  });
});

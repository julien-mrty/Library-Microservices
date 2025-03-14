const {
  getAllBooksPaginated,
  addBook,
  updateBook,
  deleteBook,
} = require('../bookController');
const prisma = require('./setup');
const axios = require('axios');

// We only mock axios here, not Prisma. We will use the real DB for Prisma.
jest.mock('axios');

describe('📚 Book Controller Tests (with Authentication)', () => {
  let bookId;

  beforeAll(async () => {
    // Mock Auth Service to return userId=1 for valid tokens
    axios.get.mockResolvedValue({ data: { userId: 1 } });

    // Ensure the DB is clean, then insert a sample book
    await prisma.book.deleteMany();
    const book = await prisma.book.create({
      data: { title: 'Test Book', author: 'John Doe', year: 2024, userId: 1 },
    });
    bookId = book.id;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
    await prisma.$disconnect();
  });

  test('✅ getAllBooksPaginated returns paginated books (Authenticated User)', async () => {
    // Create multiple test books in the DB for userId=1
    await prisma.book.createMany({
      data: Array(5)
        .fill()
        .map((_, i) => ({
          title: `Paginated Book ${i}`,
          author: 'Paginated Author',
          year: 2000 + i,
          userId: 1,
        })),
    });

    // We simulate an incoming request
    const mockReq = {
      header: jest.fn(() => 'Bearer validToken'),
      query: { page: '1', limit: '5' },
    };
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Call the controller function
    await getAllBooksPaginated(mockReq, mockRes);

    // We expect a normal success response
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.any(Array),
        currentPage: 1,
        totalPages: expect.any(Number),
        totalCount: expect.any(Number),
        limit: 5,
      })
    );
  });

  test('✅ addBook adds a book successfully (Authenticated User)', async () => {
    const mockReq = {
      header: jest.fn(() => 'Bearer validToken'),
      body: { title: 'New Book', author: 'Jane Doe', year: 2023 },
    };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Mock axios.get again for token verification
    axios.get.mockResolvedValue({ data: { userId: 1 } });

    await addBook(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Book added' })
    );
  });

  test('✅ updateBook updates an existing book (Owned by User)', async () => {
    const mockReq = {
      params: { id: bookId },
      header: jest.fn(() => 'Bearer validToken'),
      body: { title: 'Updated Title', author: 'John Doe', year: 2025 },
    };
    const mockRes = { json: jest.fn() };

    axios.get.mockResolvedValue({ data: { userId: 1 } });

    await updateBook(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Book updated' })
    );
  });

  test('❌ getAllBooksPaginated fails with missing token', async () => {
    const mockReq = {
      header: jest.fn(() => null),
      query: { page: '1', limit: '5' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllBooksPaginated(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized: Missing token',
    });
  });

  test('❌ getAllBooksPaginated fails with invalid token', async () => {
    // Make axios throw an error to simulate invalid token
    axios.get.mockRejectedValue(new Error('Invalid token'));

    const mockReq = {
      header: jest.fn(() => 'Bearer invalidToken'),
      query: { page: '1', limit: '5' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllBooksPaginated(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized: Invalid token',
    });
  });
});

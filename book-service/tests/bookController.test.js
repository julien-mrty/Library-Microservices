// tests/bookController.test.js

const {
  getAllBooksPaginated,
  addBook,
  updateBook,
  deleteBook,
} = require('../bookController');
const prisma = require('./setup');
const axios = require('axios');

// Only axios is mocked; we want a real DB test.
jest.mock('axios');

describe('📚 Book Controller Tests (with Real DB)', () => {
  let bookId;

  beforeAll(async () => {
    // 1) Mock Auth Service for valid tokens
    axios.get.mockResolvedValue({ data: { userId: 1 } });

    // 2) Clean the DB
    await prisma.book.deleteMany();

    // 3) Insert an initial sample book
    const book = await prisma.book.create({
      data: {
        title: 'Test Book',
        author: 'John Doe',
        year: 2024,
        userId: 1, // Matches the userId from axios.get.mockResolvedValue
      },
    });
    bookId = book.id;
  });

  afterAll(async () => {
    // Clean up and disconnect
    await prisma.book.deleteMany();
    await prisma.$disconnect();
  });

  test('✅ getAllBooksPaginated returns paginated books (Authenticated User)', async () => {
    // Insert multiple books for the same userId=1
    await prisma.book.createMany({
      data: Array(5).fill().map((_, i) => ({
        title: `Paginated Book ${i}`,
        author: 'Paginated Author',
        year: 1000 + i,
        userId: 1,
      })),
    });

    // Simulate a request object with a valid "Bearer validToken"
    const mockReq = {
      header: jest.fn(() => 'Bearer validToken'),
      query: { page: '1', limit: '5' },
    };
    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Invoke the controller function
    await getAllBooksPaginated(mockReq, mockRes);

    // We expect a success response with the paginated structure
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.any(Array),  // The paginated books
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

    // Re-mock the Auth Service again for valid token
    axios.get.mockResolvedValue({ data: { userId: 1 } });

    // Call the controller
    await addBook(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Book added' })
    );
  });

  test('✅ updateBook updates an existing book (Owned by User)', async () => {
    // The bookId is the one we inserted in beforeAll
    const mockReq = {
      params: { id: bookId },
      header: jest.fn(() => 'Bearer validToken'),
      body: { title: 'Updated Title', author: 'John Doe', year: 2024 },
    };
    const mockRes = { json: jest.fn() };

    // Mock token verification success
    axios.get.mockResolvedValue({ data: { userId: 1 } });

    // Call the controller
    await updateBook(mockReq, mockRes);

    // We expect a response with "Book updated"
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Book updated' })
    );

    // Optionally, verify that the book's title changed in the database
    const updatedBook = await prisma.book.findUnique({ where: { id: bookId } });
    expect(updatedBook.title).toBe('Updated Title');
  });

  test('❌ getAllBooksPaginated fails with missing token', async () => {
    const mockReq = {
      header: jest.fn(() => null), // No token
      query: { page: '1', limit: '5' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller
    await getAllBooksPaginated(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized: Missing token',
    });
  });

  test('❌ getAllBooksPaginated fails with invalid token', async () => {
    // Make axios throw an error => invalid token
    axios.get.mockRejectedValue(new Error('Invalid token'));

    const mockReq = {
      header: jest.fn(() => 'Bearer invalidToken'),
      query: { page: '1', limit: '5' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller
    await getAllBooksPaginated(mockReq, mockRes);

    // Because the token is invalid, we expect 403
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized: Invalid token',
    });
  });
});

const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../bookController");
const prisma = require("./setup");
const axios = require("axios");

jest.mock("axios");

describe("📚 Book Controller Tests (with Authentication)", () => {
  let bookId;

  beforeAll(async () => {
    axios.get.mockResolvedValue({ data: { userId: 1 } });

    // Insert a sample book
    const book = await prisma.book.create({
      data: { title: "Test Book", author: "John Doe", year: 2024, userId: 1 },
    });
    bookId = book.id;
  });

  afterAll(async () => {
    await prisma.book.deleteMany();
  });

  test("✅ getBooks returns a list of books (Authenticated User)", async () => {
    const mockReq = { header: jest.fn(() => "Bearer validToken") };
    const mockRes = { json: jest.fn() };

    axios.get.mockResolvedValue({ data: { userId: 1 } });

    await getBooks(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
  });

  test("✅ addBook adds a book successfully (Authenticated User)", async () => {
    const mockReq = {
      header: jest.fn(() => "Bearer validToken"),
      body: { title: "New Book", author: "Jane Doe", year: 2023 },
    };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    axios.get.mockResolvedValue({ data: { userId: 1 } });

    await addBook(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Book added" })
    );
  });

  test("✅ updateBook updates an existing book (Owned by User)", async () => {
    const mockReq = {
      params: { id: bookId },
      header: jest.fn(() => "Bearer validToken"),
      body: { title: "Updated Title", author: "John Doe", year: 2025 },
    };
    const mockRes = { json: jest.fn() };

    axios.get.mockResolvedValue({ data: { userId: 1 } });

    await updateBook(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Book updated" })
    );
  });
});

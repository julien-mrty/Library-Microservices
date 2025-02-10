const { validateBook } = require('../bookMiddleware');

describe('📚 Book Middleware Tests', () => {
  test('✅ validateBook allows valid book data', () => {
    const req = { body: { title: 'Valid Book', author: 'Author', year: 2024 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validateBook(req, res, next);
    expect(next).toHaveBeenCalled(); // Should proceed
  });

  test('❌ validateBook rejects invalid book data', () => {
    const req = { body: { title: '', author: 'Author', year: 'wrongType' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validateBook(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid book data' });
  });
});

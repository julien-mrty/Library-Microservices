const { validateMovie } = require('../movieMiddleware');

describe('🎬 Movie Middleware Tests', () => {
  test('✅ validateMovie allows valid movie data', () => {
    const req = { body: { title: 'Valid Movie', director: 'Director', year: 2023 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validateMovie(req, res, next);
    expect(next).toHaveBeenCalled(); // Should proceed
  });

  test('❌ validateMovie rejects invalid movie data', () => {
    const req = { body: { title: '', director: 'Director', year: 'wrongType' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    validateMovie(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid movie data' });
  });
});

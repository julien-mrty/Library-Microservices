const {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} = require('../movieController');
const prisma = require('./setup');

describe('🎬 Movie Controller Tests', () => {
  let movieId;

  beforeAll(async () => {
    const movie = await prisma.movie.create({
      data: { title: 'Test Movie', director: 'Director', year: 2023 },
    });
    movieId = movie.id;
  });

  afterAll(async () => {
    await prisma.movie.deleteMany();
  });

  test('✅ getMovies should return movies', async () => {
    const mockReq = {};
    const mockRes = { json: jest.fn() };
    await getMovies(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
  });

  test('✅ addMovie should add a movie', async () => {
    const mockReq = {
      body: { title: 'New Movie', director: 'Jane Doe', year: 2022 },
    };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await addMovie(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Movie added successfully' })
    );
  });

  test('✅ updateMovie should update an existing movie', async () => {
    const mockReq = {
      params: { id: movieId },
      body: { title: 'Updated Title', director: 'Director', year: 2025 },
    };
    const mockRes = { json: jest.fn() };
    await updateMovie(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Movie updated successfully' })
    );
  });

  test('✅ deleteMovie should delete a movie', async () => {
    const mockReq = { params: { id: movieId } };
    const mockRes = { json: jest.fn() };
    await deleteMovie(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Movie deleted successfully',
    });
  });
});

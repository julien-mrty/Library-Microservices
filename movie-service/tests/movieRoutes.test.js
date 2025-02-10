const request = require('supertest');
const app = require('../app');
const prisma = require('./setup');

describe('🎬 Movie Routes Tests', () => {
  let movieId;

  beforeAll(async () => {
    await prisma.movie.deleteMany();
  });

  test('✅ POST /api/movies should add a movie', async () => {
    const res = await request(app).post('/api/movies').send({
      title: 'Test Movie',
      director: 'Director',
      year: 2023,
    });

    expect(res.status).toBe(201);
    expect(res.body.movie).toHaveProperty('id');
    movieId = res.body.movie.id;
  });

  test('✅ GET /api/movies should retrieve movies', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('✅ PUT /api/movies/:id should update a movie', async () => {
    const res = await request(app).put(`/api/movies/${movieId}`).send({
      title: 'Updated Movie Title',
      director: 'New Director',
      year: 2025,
    });

    expect(res.status).toBe(200);
    expect(res.body.updatedMovie.title).toBe('Updated Movie Title');
  });

  test('✅ DELETE /api/movies/:id should remove a movie', async () => {
    const res = await request(app).delete(`/api/movies/${movieId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Movie deleted successfully');
  });
});

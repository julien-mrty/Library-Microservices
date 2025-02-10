const request = require('supertest');
const app = require('../app');
const prisma = require('./setup');

describe('📚 Book Routes Tests', () => {
  let bookId;

  beforeAll(async () => {
    await prisma.book.deleteMany();
  });

  test('✅ POST /api/books adds a book', async () => {
    const res = await request(app).post('/api/books').send({
      title: 'Test Book',
      author: 'John Doe',
      year: 2024
    });

    expect(res.status).toBe(201);
    expect(res.body.book).toHaveProperty('id');
    bookId = res.body.book.id;
  });

  test('✅ GET /api/books retrieves books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('✅ PUT /api/books/:id updates a book', async () => {
    const res = await request(app).put(`/api/books/${bookId}`).send({
      title: 'Updated Book Title',
      author: 'Jane Doe',
      year: 2025
    });

    expect(res.status).toBe(200);
    expect(res.body.updatedBook.title).toBe('Updated Book Title');
  });

  test('✅ DELETE /api/books/:id removes a book', async () => {
    const res = await request(app).delete(`/api/books/${bookId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Book deleted');
  });
});

const request = require('supertest');
const app = require('../app'); // Book Service App
const prisma = require('./setup');
const axios = require('axios');

let accessToken;
let bookId;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

jest.setTimeout(30000); // Increase timeout if needed

beforeAll(async () => {
  console.log('🚀 Checking if Auth Service is running...');

  // Attempt to register a test user
  try {
    await axios.post(`${AUTH_SERVICE_URL}/register`, {
      username: 'testuser',
      password: 'testpassword',
    });
    console.log('✅ User registered successfully');
  } catch (error) {
    // If the user already exists, we simply proceed to login
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === 'User already exists'
    ) {
      console.log('⚠️ User already exists, proceeding to login...');
    } else {
      console.error('🚨 Auth Setup Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Attempt to log in and retrieve an access token
  try {
    const loginRes = await axios.post(`${AUTH_SERVICE_URL}/login`, {
      username: 'testuser',
      password: 'testpassword',
    });
    accessToken = loginRes.data.accessToken;
    console.log('🔍 Generated Access Token:', accessToken);
    console.log('BC test AUTH_SERVICE_URL:', AUTH_SERVICE_URL);
  } catch (error) {
    console.error('🚨 Auth Setup Error:', error.response?.data || error.message);
    throw error;
  }

  // Clean up book records before tests
  await prisma.book.deleteMany();
});

afterAll(async () => {
  console.log('🛑 Stopping Auth Service...');
  await prisma.book.deleteMany();
  await prisma.$disconnect();
});

describe('📚 Book Routes Tests (with Authentication)', () => {
  test('✅ POST /api/books adds a book (Authenticated)', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Test Book',
        author: 'John Doe',
        year: 2024,
      });

    expect(res.status).toBe(201);
    expect(res.body.book).toHaveProperty('id');
    bookId = res.body.book.id;
  });

  test('❌ POST /api/books fails without a token', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({
        title: 'Unauthorized Book',
        author: 'Jane Doe',
        year: 2025,
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized: Missing token');
  });

  test('✅ GET /api/books retrieves user-specific books', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    // We expect at least 1 book because we added one
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('✅ PUT /api/books/:id updates a book (Owned by User)', async () => {
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated Book Title',
        author: 'Jane Doe',
        year: 2025,
      });

    expect(res.status).toBe(200);
    expect(res.body.updatedBook.title).toBe('Updated Book Title');
  });

  test('❌ PUT /api/books/:id fails if book does not belong to user', async () => {
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', 'Bearer invalidToken')
      .send({
        title: 'Hacker Update',
        author: 'Hacker',
        year: 2099,
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Unauthorized: Invalid token');
  });

  test('✅ DELETE /api/books/:id removes a book (Owned by User)', async () => {
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Book deleted');
  });

  test('❌ DELETE /api/books/:id fails if user does not own the book', async () => {
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', 'Bearer invalidToken');

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Unauthorized: Invalid token');
  });
});

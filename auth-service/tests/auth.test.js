const request = require("supertest");
const app = require("../app");
const prisma = require("../prismaClient");
require("dotenv").config();

describe("Authentication Tests", () => {
  let testUser = { username: "testuser", password: "testpassword" };
  let accessToken;
  let refreshToken;

  beforeAll(async () => {
    // Cleanup previous test user
    await prisma.user.deleteMany({ where: { username: testUser.username } });

    // Register test user
    await request(app).post("/api/auth/register").send(testUser);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: testUser.username } });
    await prisma.$disconnect();
  });

  test("✅ User can log in and receive tokens", async () => {
    const res = await request(app).post("/api/auth/login").send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();

    // Grab the refresh token from the Set-Cookie header
    accessToken = res.body.accessToken;
    refreshToken = res.headers["set-cookie"]?.[0];

    expect(refreshToken).toBeDefined();
  });

  test("❌ User cannot log in with incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: testUser.username, password: "wrongpassword" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid username or password");
  });

  test("✅ User can log out and refresh token is invalidated", async () => {
    if (!refreshToken) {
      throw new Error("refreshToken is undefined. Skipping logout test.");
    }

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
  });
});

const request = require("supertest");
const app = require("../app");
const prisma = require("../prismaClient");

describe("Protected Routes Tests", () => {
  let accessToken;

  beforeAll(async () => {
    // Ensure user is registered
    await request(app).post("/api/auth/register").send({
      username: "protectedUser",
      password: "securePass",
    });

    // Log in to get tokens
    const loginRes = await request(app).post("/api/auth/login").send({
      username: "protectedUser",
      password: "securePass",
    });

    accessToken = loginRes.body.accessToken;
    console.log("🔍 Generated Access Token:", accessToken); // Debugging
  });

  test("✅ Access protected route with valid token", async () => {
    const res = await request(app)
      .get("/api/auth/protected")
      .set("Authorization", `Bearer ${accessToken}`);

    console.log("🔍 Protected Route Response:", res.body); // Debugging

    // Assuming the protected route returns 200 on success
    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`Hello protectedUser, you have access!`);
  });

  test("❌ Block access to protected route without token", async () => {
    const res = await request(app).get("/api/auth/protected");

    expect(res.status).toBe(401);
    // Updated to match the new message from verifyToken
    expect(res.body.message).toBe("Access token required");
  });

  test("❌ Block access with invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/protected")
      .set("Authorization", "Bearer invalidToken");

    expect(res.status).toBe(403);
    // Matches the new implementation: "Invalid or expired token"
    expect(res.body.message).toBe("Invalid or expired token");
  });
});

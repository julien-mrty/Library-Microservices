const request = require("supertest");
const app = require("../app");
const prisma = require("../prismaClient");

describe("Token Refresh Tests", () => {
  let accessToken;
  let refreshToken;

  beforeAll(async () => {
    // Ensure user is registered for refresh tests
    await request(app).post("/api/auth/register").send({
      username: "refreshUser",
      password: "refreshPass",
    });

    // Log in to retrieve tokens
    const loginRes = await request(app).post("/api/auth/login").send({
      username: "refreshUser",
      password: "refreshPass",
    });

    accessToken = loginRes.body.accessToken;
    refreshToken = loginRes.headers["set-cookie"]?.[0];
    console.log("🔍 Generated Refresh Token:", refreshToken); // Debugging

    if (!refreshToken) {
      throw new Error("🚨 Refresh token is undefined. Login might have failed.");
    }
  });

  test("✅ Successfully refresh access token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", refreshToken);

    console.log("🔍 Refresh Token Response:", res.body); // Debugging

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  test("❌ Prevent refresh with invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      // Provide an obviously fake or invalid token cookie
      .set("Cookie", "refreshToken=invalidToken");

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Invalid refresh token");
  });
});

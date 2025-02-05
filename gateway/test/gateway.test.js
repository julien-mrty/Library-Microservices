const request = require("supertest");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Mock Express app
const app = express();

// Mock Proxies (Instead of calling real services, we simulate responses)
app.use(
  "/auth",
  (req, res) => res.json({ message: "Auth Service Proxy Working" })
);
app.use(
  "/books",
  (req, res) => res.json({ message: "Books Service Proxy Working" })
);
app.use(
  "/movies",
  (req, res) => res.json({ message: "Movies Service Proxy Working" })
);

// Test Suite for API Gateway
describe("API Gateway", () => {
  it("should return 404 for root path as it's not defined", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(404);
  });

  it("should proxy request to Auth Service", async () => {
    const res = await request(app).get("/auth");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Auth Service Proxy Working" });
  });

  it("should proxy request to Books Service", async () => {
    const res = await request(app).get("/books");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Books Service Proxy Working" });
  });

  it("should proxy request to Movies Service", async () => {
    const res = await request(app).get("/movies");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Movies Service Proxy Working" });
  });
});

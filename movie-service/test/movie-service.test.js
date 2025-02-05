const request = require("supertest");
const app = require("../movie-service"); // Import the app

describe("🎬 Movie Service API Tests", () => {
  // ✅ Test: Get all movies (Initially Empty)
  it("should return an empty movie list", async () => {
    const res = await request(app).get("/api/movies");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  // ✅ Test: Add a new movie
  it("should add a new movie", async () => {
    const newMovie = {
      title: "Interstellar",
      director: "Christopher Nolan",
      year: 2014,
    };

    const res = await request(app).post("/api/movies").send(newMovie);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Movie added successfully");
    expect(res.body.movie).toMatchObject(newMovie);
  });

  // ✅ Test: Update a movie
  it("should update a movie", async () => {
    const updatedMovie = {
      title: "Inception (Updated)",
      director: "Christopher Nolan",
      year: 2010,
    };

    const res = await request(app).put("/api/movies/0").send(updatedMovie);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Movie updated successfully");
    expect(res.body.updatedMovie).toMatchObject(updatedMovie);
  });

  // ✅ Test: Delete a movie
  it("should delete a movie", async () => {
    const res = await request(app).delete("/api/movies/0");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Movie deleted successfully");

    // Ensure list is empty after deletion
    const getRes = await request(app).get("/api/movies");
    expect(getRes.body).toEqual([]);
  });
});

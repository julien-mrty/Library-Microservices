const request = require("supertest");
const app = require("../book-service"); // ✅ Now this works!

describe("API Health Check", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});

/*describe("Books API", () => {
  it("should add a book", async () => {
    const book = { title: "Test Book", author: "Author Name" };
    const res = await request(app).post("/api/books").send(book);
    expect(res.status).toBe(201);
    expect(res.body.book).toEqual(book);
  });
});*/

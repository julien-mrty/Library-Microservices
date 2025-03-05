const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Book Service running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

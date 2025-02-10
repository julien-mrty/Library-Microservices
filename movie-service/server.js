const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`🎬 Movie Service running on http://localhost:${port}`);
});

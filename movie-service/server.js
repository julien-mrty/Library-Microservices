// movie-service/server.js
const app = require('./movie-service');

const PORT = process.env.MOVIES_PORT || 6000;
app.listen(PORT, () => {
  console.log(`Movies service running on port ${PORT}`);
});

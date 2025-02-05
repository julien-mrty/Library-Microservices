const app = require("./app"); // Import the app from app.js
const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

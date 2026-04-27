// index.js
// Entry point for running the ShopEasy API server
const app = require('./server');

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`ShopEasy API running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

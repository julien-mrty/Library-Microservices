// gateway/gateway.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Redirection vers Auth Service
app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:4000', // <--- le nom du service dans docker-compose
  changeOrigin: true
}));

// Redirection vers Books Service
app.use('/books', createProxyMiddleware({
  target: 'http://books-service:5000',
  changeOrigin: true
}));

// Redirection vers Movies Service
app.use('/movies', createProxyMiddleware({
  target: 'http://movies-service:6000',
  changeOrigin: true
}));

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});

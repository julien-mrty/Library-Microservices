const express = require('express');
const oasGenerator = require('express-oas-generator'); // OpenAPI auto-generator
const bookRoutes = require('./bookRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize OpenAPI generator BEFORE routes are declared
oasGenerator.init(app, (spec) => {
  if (spec.swagger) {
    delete spec.swagger;
  }

  spec.openapi = '3.0.0';

  spec.components = spec.components || {};
  spec.components.securitySchemes = {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  };

  spec.security = [
    {
      bearerAuth: [],
    },
  ];
  // ----------------------------

  const bookPaths = spec.paths || {};
  if (bookPaths['/api/books']?.post) {
    bookPaths['/api/books'].post.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              author: { type: 'string' },
              year: { type: 'integer' },
            },
            required: ['title', 'author', 'year'],
          },
        },
      },
    };
  }

  return spec;
});

app.get('/', (req, res) => {
  res.send('Book Service is Running!');
});

// Routes
app.use('/api/books', bookRoutes);

module.exports = app;

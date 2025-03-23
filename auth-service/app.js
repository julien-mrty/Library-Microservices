const express = require('express');
const oasGenerator = require('express-oas-generator'); // OpenAPI auto-generator
const authRoutes = require('./authRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Initialize OpenAPI generator BEFORE declaring routes
oasGenerator.init(app, (spec) => {

  // Switch from Swagger 2 to OpenAPI 3
  if (spec.swagger) {
    delete spec.swagger;
  }
  spec.openapi = '3.0.0';

  // --- DECLARE THE BEARER SECURITY SCHEME ---
  spec.components = spec.components || {};
  spec.components.securitySchemes = {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  };

  // Apply the security scheme globally to all endpoints (optional)
  spec.security = [
    {
      bearerAuth: []
    }
  ];
  // ------------------------------------------

  // Example requestBody definitions for register, login, etc.
  const authPaths = spec.paths || {};

  // POST /api/auth/register
  if (authPaths['/api/auth/register']?.post) {
    authPaths['/api/auth/register'].post.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' }
            },
            required: ['username', 'password']
          }
        }
      }
    };
  }

  // POST /api/auth/login
  if (authPaths['/api/auth/login']?.post) {
    authPaths['/api/auth/login'].post.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              username: { type: 'string' },
              password: { type: 'string' }
            },
            required: ['username', 'password']
          }
        }
      }
    };
  }

  // GET /api/auth/verify-token (response definitions)
  if (authPaths['/api/auth/verify-token']?.get) {
    authPaths['/api/auth/verify-token'].get.responses = {
      200: { description: 'Token is valid' },
      401: { description: 'Invalid or expired token' }
    };
  }

  return spec;
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Auth Service is Running!');
});

// Attach auth routes
app.use('/api/auth', authRoutes);

module.exports = app;

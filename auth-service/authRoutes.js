const express = require('express');
const { register, login } = require('./authController');

const router = express.Router();

// Define authentication routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;

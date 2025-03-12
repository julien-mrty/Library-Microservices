const express = require('express');
const {
  register,
  login,
  refreshToken,
  logout,
  verifyToken,
} = require('./authController');
const { authenticateToken } = require('./authMiddleware');

const { registerSchema, loginSchema } = require('./validationSchemas');
const { validate } = require('./validationMiddleware');

const router = express.Router();


router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

router.post('/refresh', refreshToken); // Refresh token endpoint
router.post('/logout', logout);
router.get('/verify-token', verifyToken);

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access!` });
});

router.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = router;

const express = require('express');
const {
  register,
  login,
  refreshToken,
  logout,
  verifyToken,
} = require('./authController');
const { authenticateToken } = require('./authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
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

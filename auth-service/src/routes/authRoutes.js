const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access!` });
});

module.exports = router;

const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_SECRET = process.env.ACCESS_SECRET;

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: 'Invalid or expired token' });

    req.user = user;
    next();
  });
};

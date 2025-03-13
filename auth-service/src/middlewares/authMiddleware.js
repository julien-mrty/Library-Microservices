const tokenUtils = require('../utils/tokenUtils');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    req.user = tokenUtils.verifyToken(token);
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

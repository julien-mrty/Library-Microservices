const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./prismaClient'); // Import Prisma
const dotenv = require('dotenv');
require('dotenv').config();

// Determine the environment
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';

// Load the environment file
dotenv.config({ path: envFile });

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

// In-memory refresh token store (Replace with database storage in production)
let refreshTokens = [];

// Register a New User
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in database
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate Tokens
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: '60m', // Short-lived token
      }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, username: user.username },
      REFRESH_SECRET_KEY,
      {
        expiresIn: '7d', // Long-lived refresh token
      }
    );

    refreshTokens.push(refreshToken); // Store refresh token (Use DB in production)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevent access via JavaScript
      secure: true, // HTTPS only in production
      sameSite: 'Strict',
    });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Read from cookie

  if (!refreshToken)
    return res.status(403).json({ message: 'Refresh token required' });

  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const newAccessToken = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: '15m',
    });

    res.json({ accessToken: newAccessToken });
  });
};

exports.logout = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: 'No refresh token found' });
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.json({ message: 'Logged out successfully' });
};

// Verify User via JWT
exports.verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' });
    }

    // Remove "Bearer " prefix if present
    const formattedToken = token.replace('Bearer ', '');

    // Verify JWT Token
    const decoded = jwt.verify(formattedToken, SECRET_KEY);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({ valid: true, userId: user.id });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./prismaClient'); // Import Prisma
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

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
    const accessToken = jwt.sign({ username: user.username }, ACCESS_SECRET, {
      expiresIn: '15m', // Short-lived token
    });

    const refreshToken = jwt.sign({ username: user.username }, REFRESH_SECRET, {
      expiresIn: '7d', // Long-lived refresh token
    });

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

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });

    const newAccessToken = jwt.sign(
      { username: user.username },
      ACCESS_SECRET,
      {
        expiresIn: '15m',
      }
    );

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

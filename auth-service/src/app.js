const express = require('express');
const oasGenerator = require('express-oas-generator');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

oasGenerator.init(app, {});

app.get('/', (req, res) => {
  res.send('Auth Service is Running!');
});

app.use('/api/auth', authRoutes);

module.exports = app;

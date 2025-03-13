const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    await authService.register(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(
      username,
      password
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

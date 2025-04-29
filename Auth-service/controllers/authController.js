const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('Incoming Register Request:', req.body);

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Auth Service Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Respond with token and user info
    res.status(200).json({
      token,
      user: {
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Verify token endpoint
exports.verifyToken = async (req, res) => {
  try {
    // The auth middleware has already verified the token and added the decoded user to req.user
    // Just return the user information
    return res.status(200).json({
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role
    });
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
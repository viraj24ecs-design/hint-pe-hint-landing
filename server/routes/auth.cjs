const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');

// Sign Up Route
router.post('/signup', async (req, res) => {
  console.log('📝 Signup request received');
  console.log('Request body:', req.body);
  
  try {
    const { username, name, email, dateOfBirth, password, confirmPassword } = req.body;

    // Validation
    if (!username || !name || !email || !dateOfBirth || !password || !confirmPassword) {
      console.log('❌ Missing fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    // Generate unique userId
    const userId = await User.generateUserId();

    // Create new user
    const user = new User({
      userId,
      username,
      name,
      email,
      dateOfBirth,
      password,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        userId: user.userId,
        username: user.username,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        charityCoins: user.charityCoins || 0,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Update login activity
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    console.log(`✅ User ${username} logged in. Total logins: ${user.loginCount}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        username: user.username,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        charityCoins: user.charityCoins || 0,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get User Profile Route (requires authentication)
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    const user = await User.findOne({ userId: decoded.userId }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        userId: user.userId,
        username: user.username,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        charityCoins: user.charityCoins || 0,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Admin Route: Get all users activity (for testing - add proper auth in production)
router.get('/users-activity', async (req, res) => {
  try {
    const users = await User.find()
      .select('userId username name email lastLogin loginCount createdAt charityCoins')
      .sort({ lastLogin: -1 }); // Most recent login first

    res.json({
      totalUsers: users.length,
      users: users.map(user => ({
        userId: user.userId,
        username: user.username,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin || 'Never logged in',
        loginCount: user.loginCount || 0,
        charityCoins: user.charityCoins || 0,
      })),
    });
  } catch (error) {
    console.error('Users activity error:', error);
    res.status(500).json({ error: 'Error fetching user activity' });
  }
});

// Update user coins (for game mechanics)
router.post('/update-coins', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    const { coinsToAdd } = req.body;

    if (typeof coinsToAdd !== 'number' || coinsToAdd < 0) {
      return res.status(400).json({ error: 'Invalid coin amount' });
    }

    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.charityCoins = (user.charityCoins || 0) + coinsToAdd;
    await user.save();

    console.log(`💰 User ${user.username} earned ${coinsToAdd} coins. Total: ${user.charityCoins}`);

    res.json({
      message: 'Coins updated successfully',
      charityCoins: user.charityCoins,
    });
  } catch (error) {
    console.error('Update coins error:', error);
    res.status(500).json({ error: 'Error updating coins' });
  }
});

module.exports = router;

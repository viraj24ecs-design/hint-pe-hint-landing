const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// MongoDB Connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hint-pe-hint';
  
  await mongoose.connect(MONGODB_URI);

  cachedDb = mongoose.connection;
  return cachedDb;
}

// User Schema
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if model exists before creating
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Connect to database
    await connectToDatabase();

    const { path } = req.query;
    const endpoint = path ? path[0] : '';

    // Signup endpoint
    if (endpoint === 'signup' && req.method === 'POST') {
      const { username, name, email, dateOfBirth, password, confirmPassword } = req.body;

      // Validation
      if (!username || !name || !email || !dateOfBirth || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        if (existingUser.email === email) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }

      // Generate unique userId
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create new user
      const user = new User({
        userId,
        username,
        name,
        email,
        dateOfBirth: new Date(dateOfBirth),
        password,
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.userId, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          userId: user.userId,
          username: user.username,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
        }
      });
    }

    // Login endpoint
    if (endpoint === 'login' && req.method === 'POST') {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Find user
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Update login count
      user.loginCount += 1;
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.userId, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          userId: user.userId,
          username: user.username,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
        }
      });
    }

    // Verify endpoint
    if (endpoint === 'verify' && req.method === 'GET') {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      );

      const user = await User.findOne({ userId: decoded.userId }).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        user: {
          userId: user.userId,
          username: user.username,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
        }
      });
    }

    // Route not found
    return res.status(404).json({ error: 'Route not found', endpoint, method: req.method });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

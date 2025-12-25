import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// MongoDB Connection with caching
let cachedDb = null;

async function connectToDatabase() {
  try {
    if (cachedDb && mongoose.connection.readyState === 1) {
      return cachedDb;
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
    }

    cachedDb = mongoose.connection;
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 0 },
  charityCoins: { type: Number, default: 0, min: 0 },
  bookProgress: {
    trialBook: { type: Number, default: 0, min: 0, max: 100 },
    richDadPoorDad: { type: Number, default: 0, min: 0, max: 100 },
    atomicHabits: { type: Number, default: 0, min: 0, max: 100 },
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { coinsToAdd } = req.body;

    if (typeof coinsToAdd !== 'number') {
      return res.status(400).json({ error: 'Invalid coin amount' });
    }

    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newTotal = (user.charityCoins || 0) + coinsToAdd;
    user.charityCoins = Math.max(0, newTotal); // Ensure coins never go below 0
    await user.save();

    console.log(`💰 User ${user.username} ${coinsToAdd > 0 ? 'earned' : 'lost'} ${Math.abs(coinsToAdd)} coins. Total: ${user.charityCoins}`);

    return res.status(200).json({
      message: 'Coins updated successfully',
      charityCoins: user.charityCoins,
    });

  } catch (error) {
    console.error('Update Coins Error:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message
    });
  }
};

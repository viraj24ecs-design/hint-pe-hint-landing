const jwt = require('jsonwebtoken');
const User = require('../../server/models/User.cjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get book progress from request body
    const { bookId, progress } = req.body;

    if (!bookId || progress === undefined) {
      return res.status(400).json({ error: 'Book ID and progress are required' });
    }

    // Validate bookId
    const validBookIds = ['trialBook', 'richDadPoorDad', 'atomicHabits'];
    if (!validBookIds.includes(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }

    // Validate progress (0-100)
    const validProgress = Math.min(100, Math.max(0, progress));

    // Find user and update book progress
    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize bookProgress if it doesn't exist
    if (!user.bookProgress) {
      user.bookProgress = {
        trialBook: 0,
        richDadPoorDad: 0,
        atomicHabits: 0,
      };
    }

    // Update the specific book's progress
    user.bookProgress[bookId] = validProgress;
    await user.save();

    return res.status(200).json({
      message: 'Book progress updated successfully',
      bookProgress: user.bookProgress,
    });

  } catch (error) {
    console.error('Update progress error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    return res.status(500).json({ error: 'Server error' });
  }
};

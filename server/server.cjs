const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.cjs');

const app = express();

// CORS Configuration - MUST be before routes
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Allow localhost and 192.168.x.x network
    if (origin.startsWith('http://localhost') || 
        origin.startsWith('http://127.0.0.1') || 
        origin.match(/^http:\/\/192\.168\.\d+\.\d+/)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser middleware
app.use(express.json());

const sandeshSchema = new mongoose.Schema({
  content: String,
});
const Sandesh = mongoose.model('Sandesh', sandeshSchema, 'sandeshTest');
let fallbackSandesh = 'No message found';

// Route to GET the data for Display page
app.get('/api/sandesh', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const data = await Sandesh.findOne();
      const sandesh = data ? data.content : fallbackSandesh;
      return res.json({ sandesh });
    }

    return res.json({ sandesh: fallbackSandesh, source: 'memory' });
  } catch (err) {
    return res.json({ sandesh: fallbackSandesh, source: 'memory' });
  }
});

// Route to UPDATE the data from Edit page
app.post('/api/sandesh', async (req, res) => {
  try {
    const { newSandesh } = req.body || {};

    if (typeof newSandesh !== 'string' || !newSandesh.trim()) {
      return res.status(400).json({ error: 'newSandesh is required' });
    }

    fallbackSandesh = newSandesh;

    if (mongoose.connection.readyState === 1) {
      await Sandesh.findOneAndUpdate({}, { content: newSandesh }, { upsert: true });
      return res.status(200).json({ message: 'Updated Successfully', source: 'mongodb' });
    }

    return res.status(200).json({ message: 'Updated in memory (MongoDB unavailable)', source: 'memory' });
  } catch (err) {
    return res.status(200).json({ message: 'Updated in memory (MongoDB unavailable)', source: 'memory' });
  }
});

// ConLimit model - per-book concept round limiter
const conLimitSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  conLimit: { type: Number, required: true, min: 1, max: 10, default: 10 },
});
const ConLimit = mongoose.model('ConLimit', conLimitSchema, 'conLimits');

// Route to GET conLimit for a book
app.get('/api/conlimit', async (req, res) => {
  try {
    const { bookId } = req.query;
    if (!bookId) {
      return res.status(400).json({ error: 'bookId query param is required' });
    }

    if (mongoose.connection.readyState === 1) {
      const doc = await ConLimit.findOne({ bookId });
      return res.json({ conLimit: doc?.conLimit ?? 10 });
    }

    return res.json({ conLimit: 10, source: 'fallback' });
  } catch (err) {
    console.error('GET /api/conlimit error:', err.message);
    return res.json({ conLimit: 10, source: 'fallback' });
  }
});

// Route to SET conLimit for a book
app.post('/api/conlimit', async (req, res) => {
  try {
    const { bookId, conLimit } = req.body || {};

    if (!bookId || typeof bookId !== 'string') {
      return res.status(400).json({ error: 'bookId is required' });
    }

    const limit = Number(conLimit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
      return res.status(400).json({ error: 'conLimit must be an integer between 1 and 10' });
    }

    if (mongoose.connection.readyState === 1) {
      await ConLimit.findOneAndUpdate(
        { bookId },
        { conLimit: limit },
        { upsert: true }
      );
      return res.status(200).json({ message: 'Updated successfully', bookId, conLimit: limit });
    }

    return res.status(200).json({ message: 'MongoDB unavailable', source: 'memory' });
  } catch (err) {
    console.error('POST /api/conlimit error:', err.message);
    return res.status(500).json({ error: 'Failed to update conLimit' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hint-pe-hint';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

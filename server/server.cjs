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

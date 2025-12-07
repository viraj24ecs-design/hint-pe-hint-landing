// Vercel Serverless Function
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../server/routes/auth.cjs');

const app = express();

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:8080', 'https://your-vercel-app.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB (reuse connection if exists)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  
  await mongoose.connect(MONGODB_URI);
  cachedDb = mongoose.connection;
  return cachedDb;
}

// Routes
app.use('/api/auth', authRoutes);

// Export as serverless function
module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};

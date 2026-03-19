const mongoose = require('mongoose');

// In-memory fallback (persists across warm Lambda invocations)
let fallbackSandesh = 'No message found';
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not set');
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    });
  }
  cachedDb = mongoose.connection;
  return cachedDb;
}

const sandeshSchema = new mongoose.Schema({ content: String });
const Sandesh =
  mongoose.models.Sandesh || mongoose.model('Sandesh', sandeshSchema, 'sandeshTest');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — fetch the current sandesh
  if (req.method === 'GET') {
    try {
      await connectToDatabase();
      const data = await Sandesh.findOne();
      return res.status(200).json({ sandesh: data ? data.content : fallbackSandesh });
    } catch (err) {
      console.error('GET /api/sandesh error:', err.message);
      return res.status(200).json({ sandesh: fallbackSandesh, source: 'memory' });
    }
  }

  // POST — update the sandesh
  if (req.method === 'POST') {
    try {
      const { newSandesh } = req.body || {};
      if (typeof newSandesh !== 'string' || !newSandesh.trim()) {
        return res.status(400).json({ error: 'newSandesh is required' });
      }
      fallbackSandesh = newSandesh;
      await connectToDatabase();
      await Sandesh.findOneAndUpdate({}, { content: newSandesh }, { upsert: true });
      return res.status(200).json({ message: 'Updated successfully', source: 'mongodb' });
    } catch (err) {
      console.error('POST /api/sandesh error:', err.message);
      // Even if MongoDB fails, update in-memory and return 200 so edit_page doesn't throw
      return res.status(200).json({ message: 'Updated in memory (MongoDB unavailable)', source: 'memory' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

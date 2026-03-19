import mongoose from 'mongoose';

// In-memory fallback
let fallbackSandesh = 'No message found';
let cachedDb = null;

const CONNECT_TIMEOUT_MS = 5000;

function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return Promise.resolve(cachedDb);
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) return Promise.reject(new Error('MONGODB_URI is not set'));

  const connectPromise = (async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
        connectTimeoutMS: CONNECT_TIMEOUT_MS,
        socketTimeoutMS: CONNECT_TIMEOUT_MS,
      });
    }
    cachedDb = mongoose.connection;
    return cachedDb;
  })();

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('MongoDB connection timed out')), CONNECT_TIMEOUT_MS)
  );

  return Promise.race([connectPromise, timeoutPromise]);
}

// Guard against model re-registration on warm lambdas
let Sandesh;
try {
  Sandesh =
    mongoose.models.Sandesh ||
    mongoose.model('Sandesh', new mongoose.Schema({ content: String }), 'sandeshTest');
} catch (e) {
  Sandesh = mongoose.model('Sandesh');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — fetch current sandesh
  if (req.method === 'GET') {
    try {
      await connectToDatabase();
      const data = await Sandesh.findOne().maxTimeMS(4000);
      return res.status(200).json({ sandesh: data?.content ?? fallbackSandesh });
    } catch (err) {
      console.error('GET /api/sandesh error:', err.message);
      return res.status(200).json({ sandesh: fallbackSandesh, source: 'memory' });
    }
  }

  // POST — update sandesh
  if (req.method === 'POST') {
    try {
      const { newSandesh } = req.body || {};
      if (typeof newSandesh !== 'string' || !newSandesh.trim()) {
        return res.status(400).json({ error: 'newSandesh is required' });
      }
      fallbackSandesh = newSandesh;
      await connectToDatabase();
      await Sandesh.findOneAndUpdate(
        {},
        { content: newSandesh },
        { upsert: true }
      ).maxTimeMS(4000);
      return res.status(200).json({ message: 'Updated successfully', source: 'mongodb' });
    } catch (err) {
      console.error('POST /api/sandesh error:', err.message);
      return res.status(200).json({ message: 'Updated in memory (MongoDB unavailable)', source: 'memory' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

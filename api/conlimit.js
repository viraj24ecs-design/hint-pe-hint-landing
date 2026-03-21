import mongoose from 'mongoose';

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
let ConLimit;
try {
  ConLimit =
    mongoose.models.ConLimit ||
    mongoose.model(
      'ConLimit',
      new mongoose.Schema({
        bookId: { type: String, required: true, unique: true },
        conLimit: { type: Number, required: true, min: 1, max: 10, default: 10 },
      }),
      'conLimits'
    );
} catch (e) {
  ConLimit = mongoose.model('ConLimit');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — fetch conLimit for a book
  if (req.method === 'GET') {
    try {
      const { bookId } = req.query;
      if (!bookId) {
        return res.status(400).json({ error: 'bookId query param is required' });
      }

      await connectToDatabase();
      const doc = await ConLimit.findOne({ bookId }).maxTimeMS(4000);
      return res.status(200).json({ conLimit: doc?.conLimit ?? 10 });
    } catch (err) {
      console.error('GET /api/conlimit error:', err.message);
      return res.status(200).json({ conLimit: 10, source: 'fallback' });
    }
  }

  // POST — set conLimit for a book
  if (req.method === 'POST') {
    try {
      const { bookId, conLimit } = req.body || {};

      if (!bookId || typeof bookId !== 'string') {
        return res.status(400).json({ error: 'bookId is required' });
      }

      const limit = Number(conLimit);
      if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
        return res.status(400).json({ error: 'conLimit must be an integer between 1 and 10' });
      }

      await connectToDatabase();
      await ConLimit.findOneAndUpdate(
        { bookId },
        { conLimit: limit },
        { upsert: true }
      ).maxTimeMS(4000);

      return res.status(200).json({ message: 'Updated successfully', bookId, conLimit: limit });
    } catch (err) {
      console.error('POST /api/conlimit error:', err.message);
      return res.status(500).json({ error: `Failed to update conLimit: ${err.message}` });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

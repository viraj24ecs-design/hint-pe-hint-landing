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

let BookData;
try {
  BookData =
    mongoose.models.BookData ||
    mongoose.model(
      'BookData',
      new mongoose.Schema({
        bookId: { type: String, required: true, unique: true },
        hints: [{ type: String, default: '' }],
        answers: [{ type: String, default: '' }],
        correctButtonIds: [{ type: Number, default: 0 }],
        decoyEnabled: { type: Boolean, default: false },
        decoys: [{ text: { type: String, default: '' }, position: { type: Number, default: 0 } }],
      }),
      'bookData'
    );
} catch (e) {
  BookData = mongoose.model('BookData');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const { bookId } = req.query;
      if (!bookId) {
        return res.status(400).json({ error: 'bookId query param is required' });
      }

      await connectToDatabase();
      const doc = await BookData.findOne({ bookId }).maxTimeMS(4000);
      if (!doc) {
        return res.status(200).json({ bookId, hints: [], answers: [], correctButtonIds: [], decoyEnabled: false, decoys: [] });
      }
      return res.status(200).json({
        bookId: doc.bookId,
        hints: doc.hints,
        answers: doc.answers,
        correctButtonIds: doc.correctButtonIds,
        decoyEnabled: doc.decoyEnabled ?? false,
        decoys: doc.decoys ?? [],
      });
    } catch (err) {
      console.error('GET /api/bookdata error:', err.message);
      return res.status(200).json({ bookId: req.query.bookId, hints: [], answers: [], correctButtonIds: [], source: 'fallback' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { bookId, hints, answers, correctButtonIds, decoyEnabled, decoys } = req.body || {};

      if (!bookId || typeof bookId !== 'string') {
        return res.status(400).json({ error: 'bookId is required' });
      }
      if (!Array.isArray(hints) || !Array.isArray(answers) || !Array.isArray(correctButtonIds)) {
        return res.status(400).json({ error: 'hints, answers, and correctButtonIds must be arrays' });
      }

      await connectToDatabase();
      await BookData.findOneAndUpdate(
        { bookId },
        { hints, answers, correctButtonIds, decoyEnabled: !!decoyEnabled, decoys: decoys || [] },
        { upsert: true }
      ).maxTimeMS(4000);

      return res.status(200).json({ message: 'Saved successfully', bookId });
    } catch (err) {
      console.error('POST /api/bookdata error:', err.message);
      return res.status(500).json({ error: 'Failed to save book data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

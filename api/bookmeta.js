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

let BookMeta;
try {
  BookMeta =
    mongoose.models.BookMeta ||
    mongoose.model(
      'BookMeta',
      new mongoose.Schema({
        bookId: { type: String, required: true, unique: true },
        bookTitle: { type: String, default: '' },
        coverImage: { type: String, default: '' },   // base64 data URL
        gameBgImage: { type: String, default: '' },   // base64 data URL
      }),
      'bookMeta'
    );
} catch (e) {
  BookMeta = mongoose.model('BookMeta');
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
      const doc = await BookMeta.findOne({ bookId }).maxTimeMS(4000);
      if (!doc) {
        return res.status(200).json({ bookId, bookTitle: '', coverImage: '', gameBgImage: '' });
      }
      return res.status(200).json({
        bookId: doc.bookId,
        bookTitle: doc.bookTitle ?? '',
        coverImage: doc.coverImage ?? '',
        gameBgImage: doc.gameBgImage ?? '',
      });
    } catch (err) {
      console.error('GET /api/bookmeta error:', err.message);
      return res.status(200).json({ bookId: req.query.bookId, bookTitle: '', coverImage: '', gameBgImage: '', source: 'fallback' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { bookId, bookTitle, coverImage, gameBgImage } = req.body || {};

      if (!bookId || typeof bookId !== 'string') {
        return res.status(400).json({ error: 'bookId is required' });
      }

      const updateObj = {};
      if (typeof bookTitle === 'string') updateObj.bookTitle = bookTitle;
      if (typeof coverImage === 'string') updateObj.coverImage = coverImage;
      if (typeof gameBgImage === 'string') updateObj.gameBgImage = gameBgImage;

      await connectToDatabase();
      await BookMeta.findOneAndUpdate(
        { bookId },
        updateObj,
        { upsert: true }
      ).maxTimeMS(4000);

      return res.status(200).json({ message: 'Saved successfully', bookId });
    } catch (err) {
      console.error('POST /api/bookmeta error:', err.message);
      return res.status(500).json({ error: `Failed to save book meta: ${err.message}` });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

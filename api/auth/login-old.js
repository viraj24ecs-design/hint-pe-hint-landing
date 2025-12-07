import mongoose from 'mongoose';import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';import jwt from 'jsonwebtoken';



let cachedDb = null;// MongoDB Connection with caching for serverless

let cachedDb = null;

async function connectToDatabase() {

  try {async function connectToDatabase() {

    if (cachedDb && mongoose.connection.readyState === 1) {  try {

      return cachedDb;    if (cachedDb && mongoose.connection.readyState === 1) {

    }      return cachedDb;

    const MONGODB_URI = process.env.MONGODB_URI;    }

    if (!MONGODB_URI) throw new Error('MONGODB_URI not set');

    if (mongoose.connection.readyState === 0) {    const MONGODB_URI = process.env.MONGODB_URI;

      await mongoose.connect(MONGODB_URI, {    

        serverSelectionTimeoutMS: 30000,    if (!MONGODB_URI) {

        socketTimeoutMS: 45000,      throw new Error('MONGODB_URI environment variable is not set');

      });    }

    }    

    cachedDb = mongoose.connection;    if (mongoose.connection.readyState === 0) {

    return cachedDb;      await mongoose.connect(MONGODB_URI, {

  } catch (error) {        serverSelectionTimeoutMS: 30000,

    throw new Error(`MongoDB connection failed: ${error.message}`);        socketTimeoutMS: 45000,

  }      });

}    }



const userSchema = new mongoose.Schema({    cachedDb = mongoose.connection;

  userId: { type: String, required: true, unique: true },    return cachedDb;

  username: { type: String, required: true, unique: true, trim: true },  } catch (error) {

  name: { type: String, required: true },    console.error('MongoDB connection error:', error);

  email: { type: String, required: true, unique: true, lowercase: true },    throw new Error(`Failed to connect to MongoDB: ${error.message}`);

  dateOfBirth: { type: Date, required: true },  }

  password: { type: String, required: true },}

  createdAt: { type: Date, default: Date.now },

  loginCount: { type: Number, default: 0 },// User Schema

});const userSchema = new mongoose.Schema({

  userId: { type: String, required: true, unique: true },

userSchema.pre('save', async function() {  username: { type: String, required: true, unique: true, trim: true },

  if (!this.isModified('password')) return;  name: { type: String, required: true },

  const salt = await bcrypt.genSalt(10);  email: { type: String, required: true, unique: true, lowercase: true },

  this.password = await bcrypt.hash(this.password, salt);  dateOfBirth: { type: Date, required: true },

});  password: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },

userSchema.methods.comparePassword = async function(candidatePassword) {  loginCount: { type: Number, default: 0 },

  return await bcrypt.compare(candidatePassword, this.password);});

};

userSchema.pre('save', async function() {

const User = mongoose.models.User || mongoose.model('User', userSchema);  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);

export default async (req, res) => {  this.password = await bcrypt.hash(this.password, salt);

  res.setHeader('Content-Type', 'application/json');});

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');userSchema.methods.comparePassword = async function(candidatePassword) {

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');  return await bcrypt.compare(candidatePassword, this.password);

};

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });const User = mongoose.models.User || mongoose.model('User', userSchema);



  try {export default async (req, res) => {

    await connectToDatabase();  res.setHeader('Content-Type', 'application/json');

    const { username, password } = req.body;  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (!username || !password) {  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return res.status(400).json({ error: 'Username and password required' });

    }  if (req.method === 'OPTIONS') {

    return res.status(200).end();

    const user = await User.findOne({ username });  }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

export default async (req, res) => {

    const isValid = await user.comparePassword(password);  res.setHeader('Content-Type', 'application/json');

    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    user.loginCount += 1;  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    await user.save();

  if (req.method === 'OPTIONS') {

    const token = jwt.sign(    return res.status(200).end();

      { userId: user.userId, username: user.username },  }

      process.env.JWT_SECRET || 'default-secret',

      { expiresIn: '7d' }  if (req.method !== 'POST') {

    );    return res.status(405).json({ error: 'Method not allowed' });

  }

    return res.status(200).json({

      message: 'Login successful',  try {

      token,    await connectToDatabase();

      user: {

        userId: user.userId,    const { username, password } = req.body;

        username: user.username,

        name: user.name,    if (!username || !password) {

        email: user.email,      return res.status(400).json({ error: 'Username and password are required' });

        dateOfBirth: user.dateOfBirth    }

      }

    });    const user = await User.findOne({ username });

  } catch (error) {

    console.error('Login error:', error);    if (!user) {

    return res.status(500).json({ error: 'Internal server error', message: error.message });      return res.status(401).json({ error: 'Invalid username or password' });

  }    }

};

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    user.loginCount += 1;
    await user.save();

    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { userId: user.userId, username: user.username, name: user.name, email: user.email, dateOfBirth: user.dateOfBirth }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message
    });
  }
};
      const { username, name, email, dateOfBirth, password, confirmPassword } = req.body;

      if (!username || !name || !email || !dateOfBirth || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });

      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        if (existingUser.email === email) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }

      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = new User({ userId, username, name, email, dateOfBirth: new Date(dateOfBirth), password });
      await user.save();

      const token = jwt.sign(
        { userId: user.userId, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'User created successfully',
        token,
        user: { userId: user.userId, username: user.username, name: user.name, email: user.email, dateOfBirth: user.dateOfBirth }
      });
    }

    if (endpoint === 'login' && req.method === 'POST') {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      user.loginCount += 1;
      await user.save();

      const token = jwt.sign(
        { userId: user.userId, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { userId: user.userId, username: user.username, name: user.name, email: user.email, dateOfBirth: user.dateOfBirth }
      });
    }

    if (endpoint === 'verify' && req.method === 'GET') {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      const user = await User.findOne({ userId: decoded.userId }).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        user: { userId: user.userId, username: user.username, name: user.name, email: user.email, dateOfBirth: user.dateOfBirth }
      });
    }

    return res.status(404).json({ error: 'Route not found', endpoint, method: req.method });

  } catch (error) {
    console.error('API Error:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

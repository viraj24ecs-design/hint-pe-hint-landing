const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  charityCoins: {
    type: Number,
    default: 0,
    min: 0,
  },
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate unique userId
userSchema.statics.generateUserId = async function() {
  let userId;
  let isUnique = false;
  
  while (!isUnique) {
    userId = 'USER' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const existingUser = await this.findOne({ userId });
    if (!existingUser) isUnique = true;
  }
  
  return userId;
};

module.exports = mongoose.model('User', userSchema);

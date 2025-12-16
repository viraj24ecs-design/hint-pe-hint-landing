// Script to add charityCoins to existing users
// Run this with: node scripts/migrate-add-coins.cjs

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// User Schema (same as in server/models/User.cjs)
const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  name: String,
  email: String,
  dateOfBirth: Date,
  password: String,
  createdAt: Date,
  lastLogin: Date,
  loginCount: Number,
  charityCoins: { type: Number, default: 0, min: 0 },
});

const User = mongoose.model('User', userSchema);

async function migrateUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Checking users without charityCoins field...');
    const usersWithoutCoins = await User.find({ charityCoins: { $exists: false } });
    console.log(`Found ${usersWithoutCoins.length} users without charityCoins field`);

    if (usersWithoutCoins.length > 0) {
      console.log('\n💰 Adding charityCoins field to existing users...');
      const result = await User.updateMany(
        { charityCoins: { $exists: false } },
        { $set: { charityCoins: 0 } }
      );
      console.log(`✅ Updated ${result.modifiedCount} users`);
    } else {
      console.log('✅ All users already have charityCoins field');
    }

    console.log('\n📋 Current users:');
    const allUsers = await User.find({}).select('userId username name charityCoins');
    allUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.name}): ${user.charityCoins ?? 0} coins`);
    });

    console.log('\n✅ Migration complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers();

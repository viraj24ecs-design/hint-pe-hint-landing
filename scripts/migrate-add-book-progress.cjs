const mongoose = require('mongoose');
const User = require('../server/models/User.cjs');
require('dotenv').config({ path: '.env.local' });

async function migrateBookProgress() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Update all users to have bookProgress field
    const result = await User.updateMany(
      { bookProgress: { $exists: false } },
      {
        $set: {
          bookProgress: {
            trialBook: 0,
            richDadPoorDad: 0,
            atomicHabits: 0,
          }
        }
      }
    );

    console.log(`✅ Migration completed successfully!`);
    console.log(`   Updated ${result.modifiedCount} user(s)`);

    // Show all users with their book progress
    const users = await User.find({}, 'username name bookProgress');
    console.log('\n📚 Current users and their book progress:');
    users.forEach(user => {
      console.log(`   ${user.username} (${user.name}):`, user.bookProgress);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the migration
migrateBookProgress();

// backend/config/db.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  try {
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected');
      return;
    }

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log('MongoDB connected to in-memory server');
  } catch (error) {
    if (mongoUri && /127\.0\.0\.1|localhost/.test(mongoUri)) {
      console.warn('Local MongoDB not available, falling back to in-memory server.');
      try {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        console.log('MongoDB connected to in-memory server');
        return;
      } catch (fallbackError) {
        console.error('MongoDB fallback connection error:', fallbackError.message);
        throw fallbackError;
      }
    }

    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

module.exports = connectDB;

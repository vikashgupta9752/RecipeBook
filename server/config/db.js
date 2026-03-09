const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('../seed');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Attempting to start in-memory MongoDB...');
    try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log(`In-memory MongoDB started at ${uri}`);
        
        process.env.MONGO_URI = uri;

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
        
        console.log('Seeding in-memory database...');
        await seedData(false);
        console.log('Seeding complete.');
        
    } catch (err) {
        console.error(`Fatal Error: Could not start in-memory MongoDB: ${err.message}`);
        process.exit(1);
    }
  }
};

module.exports = connectDB;

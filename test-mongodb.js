// test-mongodb.js
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  console.log('MongoDB DB:', process.env.MONGODB_DB);
  
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }
  
  if (!process.env.MONGODB_DB) {
    console.error('MONGODB_DB is not defined in .env.local');
    process.exit(1);
  }
  
  const client = new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    waitQueueTimeoutMS: 30000,
  });
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB!');
    
    const db = client.db(process.env.MONGODB_DB);
    console.log('Connected to database:', process.env.MONGODB_DB);
    
    // Test the connection
    const result = await db.command({ ping: 1 });
    console.log('Ping result:', result);
    
    // Create a test user if it doesn't exist
    const usersCollection = db.collection('users');
    const testUser = await usersCollection.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('Creating test user...');
      const result = await usersCollection.insertOne({
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://via.placeholder.com/150',
        resumes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Test user created:', result.insertedId);
    } else {
      console.log('Test user already exists:', testUser._id);
    }
    
    console.log('MongoDB connection test completed successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  } finally {
    await client.close();
  }
}

main().catch(console.error); 
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { User } from '@/models/User';
require('dotenv').config({ path: '.env.local' });

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { MongoClient } = require('mongodb');
    const uri = process.env.MONGODB_URI;
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      waitQueueTimeoutMS: 30000,
      useNewUrlParser: true, 
      useUnifiedTopology: true
    };

    const client = new MongoClient(uri, options);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);

    try {
      await client.connect();
      console.log('Connected to database');
    } catch (error) {
      console.error('Database connection error:', error);
      throw new Error('Database connection failed');
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email });

    // const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
} 
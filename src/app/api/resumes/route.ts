import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface Resume {
  _id: string | ObjectId;
  template?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: any[];
  education?: any[];
  skills?: string[];
  [key: string]: any;
}

interface User {
  _id: string | ObjectId;
  email: string;
  name?: string;
  image?: string;
  resumes?: Resume[];
  [key: string]: any;
}

export async function GET(req: Request) {
  try {
    console.log('GET /api/resumes - Starting request');
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('GET /api/resumes - Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('GET /api/resumes - User ID:', session.user.id);

    const { db } = await connectToDatabase();
    console.log('GET /api/resumes - Connected to database');
    
    // First, try to find the user
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(session.user.id) }
    ) as User | null;

    console.log('GET /api/resumes - User found:', !!user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if resumes array exists
    if (!user.resumes || !Array.isArray(user.resumes)) {
      console.log('GET /api/resumes - No resumes array found');
      return NextResponse.json([]);
    }

    // Return all resumes
    return NextResponse.json(user.resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log('POST /api/resumes - Starting request');
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('POST /api/resumes - Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    console.log('POST /api/resumes - Request data:', data);
    
    const { db } = await connectToDatabase();
    console.log('POST /api/resumes - Connected to database');

    // Create a new resume with a unique ID
    const newResume = {
      _id: new ObjectId().toString(),
      ...data,
      template: data.template || 'modern',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update the user document by pushing the new resume to the resumes array
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $push: { resumes: newResume } }
    );

    console.log('POST /api/resumes - Update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
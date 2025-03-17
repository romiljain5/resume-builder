import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    console.log('GET /api/debug/user - Starting request');
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('GET /api/debug/user - Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('GET /api/debug/user - User ID:', session.user.id);

    const { db } = await connectToDatabase();
    console.log('GET /api/debug/user - Connected to database');
    
    // Get the user data
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(session.user.id) }
    );

    console.log('GET /api/debug/user - User found:', !!user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Sanitize the user data for the response
    const sanitizedUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      resumeCount: user.resumes?.length || 0,
      resumeIds: user.resumes?.map((r: any) => ({
        _id: r._id,
        template: r.template,
        fullName: r.fullName
      })) || []
    };

    return NextResponse.json(sanitizedUser);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
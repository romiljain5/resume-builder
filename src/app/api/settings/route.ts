import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/lib/auth';

// Helper function to get user ID from request
async function getUserId(req: Request) {
  // Try to get session from server
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }
  
  // If no session, try to get from Authorization header
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { openaiApiKey } = await req.json();

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find user and update API key
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { openaiApiKey: openaiApiKey } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find user
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      hasApiKey: !!user.openaiApiKey,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
} 
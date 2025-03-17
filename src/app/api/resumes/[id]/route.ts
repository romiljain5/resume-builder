import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

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

// Add this function to delete old preview images
async function deleteOldPreviews(resumeId: string) {
  try {
    // Define the directory where previews are stored
    const publicDir = path.join(process.cwd(), 'public');
    const templatesDir = path.join(publicDir, 'templates');
    const previewsDir = path.join(templatesDir, 'previews');
    
    // Check if the directory exists
    if (!fs.existsSync(previewsDir)) {
      return;
    }
    
    // Get all files in the directory
    const files = fs.readdirSync(previewsDir);
    
    // Find files that match the pattern: resumeId-*
    const matchingFiles = files.filter(file => 
      file.startsWith(`${resumeId}-`) && file.endsWith('.png')
    );
    
    // Delete matching files
    for (const file of matchingFiles) {
      fs.unlinkSync(path.join(previewsDir, file));
    }
  } catch (error) {
    console.error('Error deleting old previews:', error);
    // Don't throw, just log the error
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('GET /api/resumes/[id] - Starting request');
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      console.log('GET /api/resumes/[id] - Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('GET /api/resumes/[id] - User ID:', session.user.id);
    console.log('GET /api/resumes/[id] - Resume ID:', id);

    const { db } = await connectToDatabase();
    console.log('GET /api/resumes/[id] - Connected to database');
    
    // First, try to find the user
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(session.user.id) }
    ) as User | null;

    console.log('GET /api/resumes/[id] - User found:', !!user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize resumes array if it doesn't exist
    if (!user.resumes) {
      console.log('GET /api/resumes/[id] - No resumes array found');
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    console.log('GET /api/resumes/[id] - User has', user.resumes.length, 'resumes');
    
    // Log all resume IDs for debugging
    console.log('GET /api/resumes/[id] - All resume IDs:', user.resumes.map(r => r._id?.toString()));

    // Find the specific resume
    const resume = user.resumes.find((r: Resume) => {
      if (!r._id) return false;
      const resumeId = r._id.toString();
      const paramsId = id;
      console.log('GET /api/resumes/[id] - Comparing resume ID:', resumeId, 'with params ID:', paramsId);
      return resumeId === paramsId;
    });

    console.log('GET /api/resumes/[id] - Resume found:', !!resume);

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Detailed error in GET /api/resumes/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT /api/resumes/[id] - Starting request');
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(session.user.id) }
    ) as User | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.resumes) {
      return NextResponse.json({ error: 'No resumes found' }, { status: 404 });
    }

    const resumeIndex = user.resumes.findIndex((r: Resume) => r._id.toString() === id);

    if (resumeIndex === -1) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    user.resumes[resumeIndex] = {
      ...user.resumes[resumeIndex],
      ...data,
      updatedAt: new Date()
    };

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          resumes: user.resumes
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete old preview images
    await deleteOldPreviews(id);

    return NextResponse.json(user.resumes[resumeIndex]);
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('DELETE /api/resumes/[id] - Starting request');
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(session.user.id) }
    ) as User | null;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.resumes) {
      return NextResponse.json({ error: 'No resumes found' }, { status: 404 });
    }

    user.resumes = user.resumes.filter((r: Resume) => r._id.toString() !== id);

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          resumes: user.resumes
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PATCH /api/resumes/[id] - Starting request');
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      console.log('PATCH /api/resumes/[id] - Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('PATCH /api/resumes/[id] - User ID:', session.user.id);
    console.log('PATCH /api/resumes/[id] - Resume ID:', id);

    const body = await request.json();
    console.log('PATCH /api/resumes/[id] - Request body:', body);
    
    const { db } = await connectToDatabase();
    console.log('PATCH /api/resumes/[id] - Connected to database');

    // First, check if the user and resume exist
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(session.user.id) }
    ) as User | null;

    console.log('PATCH /api/resumes/[id] - User found:', !!user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.resumes || user.resumes.length === 0) {
      console.log('PATCH /api/resumes/[id] - No resumes found for user');
      return NextResponse.json({ error: 'No resumes found' }, { status: 404 });
    }

    console.log('PATCH /api/resumes/[id] - User has', user.resumes.length, 'resumes');
    
    // Log all resume IDs for debugging
    console.log('PATCH /api/resumes/[id] - All resume IDs:', user.resumes.map(r => r._id?.toString()));

    // Find the resume index
    const resumeIndex = user.resumes.findIndex((r: Resume) => {
      if (!r._id) return false;
      const resumeId = r._id.toString();
      const paramsId = id;
      console.log('PATCH /api/resumes/[id] - Comparing resume ID:', resumeId, 'with params ID:', paramsId);
      return resumeId === paramsId;
    });

    console.log('PATCH /api/resumes/[id] - Resume index:', resumeIndex);

    if (resumeIndex === -1) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Update the resume directly in the array
    user.resumes[resumeIndex] = {
      ...user.resumes[resumeIndex],
      template: body.template,
      updatedAt: new Date()
    };

    // Update the entire resumes array
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          resumes: user.resumes
        }
      }
    );

    console.log('PATCH /api/resumes/[id] - Update result:', result);

    if (result.matchedCount === 0) {
      console.log('PATCH /api/resumes/[id] - No documents matched the query');
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      console.log('PATCH /api/resumes/[id] - No documents were modified');
      return NextResponse.json({ error: 'Resume not modified' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      resume: user.resumes[resumeIndex]
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
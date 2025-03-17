import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  try {
    console.log('GET /api/resumes/create-test-resume - Starting request');
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('GET /api/resumes/create-test-resume - Unauthorized');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('GET /api/resumes/create-test-resume - User ID:', session.user.id);

    const { db } = await connectToDatabase();
    console.log('GET /api/resumes/create-test-resume - Connected to database');
    
    // Create a test resume
    const testResume = {
      _id: new ObjectId().toString(),
      template: 'modern',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      summary: 'Experienced software developer with a passion for building great products.',
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Developer',
          startDate: '2020-01',
          endDate: 'Present',
          description: 'Leading development team on various projects.'
        }
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          startDate: '2016-09',
          endDate: '2020-05',
          description: 'Computer Science'
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('GET /api/resumes/create-test-resume - Test resume ID:', testResume._id);

    // Update the user document by pushing the new resume to the resumes array
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { 
        $push: { resumes: testResume },
        $setOnInsert: { 
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log('GET /api/resumes/create-test-resume - Update result:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Test resume created successfully', 
      resumeId: testResume._id,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (error) {
    console.error('Error creating test resume:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const resumeId = url.searchParams.get('resumeId');
    
    if (!resumeId) {
      return NextResponse.json(
        { error: 'Missing resumeId parameter' },
        { status: 400 }
      );
    }
    
    // Define the directory where previews are stored
    const publicDir = path.join(process.cwd(), 'public');
    const templatesDir = path.join(publicDir, 'templates');
    const previewsDir = path.join(templatesDir, 'previews');
    
    // Check if the directory exists
    if (!fs.existsSync(previewsDir)) {
      return NextResponse.json({ success: true, message: 'No previews to delete' });
    }
    
    // Get all files in the directory
    const files = fs.readdirSync(previewsDir);
    
    // Find files that match the pattern: resumeId-*
    const matchingFiles = files.filter(file => 
      file.startsWith(`${resumeId}-`) && file.endsWith('.png')
    );
    
    // Delete matching files
    let deletedCount = 0;
    for (const file of matchingFiles) {
      fs.unlinkSync(path.join(previewsDir, file));
      deletedCount++;
    }
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} preview images`
    });
  } catch (error) {
    console.error('Error deleting previews:', error);
    return NextResponse.json(
      { error: 'Failed to delete previews' },
      { status: 500 }
    );
  }
} 
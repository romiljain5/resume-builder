import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(req.url);
    const resumeId = url.searchParams.get('resumeId');
    const templateName = url.searchParams.get('templateName');
    
    if (!resumeId || !templateName) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Define the directory where previews are stored
    const publicDir = path.join(process.cwd(), 'public');
    const templatesDir = path.join(publicDir, 'templates');
    const previewsDir = path.join(templatesDir, 'previews');
    
    // Check if the directory exists
    if (!fs.existsSync(previewsDir)) {
      return NextResponse.json({ previewUrl: null });
    }
    
    // Get all files in the directory
    const files = fs.readdirSync(previewsDir);
    
    // Find files that match the pattern: resumeId-templateName-*
    const matchingFiles = files.filter(file => 
      file.startsWith(`${resumeId}-${templateName}-`) && file.endsWith('.png')
    );
    
    // If we found a matching file, return its URL
    if (matchingFiles.length > 0) {
      // Sort by creation time (newest first) and take the first one
      const newestFile = matchingFiles
        .map(file => ({
          name: file,
          time: fs.statSync(path.join(previewsDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time)[0].name;
      
      return NextResponse.json({
        previewUrl: `/templates/previews/${newestFile}`
      });
    }
    
    // No matching file found
    return NextResponse.json({ previewUrl: null });
  } catch (error) {
    console.error('Error checking preview:', error);
    return NextResponse.json(
      { error: 'Failed to check preview' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Function to generate a simple unique ID without external dependencies
function generateUniqueId(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Function to save a base64 image to the file system
async function saveBase64Image(base64Data: string, resumeId: string, templateName: string): Promise<string> {
  // Remove the data URL prefix
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
  
  // Create buffer from base64
  const buffer = Buffer.from(base64Image, 'base64');
  
  // Ensure directory exists
  const publicDir = path.join(process.cwd(), 'public');
  const templatesDir = path.join(publicDir, 'templates');
  const previewsDir = path.join(templatesDir, 'previews');
  
  // Create directories if they don't exist
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }
  
  if (!fs.existsSync(previewsDir)) {
    fs.mkdirSync(previewsDir, { recursive: true });
  }
  
  // Generate a unique filename with timestamp and random string
  const timestamp = Date.now();
  const randomId = generateUniqueId();
  const filename = `${resumeId}-${templateName}-${timestamp}-${randomId}.png`;
  const filePath = path.join(previewsDir, filename);
  
  // Write the file
  fs.writeFileSync(filePath, buffer);
  
  // Return the public URL
  return `/templates/previews/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse request body
    const body = await req.json();
    const { previewImage, resumeId, templateName } = body;
    
    if (!previewImage || !resumeId || !templateName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save the image
    const imageUrl = await saveBase64Image(previewImage, resumeId, templateName);
    
    // Return the URL
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error saving preview image:', error);
    return NextResponse.json(
      { error: 'Failed to save preview image' },
      { status: 500 }
    );
  }
} 
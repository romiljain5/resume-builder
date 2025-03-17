import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Anthropic from '@anthropic-ai/sdk';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/lib/auth';

// Initialize Anthropic with API key from environment variables
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured on the server' },
        { status: 500 }
      );
    }

    const { template } = await req.json();

    const prompt = `Generate a professional resume content in JSON format for a ${template} template. Include the following sections:
    - Full name (a professional name)
    - Email (a professional email)
    - Phone (a formatted phone number)
    - Summary (a compelling professional summary)
    - Experience (2-3 professional experiences with company, position, dates, and descriptions)
    - Education (2 educational entries with institution, degree, dates, and descriptions)
    - Skills (10-15 relevant professional skills)

    Format the response as a valid JSON object matching this structure:
    {
      "fullName": string,
      "email": string,
      "phone": string,
      "summary": string,
      "experience": [
        {
          "company": string,
          "position": string,
          "startDate": string,
          "endDate": string,
          "description": string
        }
      ],
      "education": [
        {
          "institution": string,
          "degree": string,
          "startDate": string,
          "endDate": string,
          "description": string
        }
      ],
      "skills": string[]
    }`;

    try {
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4000,
        system: "You are a professional resume writer. Generate realistic and professional resume content.",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      // Get the content from the first content block
      let content = '';
      if (message.content && message.content.length > 0) {
        const firstBlock = message.content[0];
        if (firstBlock.type === 'text') {
          content = firstBlock.text;
        }
      }

      if (!content) {
        throw new Error('No content generated');
      }

      try {
        const resumeData = JSON.parse(content);
        return NextResponse.json(resumeData);
      } catch (parseError) {
        console.error('Error parsing Claude response:', parseError);
        return NextResponse.json(
          { error: 'Failed to parse the generated resume data' },
          { status: 500 }
        );
      }
    } catch (claudeError: any) {
      console.error('Claude API error:', claudeError);
      
      // Check for specific Claude error messages
      const errorMessage = claudeError.message || 'Unknown error';
      
      if (errorMessage.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid Anthropic API key configured on the server' },
          { status: 401 }
        );
      }
      
      if (errorMessage.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Anthropic API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: `Claude API error: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume content' },
      { status: 500 }
    );
  }
} 
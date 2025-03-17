import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Anthropic from '@anthropic-ai/sdk';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
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

    // Initialize Anthropic with API key from environment variables
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    try {
      // Test the API key with a simple message
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Hello, Claude! Please respond with a simple "Hello, I am Claude Sonnet!" to test the connection.',
          },
        ],
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Anthropic API connection successful',
        response: message.content[0]?.type === 'text' ? message.content[0].text : 'No text response'
      });
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
      
      return NextResponse.json(
        { error: `Claude API error: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error testing Claude API:', error);
    return NextResponse.json(
      { error: 'Failed to test Claude API connection' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createUserPrompt, generateResumeSystemPrompt, validateResumeData } from '@/config/openai';

// Initialize Anthropic with API key from environment variables
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Get the prompt from the request body
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured on the server' },
        { status: 500 }
      );
    }

    try {
      // Create completion using Claude
      const systemPrompt = generateResumeSystemPrompt();
      const userPrompt = createUserPrompt(prompt);
      
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
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
        return NextResponse.json(
          { error: 'No content generated from Claude' },
          { status: 500 }
        );
      }

      try {
        // Parse the JSON response
        const parsedData = JSON.parse(content);
        
        // Validate the parsed data
        const validatedData = validateResumeData(parsedData);
        
        return NextResponse.json(validatedData);
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
    console.error('Error generating resume content:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume content' },
      { status: 500 }
    );
  }
} 
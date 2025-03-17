import { ResumeFormData } from '@/types/resume';

/**
 * Generate resume content using OpenAI API via server endpoint
 * @param prompt User's prompt for resume generation
 * @returns Generated resume data or error
 */
export async function generateResumeWithAI(
  apiKey: string,
  prompt: string
): Promise<ResumeFormData> {
  if (!prompt) {
    throw new Error('Prompt is required');
  }

  try {
    // Call the server-side API endpoint instead of using OpenAI directly
    const response = await fetch('/api/generate-resume-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate resume with OpenAI');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error generating resume:', error);
    throw error;
  }
} 
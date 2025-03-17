import { ResumeFormData } from '@/types/resume';

// Define the JSON schema for the resume data
const resumeSchema = {
  type: 'object',
  properties: {
    fullName: {
      type: 'string',
      description: 'Full name of the person',
    },
    email: {
      type: 'string',
      description: 'Email address',
    },
    phone: {
      type: 'string',
      description: 'Phone number',
    },
    location: {
      type: 'string',
      description: 'City and state/country',
    },
    summary: {
      type: 'string',
      description: 'Professional summary or objective statement',
    },
    experience: {
      type: 'array',
      description: 'Work experience',
      items: {
        type: 'object',
        properties: {
          company: {
            type: 'string',
            description: 'Company name',
          },
          position: {
            type: 'string',
            description: 'Job title',
          },
          startDate: {
            type: 'string',
            description: 'Start date (MM/YYYY)',
          },
          endDate: {
            type: 'string',
            description: 'End date (MM/YYYY) or "Present"',
          },
          description: {
            type: 'string',
            description: 'Job responsibilities and achievements',
          },
        },
        required: ['company', 'position', 'startDate', 'description'],
      },
    },
    education: {
      type: 'array',
      description: 'Educational background',
      items: {
        type: 'object',
        properties: {
          institution: {
            type: 'string',
            description: 'School or university name',
          },
          degree: {
            type: 'string',
            description: 'Degree obtained',
          },
          startDate: {
            type: 'string',
            description: 'Start date (MM/YYYY)',
          },
          endDate: {
            type: 'string',
            description: 'End date (MM/YYYY) or "Present"',
          },
          description: {
            type: 'string',
            description: 'Additional information about education',
          },
        },
        required: ['institution', 'degree', 'startDate'],
      },
    },
    skills: {
      type: 'array',
      description: 'Professional skills',
      items: {
        type: 'string',
      },
    },
    interests: {
      type: 'array',
      description: 'Personal interests or hobbies',
      items: {
        type: 'string',
      },
    },
  },
  required: ['fullName', 'email', 'summary', 'experience', 'education', 'skills'],
};

// System prompt for OpenAI
export function generateResumeSystemPrompt(): string {
  return `You are a professional resume writer. Your task is to generate a realistic and professional resume based on the user's input.

The resume should be returned as a valid JSON object that follows this schema:
${JSON.stringify(resumeSchema, null, 2)}

Make sure to:
1. Generate realistic and professional content
2. Include specific details and achievements
3. Use action verbs and quantifiable results in experience descriptions
4. Keep the content concise and relevant
5. Return ONLY valid JSON that matches the schema exactly
6. Do not include any explanations or text outside the JSON structure
7. Ensure all required fields are included`;
}

// Create a user prompt with the schema
export function createUserPrompt(userPrompt: string): string {
  return `Please generate a professional resume based on the following information:

${userPrompt}

Remember to follow the schema exactly and return only valid JSON.`;
}

// Validate the resume data against the schema
export function validateResumeData(data: any): ResumeFormData {
  // Check required fields
  const requiredFields = ['fullName', 'email', 'summary', 'experience', 'education', 'skills'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate experience items
  if (!Array.isArray(data.experience)) {
    throw new Error('Experience must be an array');
  }
  
  for (const exp of data.experience) {
    if (!exp.company || !exp.position || !exp.startDate || !exp.description) {
      throw new Error('Each experience item must have company, position, startDate, and description');
    }
  }

  // Validate education items
  if (!Array.isArray(data.education)) {
    throw new Error('Education must be an array');
  }
  
  for (const edu of data.education) {
    if (!edu.institution || !edu.degree || !edu.startDate) {
      throw new Error('Each education item must have institution, degree, and startDate');
    }
  }

  // Validate skills
  if (!Array.isArray(data.skills)) {
    throw new Error('Skills must be an array');
  }

  // Return the validated data
  return data as ResumeFormData;
} 
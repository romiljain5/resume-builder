import { z } from 'zod';

export const resumeSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  photoUrl: z.string().url('Invalid URL format').optional(),
  summary: z.string().min(1, 'Professional summary is required'),
  experience: z.array(z.object({
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
  })),
  education: z.array(z.object({
    institution: z.string().min(1, 'Institution name is required'),
    degree: z.string().min(1, 'Degree is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    description: z.string().optional(),
  })),
  skills: z.array(z.string().min(1, 'Skill is required')),
  interests: z.array(z.string()).optional(),
  template: z.string().optional(),
});

export type ResumeFormData = z.infer<typeof resumeSchema>; 
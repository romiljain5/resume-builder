'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ResumeForm } from '@/components/resume-form';
import { ResumeFormData, resumeSchema } from '@/types/resume';

// Sample data for the "Fill with Sample Data" button
const randomData: ResumeFormData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  summary: 'Experienced software developer with a passion for creating efficient and scalable solutions. Skilled in full-stack development and team leadership.',
  experience: [
    {
      position: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      startDate: '2020-01',
      endDate: 'Present',
      description: 'Lead developer for multiple enterprise applications. Implemented new features and optimized performance.',
    },
    {
      position: 'Software Developer',
      company: 'Digital Innovations',
      startDate: '2018-03',
      endDate: '2019-12',
      description: 'Developed and maintained web applications using modern technologies.',
    },
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      startDate: '2014-09',
      endDate: '2018-05',
      description: 'Graduated with honors. Focus on software engineering and data structures.',
    },
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'SQL',
    'Git',
    'AWS',
    'Docker',
    'Agile',
  ],
};

export default function NewResume() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const template = searchParams.get('template') || 'modern';
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ResumeFormData>({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      summary: '',
      experience: [
        { company: '', position: '', startDate: '', endDate: '', description: '' },
        { company: '', position: '', startDate: '', endDate: '', description: '' },
        { company: '', position: '', startDate: '', endDate: '', description: '' },
      ],
      education: [
        { institution: '', degree: '', startDate: '', endDate: '', description: '' },
        { institution: '', degree: '', startDate: '', endDate: '', description: '' },
      ],
      skills: ['', '', '', '', ''],
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const generateWithAI = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const data = await response.json();
      
      // Update form with AI-generated content
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof ResumeFormData, value as any);
      });

      // Save the generated content to the database
      const saveResponse = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({
          ...data,
          template,
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save resume');
      }

      toast.success('Resume content generated and saved successfully!');
    } catch (error) {
      toast.error('Failed to generate resume content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFillRandomData = () => {
    // Fill form with random data
    Object.entries(randomData).forEach(([key, value]) => {
      setValue(key as keyof ResumeFormData, value as any);
    });
    
    // Update the form data state
    setFormData(randomData);
    
    toast.success('Form filled with sample data');
  };

  const onSubmit = async (data: ResumeFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({
          ...data,
          template,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save resume');
      }

      toast.success('Resume saved successfully!');
      
      // Redirect to the home page after successful save
      router.push('/');
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save resume. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Resume</h1>
        <div className="space-x-4">
          <Button
            onClick={generateWithAI}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
          <Button onClick={handleFillRandomData} variant="outline">
            Fill with Sample Data
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <ResumeForm
          initialData={formData}
          onSubmit={onSubmit}
          onChange={setFormData}
        />
      </div>
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ResumeForm } from '@/components/resume-form';
import { ResumeFormData } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ResumeEditClientProps {
  id: string;
}

// Interface for the nested data structure
interface NestedResumeData {
  title?: string;
  content?: ResumeFormData;
  template?: string;
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

const ResumeEditClient = ({ id }: ResumeEditClientProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [resume, setResume] = useState<ResumeFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resumes/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resume');
        }
        const data = await response.json();
        console.log('Resume data fetched:', data);
        
        // Handle both nested and flat data structures
        if ('content' in data && data.content) {
          // It's a nested structure
          setResume({
            ...data.content,
            template: data.template || data.content.template || 'modern'
          });
        } else {
          // It's a flat structure
          setResume(data);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
        toast.error('Failed to load resume');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchResume();
    }
  }, [id, session?.user?.id]);

  const handleSubmit = async (data: ResumeFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update resume');
      }

      toast.success('Resume updated successfully');
      router.push(`/resume/${id}`);
    } catch (error) {
      console.error('Error updating resume:', error);
      toast.error('Failed to update resume');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Resume not found</h1>
          <p className="mt-2 text-gray-600">The resume you're looking for doesn't exist or you don't have access to it.</p>
          <Button
            onClick={() => router.push('/')}
            className="mt-4"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/resume/${id}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resume
        </Button>
        <h1 className="text-3xl font-bold">Edit Resume Content</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <ResumeForm
          initialData={resume}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ResumeEditClient; 
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getTemplateInfo } from '@/config/templates';
import { ResumeFormData } from '@/types/resume';
import { toast } from 'sonner';
import { AIResumeGenerator } from '@/components/ai-resume-generator';
import { DynamicResumePreview } from '@/components/dynamic-resume-preview';
import { ResumeCard } from '@/components/resume-card';

// Interface for the nested data structure
interface NestedResumeData {
  title?: string;
  content?: ResumeFormData;
  template?: string;
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

interface Resume extends ResumeFormData {
  _id: string;
  template: string;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<(Resume | NestedResumeData)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('/api/resumes/', {
          headers: {
            'Authorization': `Bearer ${session?.user?.id}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch resumes');
        }

        const data = await response.json();
        console.log('Fetched resumes:', data);
        setResumes(data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        toast.error('Failed to load resumes');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchResumes();
    }
  }, [session?.user?.id, router]);

  // Helper function to get template name from resume data
  const getResumeTemplate = (resume: Resume | NestedResumeData): string => {
    if ('content' in resume && resume.content) {
      // It's a nested structure
      return resume.template || resume.content.template || 'modern';
    } else {
      // It's a flat structure
      return (resume as Resume).template || 'modern';
    }
  };

  // Helper function to get resume name
  const getResumeName = (resume: Resume | NestedResumeData): string => {
    if ('content' in resume && resume.content) {
      // It's a nested structure
      return resume.content.fullName || 'Untitled Resume';
    } else {
      // It's a flat structure
      return (resume as Resume).fullName || 'Untitled Resume';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAIGenerator(true)}
          >
            Generate with Claude
          </Button>
          <Link href="/resume/new">
            <Button>Create New Resume</Button>
          </Link>
        </div>
      </div>

      {/* AI Resume Generator Modal */}
      <AIResumeGenerator 
        open={showAIGenerator} 
        onOpenChange={setShowAIGenerator} 
      />

      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No resumes yet</h2>
          <p className="text-gray-600 mb-6">Create your first resume to get started!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAIGenerator(true)}
            >
              Generate with Claude
            </Button>
            <Link href="/resume/new">
              <Button>Create Resume</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard key={resume._id} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';
import { ResumeFormData } from '@/types/resume';
import { getTemplateInfo } from '@/config/templates';
import { DynamicResumePreview } from './dynamic-resume-preview';
import { RegeneratePreviewButton } from './regenerate-preview-button';
import { useState, useEffect } from 'react';

// Interface for the nested data structure
interface NestedResumeData {
  title?: string;
  content?: ResumeFormData;
  template?: string;
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

interface ResumeCardProps {
  resume: ResumeFormData | NestedResumeData;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  
  // Helper function to get template name from resume data
  const getResumeTemplate = (resume: ResumeFormData | NestedResumeData): string => {
    if ('content' in resume && resume.content) {
      // It's a nested structure
      return resume.template || resume.content.template || 'modern';
    } else {
      // It's a flat structure
      return (resume as any).template || 'modern';
    }
  };

  // Helper function to get resume name
  const getResumeName = (resume: ResumeFormData | NestedResumeData): string => {
    if ('content' in resume && resume.content) {
      // It's a nested structure
      return resume.content.fullName || 'Untitled Resume';
    } else {
      // It's a flat structure
      return (resume as any).fullName || 'Untitled Resume';
    }
  };
  
  const templateName = getResumeTemplate(resume);
  const templateInfo = getTemplateInfo(templateName);
  
  // Handle preview errors
  const handlePreviewError = () => {
    setPreviewError(true);
    console.error('Failed to load dynamic preview, falling back to static preview');
  };

  // Set a timeout to fall back to static preview if dynamic preview takes too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!previewError) {
        console.log('Dynamic preview taking too long, falling back to static preview');
        setPreviewError(true);
      }
    }, 3000); // 3 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [previewError]);
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/resume/${resume._id}`}
        className="block"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform group-hover:scale-105">
          <div className="aspect-[3/4] bg-gray-100 relative">
            {previewError ? (
              // Fallback to static preview image
              templateInfo.preview ? (
                <img
                  src={templateInfo.preview}
                  alt={templateInfo.name}
                  className="object-contain h-full w-full"
                  onError={() => {
                    console.error('Static preview also failed to load');
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  No Preview Available
                </div>
              )
            ) : (
              // Try dynamic preview first
              <DynamicResumePreview 
                resumeData={resume}
                className="w-full h-full"
                onPreviewReady={() => setPreviewError(false)}
              />
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">
              {getResumeName(resume)}
            </h3>
            <p className="text-sm text-gray-600">
              {templateInfo.name} Template
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Created {new Date(resume.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Link>
      
      {/* Regenerate button that appears on hover */}
      {isHovered && (
        <div className="absolute top-2 right-2 z-10">
          <RegeneratePreviewButton 
            resumeData={resume}
            variant="secondary"
            size="sm"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
            onSuccess={() => setPreviewError(false)}
          />
        </div>
      )}
    </div>
  );
} 
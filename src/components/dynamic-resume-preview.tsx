import { useState, useEffect } from 'react';
import { ResumeFormData } from '@/types/resume';
import { ResumePreviewGenerator } from './resume-preview-generator';
import { useResumePreview } from '@/hooks/useResumePreview';
import { toast } from 'sonner';

// Interface for the nested data structure
interface NestedResumeData {
  title?: string;
  content?: ResumeFormData;
  template?: string;
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

interface DynamicResumePreviewProps {
  resumeData: ResumeFormData | NestedResumeData;
  className?: string;
  onPreviewReady?: (imageUrl: string) => void;
}

export function DynamicResumePreview({
  resumeData,
  className = '',
  onPreviewReady,
}: DynamicResumePreviewProps) {
  const [cachedPreviewUrl, setCachedPreviewUrl] = useState<string | null>(null);
  const [shouldGeneratePreview, setShouldGeneratePreview] = useState(true);
  
  // Get template info from the resume data
  const getTemplateName = (): string => {
    if ('content' in resumeData && resumeData.content) {
      return resumeData.template || resumeData.content.template || 'modern';
    } else {
      return (resumeData as any).template || 'modern';
    }
  };
  
  // Get resume ID
  const getResumeId = (): string => {
    return 'content' in resumeData ? resumeData._id : (resumeData as any)._id;
  };
  
  // Use the resume preview hook
  const { 
    isGenerating, 
    previewUrl, 
    handlePreviewGenerated 
  } = useResumePreview({
    onSuccess: (imageUrl) => {
      setCachedPreviewUrl(imageUrl);
      if (onPreviewReady) {
        onPreviewReady(imageUrl);
      }
    },
    onError: (error) => {
      toast.error(`Failed to generate preview: ${error.message}`);
    },
  });
  
  // Check if we already have a cached preview
  useEffect(() => {
    const checkCachedPreview = async () => {
      try {
        // Construct a potential URL based on the resume ID and template
        const resumeId = getResumeId();
        const templateName = getTemplateName();
        
        // Try to fetch the existing preview from the templates directory
        const response = await fetch(`/api/check-preview?resumeId=${resumeId}&templateName=${templateName}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.previewUrl) {
            setCachedPreviewUrl(data.previewUrl);
            setShouldGeneratePreview(false);
          }
        }
      } catch (error) {
        console.error('Error checking cached preview:', error);
        // If there's an error, we'll generate a new preview
        setShouldGeneratePreview(true);
      }
    };
    
    checkCachedPreview();
  }, [resumeData]);
  
  // Handle preview generation
  const onPreviewGenerated = async (previewImageData: string) => {
    if (shouldGeneratePreview) {
      await handlePreviewGenerated(previewImageData, resumeData);
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Show loading state */}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
      
      {/* If we have a cached preview, show it */}
      {cachedPreviewUrl ? (
        <div className="aspect-[3/4] w-full overflow-hidden rounded-md border border-gray-200">
          <img 
            src={cachedPreviewUrl} 
            alt="Resume Preview" 
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        /* Otherwise, generate a new preview */
        <ResumePreviewGenerator 
          resumeData={resumeData} 
          onPreviewGenerated={onPreviewGenerated}
        />
      )}
    </div>
  );
} 
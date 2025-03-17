import { useState } from 'react';
import { ResumeFormData } from '@/types/resume';

// Interface for the nested data structure
interface NestedResumeData {
  title?: string;
  content?: ResumeFormData;
  template?: string;
  _id: string;
  createdAt: string;
  updatedAt?: string;
}

interface UseResumePreviewOptions {
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: Error) => void;
}

export function useResumePreview(options?: UseResumePreviewOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Function to save a preview image to the server
  const savePreviewImage = async (
    previewImage: string,
    resumeId: string,
    templateName: string
  ): Promise<string> => {
    try {
      const response = await fetch('/api/resume-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          previewImage,
          resumeId,
          templateName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preview image');
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (err) {
      console.error('Error saving preview:', err);
      throw err;
    }
  };

  // Function to handle preview generation
  const handlePreviewGenerated = async (
    previewImage: string,
    resumeData: ResumeFormData | NestedResumeData
  ) => {
    try {
      setIsGenerating(true);
      setError(null);

      // Get resume ID
      const resumeId = 'content' in resumeData ? resumeData._id : (resumeData as any)._id;

      // Get template name
      const templateName = 'content' in resumeData 
        ? resumeData.template || resumeData.content?.template || 'modern'
        : (resumeData as ResumeFormData).template || 'modern';

      // Save the preview image
      const imageUrl = await savePreviewImage(previewImage, resumeId, templateName);
      
      setPreviewUrl(imageUrl);
      
      // Call success callback if provided
      if (options?.onSuccess) {
        options.onSuccess(imageUrl);
      }
      
      return imageUrl;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      // Call error callback if provided
      if (options?.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    previewUrl,
    error,
    handlePreviewGenerated,
  };
} 
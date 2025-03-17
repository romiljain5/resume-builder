import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResumeFormData } from '@/types/resume';
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

interface RegeneratePreviewButtonProps {
  resumeData: ResumeFormData | NestedResumeData;
  onSuccess?: (imageUrl: string) => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function RegeneratePreviewButton({
  resumeData,
  onSuccess,
  variant = 'outline',
  size = 'sm',
  className = '',
}: RegeneratePreviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get resume ID
  const getResumeId = (): string => {
    return 'content' in resumeData ? resumeData._id : (resumeData as any)._id;
  };
  
  // Get template name
  const getTemplateName = (): string => {
    if ('content' in resumeData && resumeData.content) {
      return resumeData.template || resumeData.content.template || 'modern';
    } else {
      return (resumeData as any).template || 'modern';
    }
  };
  
  // Function to delete old previews
  const deleteOldPreviews = async (resumeId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/delete-previews?resumeId=${resumeId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete old previews');
      }
    } catch (error) {
      console.error('Error deleting old previews:', error);
      throw error;
    }
  };
  
  // Function to handle regeneration
  const handleRegenerate = async () => {
    try {
      setIsLoading(true);
      
      // Get resume ID and template name
      const resumeId = getResumeId();
      const templateName = getTemplateName();
      
      // Delete old previews
      await deleteOldPreviews(resumeId);
      
      toast.success('Preview regeneration initiated');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess('');
      }
      
      // Wait a moment before reloading to allow the callback to complete
      setTimeout(() => {
        // Force reload the page to trigger regeneration
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Error regenerating preview:', error);
      toast.error('Failed to regenerate preview');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleRegenerate}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2">⟳</span>
          Regenerating...
        </>
      ) : (
        <>Regenerate Preview</>
      )}
    </Button>
  );
} 
import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { ResumeFormData } from '@/types/resume';
import { ModernTemplate } from './resume-templates/modern';
import { ClassicTemplate } from './resume-templates/classic';
import { MinimalTemplate } from './resume-templates/minimal';
import { GreenTemplate } from './resume-templates/green';
import { MinimalTwoTemplate } from './resume-templates/minimalTwo';

// Interface for the nested data structure
interface NestedResumeData {
  title?: string;
  content?: ResumeFormData;
  template?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ResumePreviewGeneratorProps {
  resumeData: ResumeFormData | NestedResumeData;
  onPreviewGenerated?: (previewUrl: string) => void;
  width?: number;
  height?: number;
  scale?: number;
}

export function ResumePreviewGenerator({
  resumeData,
  onPreviewGenerated,
  width = 800,
  height = 1100,
  scale = 0.75, // Increased scale for better quality
}: ResumePreviewGeneratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  // Helper function to determine which template to render
  const getTemplateComponent = (templateName: string) => {
    switch (templateName) {
      case 'modern':
        return <ModernTemplate data={resumeData} />;
      case 'classic':
        return <ClassicTemplate data={resumeData} />;
      case 'minimal':
        return <MinimalTemplate data={resumeData} />;
      case 'green':
        return <GreenTemplate data={resumeData} />;
      case 'minimalTwo':
        return <MinimalTwoTemplate data={resumeData} />;
      default:
        return <ModernTemplate data={resumeData} />;
    }
  };

  // Get template name from resume data
  const getTemplateName = (): string => {
    if ('content' in resumeData && resumeData.content) {
      return resumeData.template || resumeData.content.template || 'modern';
    } else {
      return (resumeData as ResumeFormData).template || 'modern';
    }
  };

  useEffect(() => {
    // Function to generate preview
    const generatePreview = async () => {
      if (!containerRef.current) return;
      
      try {
        setIsGenerating(true);
        
        // Wait for content to render
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate canvas from the rendered template
        const canvas = await html2canvas(containerRef.current, {
          scale: scale,
          logging: false,
          useCORS: true, // Enable CORS for images
          allowTaint: true,
          backgroundColor: '#ffffff',
        });
        
        // Convert to data URL with higher quality
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        setPreviewUrl(dataUrl);
        
        // Call callback if provided
        if (onPreviewGenerated) {
          onPreviewGenerated(dataUrl);
        }
      } catch (error) {
        console.error('Error generating preview:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    generatePreview();
  }, [resumeData, onPreviewGenerated, scale]);

  return (
    <div>
      {/* Hidden container for rendering the template */}
      <div 
        ref={containerRef}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`, 
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          overflow: 'hidden'
        }}
      >
        {getTemplateComponent(getTemplateName())}
      </div>
      
      {/* Preview display */}
      {previewUrl ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-gray-200">
          <img 
            src={previewUrl} 
            alt="Resume Preview" 
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="aspect-[3/4] w-full flex items-center justify-center bg-gray-100 rounded-md">
          {isGenerating ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          ) : (
            <span className="text-gray-500">Preview not available</span>
          )}
        </div>
      )}
    </div>
  );
} 
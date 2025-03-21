'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TemplateSelector } from '@/components/template-selector';
import { ModernTemplate } from '@/components/resume-templates/modern';
import { ClassicTemplate } from '@/components/resume-templates/classic';
import { MinimalTemplate } from '@/components/resume-templates/minimal';
import { ResumeFormData } from '@/types/resume';
import { generatePDF } from '@/lib/pdf-utils';
import { GreenTemplate } from '@/components/resume-templates/green';
import { MinimalTwoTemplate } from '@/components/resume-templates/minimalTwo';

interface ResumePageClientProps {
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

const ResumePageClient = ({ id }: ResumePageClientProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [resume, setResume] = useState<ResumeFormData | NestedResumeData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

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
        setResume(data);
        
        // Get template from the appropriate location
        const template = data.template || (data.content && data.content.template) || 'modern';
        console.log('Setting template to:', template);
        setSelectedTemplate(template);
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

  const handleTemplateChange = async (template: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ template }),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      setSelectedTemplate(template);
      toast.success('Template updated successfully');
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    }
  };

  // Function to generate and download PDF
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) {
      toast.error('Resume reference is not available.');
      console.error('Resume reference is null or undefined');
      return;
    }

    // Check if the resume container has content
    if (resumeRef.current.children.length === 0) {
      toast.error('Resume content is not ready. Please wait for the template to load completely.');
      console.error('Resume container is empty');
      return;
    }

    // Check if the resume container has a reasonable size
    const { offsetWidth, offsetHeight } = resumeRef.current;
    if (offsetWidth < 100 || offsetHeight < 100) {
      toast.error('Resume content appears to be invalid. Please try refreshing the page.');
      console.error(`Resume container has invalid dimensions: ${offsetWidth}x${offsetHeight}`);
      return;
    }

    try {
      toast.info('Preparing your PDF...');
      console.log('Starting PDF generation process');
      console.log('Resume reference:', resumeRef.current);

      // Get resume name for the filename
      let resumeName = 'resume';
      if (resume) {
        if ('content' in resume && resume.content && resume.content.fullName) {
          resumeName = resume.content.fullName.replace(/\s+/g, '_').toLowerCase();
        } else if ('fullName' in resume && resume.fullName) {
          resumeName = resume.fullName.replace(/\s+/g, '_').toLowerCase();
        }
      }
      console.log('Using filename base:', resumeName);

      // Ensure the generatePDF function is defined and properly implemented
      if (typeof generatePDF !== 'function') {
        const error = new Error('PDF generation function is not defined.');
        console.error(error);
        throw error;
      }

      // Generate the PDF using our utility function
      const filename = `${resumeName}_${selectedTemplate}_resume.pdf`;
      console.log('Generating PDF with filename:', filename);
      
      try {
        await generatePDF(
          resumeRef.current,
          filename
        );
        toast.success('PDF downloaded successfully!');
      } catch (pdfError: any) {
        console.error('PDF generation error:', pdfError);
        
        // Check if the error is related to oklch
        if (pdfError.message && pdfError.message.includes('oklch')) {
          toast.error('PDF generation failed due to color format issues. Trying alternative method...');
          
          // Try again with print method
          handlePrintResume();
        } else {
          // Rethrow for general error handling
          throw pdfError;
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        if (error.message.includes('oklch')) {
          // If the error is related to oklch color function, offer a fallback
          toast.error('PDF generation failed due to color format issues. Would you like to try printing instead?', {
            action: {
              label: 'Print',
              onClick: () => handlePrintResume()
            },
            duration: 10000
          });
        } else if (error.message.includes('html2canvas')) {
          toast.error('Failed to capture resume content. Try using the print option instead.', {
            action: {
              label: 'Print',
              onClick: () => handlePrintResume()
            },
            duration: 10000
          });
        } else if (error.message.includes('jspdf')) {
          toast.error('Failed to create PDF document. Try using the print option instead.', {
            action: {
              label: 'Print',
              onClick: () => handlePrintResume()
            },
            duration: 10000
          });
        } else {
          toast.error(`Failed to generate PDF: ${error.message}. Try using the print option instead.`, {
            action: {
              label: 'Print',
              onClick: () => handlePrintResume()
            },
            duration: 10000
          });
        }
      } else {
        toast.error('Failed to generate PDF. Try using the print option instead.', {
          action: {
            label: 'Print',
            onClick: () => handlePrintResume()
          },
          duration: 10000
        });
      }
    }
  };

  // Fallback method using browser print functionality
  const handlePrintResume = () => {
    try {
      // Add print-specific styles
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          @page {
            size: A4;
            margin: 0.5cm;
          }
          body * {
            visibility: hidden;
          }
          .resume-template-wrapper, .resume-template-wrapper * {
            visibility: visible;
          }
          .resume-template-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
          }
          .no-print {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Trigger print
      window.print();
      
      // Remove the style after printing
      setTimeout(() => {
        document.head.removeChild(style);
      }, 1000);
    } catch (error) {
      console.error('Error printing resume:', error);
      toast.error('Failed to print resume. Please try again.');
    }
  };

  // Function to navigate to the edit page
  const handleEditContent = () => {
    router.push(`/resume/${id}/edit`);
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
            onClick={() => router.push('/resumes')}
            className="mt-4"
          >
            Go to Resumes
          </Button>
        </div>
      </div>
    );
  }

  // Helper function to get resume name
  const getResumeName = () => {
    if ('content' in resume && resume.content && resume.content.fullName) {
      return resume.content.fullName;
    } else if ('fullName' in resume) {
      return resume.fullName;
    }
    return 'Untitled Resume';
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate data={resume} />;
      case 'classic':
        return <ClassicTemplate data={resume} />;
      case 'minimal':
        return <MinimalTemplate data={resume} />;
      case 'green':
        return <GreenTemplate data={resume} />;
      case 'minimalTwo':
        return <MinimalTwoTemplate data={resume} />;
      default:
        return <ModernTemplate data={resume} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 no-print">
        <h1 className="text-3xl font-bold">{getResumeName()}'s Resume</h1>
        <div className="space-x-4">
          <Button
            onClick={handleEditContent}
            variant="default"
            className="no-print"
          >
            Edit Content
          </Button>
          <Button
            onClick={() => setIsEditingTemplate(!isEditingTemplate)}
            variant="outline"
            className="no-print"
          >
            {isEditingTemplate ? 'Cancel' : 'Change Template'}
          </Button>
          <Button onClick={handleDownloadPDF} className="no-print">
            Download PDF
          </Button>
          <Button onClick={handlePrintResume} variant="outline" className="no-print">
            Print
          </Button>
        </div>
      </div>

      {isEditingTemplate ? (
        <div className="bg-white rounded-lg shadow-lg p-8 no-print">
          <h2 className="text-xl font-semibold mb-4">Select Template</h2>
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onSelect={handleTemplateChange}
          />
        </div>
      ) : (
        <div 
          className={`bg-white rounded-lg shadow-lg p-8 resume-template-wrapper template-${selectedTemplate}`} 
          ref={resumeRef}
        >
          {renderTemplate()}
        </div>
      )}
    </div>
  );
}

export default ResumePageClient; 
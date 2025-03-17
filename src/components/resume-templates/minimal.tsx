import { ResumeFormData } from '@/types/resume';
import { useEffect } from 'react';

// Interface for the nested data structure
interface NestedResumeData {
  title?: string;
  content?: ResumeFormData;
  template?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MinimalTemplateProps {
  data: ResumeFormData | NestedResumeData;
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  // Check if data has a content property (nested structure)
  const resumeData = (data as NestedResumeData).content || data as ResumeFormData;
  console.log('MinimalTemplate received data:', resumeData);
  
  // Add null checks for all data properties
  const experience = resumeData?.experience || [];
  const education = resumeData?.education || [];
  const skills = resumeData?.skills || [];
  
  // Add print styles to document head
  useEffect(() => {
    // Add print styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          background: #fff;
        }
        .container {
          width: 100%;
          height: 100%;
          box-shadow: none;
          margin: 0;
          padding: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Clean up
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // If data is null or undefined, show an error message
  if (!resumeData) {
    return (
      <div className="p-5 text-center text-red-500">
        <h2 className="text-xl font-bold">Error: No resume data available</h2>
        <p>Please check the data passed to the template.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      {/* Header */}
      <header className="mb-8 border-b pb-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {resumeData.photoUrl && (
            <div className="w-24 h-24 rounded-sm overflow-hidden border border-gray-200 flex-shrink-0">
              <img 
                src={resumeData.photoUrl} 
                alt={`${resumeData.fullName || 'Profile'} photo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex-grow">
            <h1 className="text-3xl font-normal text-gray-900 mb-1">{resumeData.fullName || 'Your Name'}</h1>
            <div className="text-gray-600 text-sm flex flex-wrap gap-x-4">
              <span>{resumeData.email || 'your.email@example.com'}</span>
              {resumeData.phone && <span>{resumeData.phone}</span>}
              {resumeData.location && <span>{resumeData.location}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <p className="text-gray-700">{resumeData.summary || 'Add your professional summary here.'}</p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3 uppercase tracking-wider">
          Experience
        </h2>
        {experience.length > 0 ? (
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-medium text-gray-900">{exp.position}</h3>
                  <span className="text-gray-600 text-sm">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-1">{exp.company}</p>
                <p className="text-gray-600 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">No experience listed</p>
        )}
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3 uppercase tracking-wider">
          Education
        </h2>
        {education.length > 0 ? (
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-medium text-gray-900">{edu.degree}</h3>
                  <span className="text-gray-600 text-sm">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-1">{edu.institution}</p>
                {edu.description && <p className="text-gray-600 text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">No education listed</p>
        )}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-3 uppercase tracking-wider">
          Skills
        </h2>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {skills.map((skill, index) => (
              <span key={index} className="text-gray-700 text-sm">
                {skill}{index < skills.length - 1 ? '•' : ''}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">No skills listed</p>
        )}
      </section>
    </div>
  );
} 
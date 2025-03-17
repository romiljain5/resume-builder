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

interface ModernTemplateProps {
  data: ResumeFormData | NestedResumeData;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  // Check if data has a content property (nested structure)
  const resumeData = (data as NestedResumeData).content || data as ResumeFormData;
  console.log('ModernTemplate received data:', resumeData);
  
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
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {resumeData.photoUrl && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
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
          <div className={`text-center ${resumeData.photoUrl ? 'md:text-left' : 'text-center w-full'}`}>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{resumeData.fullName || 'Your Name'}</h1>
            <div className="text-gray-600">
              <p>{resumeData.email || 'your.email@example.com'}</p>
              {resumeData.phone && <p>{resumeData.phone}</p>}
              {resumeData.location && <p>{resumeData.location}</p>}
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
          Professional Summary
        </h2>
        <p className="text-gray-700">{resumeData.summary || 'Add your professional summary here.'}</p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
          Experience
        </h2>
        {experience.length > 0 ? (
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xl font-medium text-gray-800">{exp.position}</h3>
                  <span className="text-gray-600 text-sm">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">{exp.company}</p>
                <p className="text-gray-600 mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No experience listed</p>
        )}
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
          Education
        </h2>
        {education.length > 0 ? (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xl font-medium text-gray-800">{edu.degree}</h3>
                  <span className="text-gray-600 text-sm">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-700 font-medium">{edu.institution}</p>
                {edu.description && <p className="text-gray-600 mt-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No education listed</p>
        )}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
          Skills
        </h2>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No skills listed</p>
        )}
      </section>
    </div>
  );
} 
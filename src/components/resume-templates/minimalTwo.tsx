import React from 'react';
import { ResumeFormData } from '@/types/resume';

interface ExtendedResumeData extends ResumeFormData {
  title?: string;
  location?: string;
  website?: string;
  linkedin?: string;
}

// Interface for the nested data structure
interface NestedResumeData {
  title?: string;
  content?: ResumeFormData;
  template?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  photoUrl?: string;
}

interface MinimalTwoTemplateProps {
  data: ResumeFormData | NestedResumeData;
}

export function MinimalTwoTemplate({ data }: MinimalTwoTemplateProps) {
  // Extract all data from the provided data object
  const {
    fullName,
    email,
    phone,
    location,
    summary,
    experience = [],
    education = [],
    skills = [],
    photoUrl
  } = data as ResumeFormData;

  // Helper function for bullet points
  const createBulletPoints = (text: string | undefined) => {
    if (!text) return [];
    return text.split('. ').filter(item => item.trim().length > 0);
  };

  return (
    <div className="print:scale-100 p-8 font-['Roboto'] text-sm leading-normal text-gray-800 min-h-[1090px] bg-white">
      {/* Print button */}
      <button 
        id="print" 
        className="absolute right-5 top-5 z-10 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-2 rounded text-xs shadow print:hidden"
        onClick={() => window.print()}
      >
        <i className="fa fa-print mr-1"></i>
        Print
      </button>

      <div className="resume">
        {/* Header Section */}
        <section className="resume-header pb-8 font-['Open_Sans'] text-[15px]">
          <div className="content">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight">
              {fullName || 'Your Name'}
            </h1>
            <div className="info-item mb-1">
              <span className="info-label inline-block pr-2 min-w-[30px] text-center">
                <i className="fa fa-location-arrow text-blue-500"></i>
              </span>
              <span className="info-text font-light">
                {location || 'Your Location'}
              </span>
            </div>
            <div className="info-item mb-1">
              <span className="info-label inline-block pr-2 min-w-[30px] text-center">
                <i className="fa fa-envelope text-blue-500"></i>
              </span>
              <span className="info-text font-light">
                {email || 'your.email@example.com'}
              </span>
            </div>
            <div className="info-item mb-1">
              <span className="info-label inline-block pr-2 min-w-[30px] text-center">
                <i className="fa fa-phone text-blue-500"></i>
              </span>
              <span className="info-text font-light">
                {phone || 'Your Phone Number'}
              </span>
            </div>
          </div>
        </section>

        <div className="resume-columns flex flex-wrap">
          {/* Main Column */}
          <div className="resume-main w-full lg:w-3/4 pr-0 lg:pr-12">
            {/* Summary Section */}
            <section className="resume-section mb-10 font-['Open_Sans'] text-[15px]">
              <div className="content">
                <div className="section-title flex items-center mb-6">
                  <i className="fa fa-pencil-square-o bg-blue-500 text-white border-2 border-blue-200 rounded-full w-8 h-8 flex items-center justify-center mr-2 leading-none"></i>
                  <h2 className="text-xl font-semibold">Professional Summary</h2>
                </div>
                <div className="other">
                  <div className="other-info">
                    <p className="mb-4">
                      {summary || 'Add your professional summary here. Highlight your expertise, experiences, and strengths.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section className="resume-section mb-10 font-['Open_Sans'] text-[15px]">
              <div className="content">
                <div className="section-title flex items-center mb-6">
                  <i className="fa fa-briefcase bg-blue-500 text-white border-2 border-blue-200 rounded-full w-8 h-8 flex items-center justify-center mr-2 leading-none"></i>
                  <h2 className="text-xl font-semibold">Employment History</h2>
                </div>
                
                {experience.length > 0 ? (
                  experience.map((exp, index) => (
                    <div className="xp-item flex mb-10" key={index}>
                      <div className="xp-job w-[30%] pr-5">
                        <div className="job-title text-base font-semibold leading-tight">
                          {exp.position || 'Position Title'}
                          <span className="font-normal"> @ {exp.company || 'Company Name'}</span>
                          <br />
                          <small className="text-sm">{location ? location.split(',')[0] : 'Location'}</small>
                        </div>
                        <div className="xp-date text-sm mt-1 mb-4 text-blue-500">
                          {exp.startDate || 'Start Date'} – {exp.endDate || 'Present'}
                        </div>
                      </div>

                      <div className="xp-detail w-[70%] pr-5">
                        <ul className="list-disc pl-5">
                          {createBulletPoints(exp.description).map((item, i) => (
                            <li key={i} className="mb-2">{item}</li>
                          ))}
                          {createBulletPoints(exp.description).length === 0 && (
                            <li className="mb-2">Add your job description and responsibilities here.</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="xp-item flex mb-10">
                    <div className="xp-job w-[30%] pr-5">
                      <div className="job-title text-base font-semibold leading-tight">
                        Position Title
                        <span className="font-normal"> @ Company Name</span>
                        <br />
                        <small className="text-sm">Location</small>
                      </div>
                      <div className="xp-date text-sm mt-1 mb-4 text-blue-500">
                        Start Date – End Date
                      </div>
                    </div>

                    <div className="xp-detail w-[70%] pr-5">
                      <ul className="list-disc pl-5">
                        <li className="mb-2">Add your job description and responsibilities here.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Education Section */}
            <section className="resume-section mb-10 font-['Open_Sans'] text-[15px]">
              <div className="content">
                <div className="section-title flex items-center mb-6">
                  <i className="fa fa-graduation-cap bg-blue-500 text-white border-2 border-blue-200 rounded-full w-8 h-8 flex items-center justify-center mr-2 leading-none"></i>
                  <h2 className="text-xl font-semibold">Education</h2>
                </div>
                
                {education.length > 0 ? (
                  education.map((edu, index) => (
                    <div className="edu-item mb-6" key={index}>
                      <div className="font-semibold">{edu.institution || 'Institution Name'}</div>
                      <div>{edu.degree || 'Degree'}</div>
                      <div className="text-sm text-blue-500">
                        {edu.startDate || 'Start Date'} – {edu.endDate || 'End Date'}
                      </div>
                      {edu.description && (
                        <div className="mt-2 text-sm">{edu.description}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="edu-item mb-6">
                    <div className="font-semibold">Institution Name</div>
                    <div>Degree</div>
                    <div className="text-sm text-blue-500">
                      Start Date – End Date
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Side Column */}
          <div className="resume-side w-full lg:w-1/4">
            {/* Skills Section */}
            <section className="resume-section mb-10 font-['Open_Sans'] text-[15px]">
              <div className="content">
                <div className="section-title flex items-center mb-6">
                  <i className="fa fa-align-center bg-blue-500 text-white border-2 border-blue-200 rounded-full w-8 h-8 flex items-center justify-center mr-2 leading-none"></i>
                  <h2 className="text-xl font-semibold">Skills</h2>
                </div>
                
                <div className="resume-text">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => {
                      // Randomize progress width between 70% and 95%
                      const progressWidth = Math.floor(Math.random() * 25) + 70;
                      
                      return (
                        <div className="extra mb-6" key={index}>
                          <div className="extra-info">
                            {skill}
                            <br />
                            <small className="text-xs text-gray-600">
                              {getRelevantTechnologies(skill)}
                            </small>
                          </div>
                          <div className="extra-details mt-2 bg-gray-200 w-full h-[5px] rounded-md relative">
                            <div 
                              className="extra-details-progress bg-blue-500 h-[5px] absolute top-0 left-0 rounded-md"
                              style={{ width: `${progressWidth}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="extra mb-6">
                      <div className="extra-info">
                        Add Your Skills
                        <br />
                        <small className="text-xs text-gray-600">
                          Related technologies and tools
                        </small>
                      </div>
                      <div className="extra-details mt-2 bg-gray-200 w-full h-[5px] rounded-md relative">
                        <div 
                          className="extra-details-progress bg-blue-500 h-[5px] absolute top-0 left-0 rounded-md"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Languages Section - This could be added to the ResumeFormData in the future */}
            <section className="resume-section mb-10 font-['Open_Sans'] text-[15px]">
              <div className="content">
                <div className="section-title flex items-center mb-6">
                  <i className="fa fa-globe bg-blue-500 text-white border-2 border-blue-200 rounded-full w-8 h-8 flex items-center justify-center mr-2 leading-none"></i>
                  <h2 className="text-xl font-semibold">Languages</h2>
                </div>
                
                {/* Only show this section if skills are provided, as a placeholder */}
                {skills.length > 0 ? (
                  <>
                    <div className="extra mb-6">
                      <div className="extra-info">
                        English <small className="text-xs">(fluent)</small>
                      </div>
                      <div className="extra-details mt-2 bg-gray-200 w-full h-[5px] rounded-md relative">
                        <div 
                          className="extra-details-progress bg-blue-500 h-[5px] absolute top-0 left-0 rounded-md"
                          style={{ width: '90%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="extra mb-6">
                      <div className="extra-info">
                        Spanish <small className="text-xs">(intermediate)</small>
                      </div>
                      <div className="extra-details mt-2 bg-gray-200 w-full h-[5px] rounded-md relative">
                        <div 
                          className="extra-details-progress bg-blue-500 h-[5px] absolute top-0 left-0 rounded-md"
                          style={{ width: '60%' }}
                        ></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="extra mb-6">
                    <div className="extra-info">
                      Add Languages <small className="text-xs">(level)</small>
                    </div>
                    <div className="extra-details mt-2 bg-gray-200 w-full h-[5px] rounded-md relative">
                      <div 
                        className="extra-details-progress bg-blue-500 h-[5px] absolute top-0 left-0 rounded-md"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      
      {/* Print styles */}
      <style jsx>{`
        @media print {
          body {
            min-width: initial !important;
          }
        }
      `}</style>
    </div>
  );
}

// Helper function to suggest relevant technologies based on skill keyword
function getRelevantTechnologies(skill: string): string {
  const skillMap: Record<string, string> = {
    'javascript': 'React, Vue, Angular, Node.js',
    'react': 'Redux, React Router, Next.js',
    'vue': 'Vuex, Vue Router, Nuxt.js',
    'angular': 'RxJS, NgRx, Angular Material',
    'node': 'Express, NestJS, MongoDB',
    'html': 'HTML5, Semantic HTML, Accessibility',
    'css': 'Sass, Less, Tailwind CSS, Bootstrap',
    'python': 'Django, Flask, FastAPI, NumPy',
    'java': 'Spring, Hibernate, Maven, Gradle',
    'php': 'Laravel, Symfony, WordPress',
    'design': 'Figma, Adobe XD, Sketch',
    'devops': 'Docker, Kubernetes, CI/CD, AWS',
    'database': 'SQL, MongoDB, Redis, PostgreSQL',
    'mobile': 'React Native, Flutter, Swift',
    'testing': 'Jest, Cypress, Selenium',
    'ui': 'Material UI, Component Libraries',
    'ux': 'User Research, Wireframing, Prototyping'
  };
  
  // Look for the skill in our map (case insensitive)
  const normalizedSkill = skill.toLowerCase();
  
  // Find the first matching key that includes the skill
  for (const [key, technologies] of Object.entries(skillMap)) {
    if (normalizedSkill.includes(key) || key.includes(normalizedSkill)) {
      return technologies;
    }
  }
  
  // Default relevant technologies for unknown skills
  return 'Related technologies and tools';
}
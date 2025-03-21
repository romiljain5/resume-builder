import React, { useEffect, useRef } from "react";
import { ResumeFormData } from "@/types/resume";

// Extended interface to include optional fields that might be used in templates
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

interface GreenTemplateProps {
  data: ResumeFormData | NestedResumeData;
}

export function GreenTemplate({ data }: GreenTemplateProps) {
  const {
    fullName,
    email,
    phone,
    location,
    summary,
    experience,
    education,
    skills,
  } = data as ExtendedResumeData;
  const { photoUrl } = data as NestedResumeData;

  // Split full name into first and last name (if available)
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Create a reference to the style element
  const styleRef = useRef<HTMLStyleElement | null>(null);
  
  // Create and append dynamic styles for skill bars when skills change
  useEffect(() => {
    if (!skills?.length) return;
    
    // Create dynamic styles for each skill
    let styleContent = '';
    
    skills.forEach((_, index) => {
      const width = Math.floor(Math.random() * 40) + 50;
      styleContent += `
        .skill-percentage:nth-child(${index + 1})::before {
          width: ${width}%;
          animation: skill-anim-${index} 0.6s ease;
        }
        @keyframes skill-anim-${index} {
          from { width: 0%; }
          to { width: ${width}%; }
        }
      `;
    });
    
    // Create or update the style element
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      document.head.appendChild(styleRef.current);
    }
    
    styleRef.current.textContent = styleContent;
    
    // Clean up
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [skills]);

  const getSummaryAfterTwoWords = (summary: string | undefined) => {
    if (!summary) return "";
    const words = summary.split(" ");
    return words.slice(2).join(" ");
  };

  return (
    <div className="print:scale-100 print:w-full mx-auto">
      {/* Meta tag should be in _document.js or Head component */}
      <div className="relative text-center h-full">
        <section className="bg-white w-full md:w-2/5 float-left text-gray-500 min-h-full p-10 md:p-16 pt-20">
          <div className="container">
            <div className="w-2/5 float-left block mb-8">
              <div className="relative rounded-full overflow-hidden mx-auto">
              <span className="table-cell align-middle relative z-10 text-center">
                  <img
                    src={
                      photoUrl || "https://via.placeholder.com/150?text=Photo"
                    }
                    alt="Profile"
                    className="rounded-full w-48 mx-auto"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/150?text=Error";
                    }}
                  />
                </span>

              </div>
              <div className="clear-both"></div>
            </div>
            <div className="w-3/5 float-left pl-5">
              <h1 className="text-4xl text-left font-semibold text-gray-700 uppercase leading-tight pt-10">
                {firstName} <br />
                {lastName}
              </h1>
            </div>
            <div className="clear-both"></div>
            <div className="contact-info after:clear-both before:table after:table">
              <ul className="w-2/5 float-left text-left font-semibold text-gray-700">
                <li className="mb-2">Call</li>
                <li className="mb-2">Mail</li>
                <li className="mb-2">Web</li>
                <li className="mb-2">Home</li>
              </ul>
              <ul className="w-3/5 float-left text-left font-light">
                <li className="mb-2">{phone || "+1 123 456 7890"}</li>
                <li className="mb-2">{email || "your.email@example.com"}</li>
                <li className="mb-2">
                  <a href="#" className="text-green-500 hover:text-green-600">
                    portfolio.com
                  </a>
                </li>
                <li className="mb-2">{location || "City, Country"}</li>
              </ul>
            </div>
            <div className="text-left font-light my-20">
              {/* Professional summary */}
              <p>
                <span className="text-gray-700 font-normal">
                  {summary?.split(" ").slice(0, 3).join(" ") || "Professional"}
                </span>{" "}
                {getSummaryAfterTwoWords(summary) ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus euismod congue nisi, nec consequat quam."}
              </p>
            </div>
            <div className="contact-social after:clear-both before:table after:table">
              <ul className="w-2/5 float-left text-left font-semibold text-gray-700">
                <li className="mb-2">Twitter</li>
                <li className="mb-2">LinkedIn</li>
                <li className="mb-2">GitHub</li>
              </ul>
              <ul className="w-3/5 float-left text-left font-light">
                <li className="mb-2">
                  <a href="#" className="text-green-500 hover:text-green-600">
                    @username
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-green-500 hover:text-green-600">
                    linkedin.com/in/username
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-green-500 hover:text-green-600">
                    github.com/username
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-800 w-full md:w-3/5 float-left text-gray-400 font-light min-h-screen p-10 md:p-16">
          <div className="container">
            <h3 className="text-green-500 text-left uppercase text-xl mb-5 font-normal">
              Experience
            </h3>

            <div className="experience-wrapper">
              {experience?.map((exp, index) => (
                <div key={index}>
                  <div className="company-wrapper after:clear-both before:table after:table w-3/10 float-left text-left pr-5 mb-12">
                    <div className="text-white mb-2">{exp.company}</div>
                    <div className="text-gray-400">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                  </div>

                  <div className="job-wrapper after:clear-both before:table after:table w-7/10 float-left text-left pr-5 mb-12">
                    <div className="text-white mb-2">{exp.position}</div>
                    <div className="company-description">
                      <p>{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* If no experience provided, show placeholder */}
              {(!experience || experience.length === 0) && (
                <div>
                  <div className="company-wrapper after:clear-both before:table after:table w-3/10 float-left text-left pr-5 mb-12">
                    <div className="text-white mb-2">Company Name</div>
                    <div className="text-gray-400">Jan 2020 - Present</div>
                  </div>

                  <div className="job-wrapper after:clear-both before:table after:table w-7/10 float-left text-left pr-5 mb-12">
                    <div className="text-white mb-2">Job Title</div>
                    <div className="company-description">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Fusce a elit facilisis, adipiscing leo in, dignissim
                        magna.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="section-wrapper after:clear-both before:table after:table w-1/2 float-left text-left text-gray-400 font-light mb-5">
              <h3 className="text-green-500 text-left uppercase text-xl mb-5 font-normal">
                Skills
              </h3>
              <ul>
                {skills?.map((skill, index) => (
                  <li
                    key={index}
                    data-skill-index={index}
                    className="skill-percentage relative mb-3 after:content-[''] after:w-full after:h-1.5 after:bg-gray-700 after:block after:mt-1 before:content-[''] before:h-1.5 before:bg-green-500 before:absolute before:mt-1 before:bottom-0"
                    style={{ 
                      paddingRight: "8%",
                      // Set a unique width per skill (between 50-90%)
                      [`--skill-width-${index}`]: `${Math.floor(Math.random() * 40) + 50}%` 
                    } as React.CSSProperties}
                  >
                    <span>{skill}</span>
                  </li>
                ))}

                {/* If no skills provided, show placeholders */}
                {(!skills || skills.length === 0) && (
                  <>
                    <li className="skill-percentage relative mb-3 after:content-[''] after:w-full after:h-1.5 after:bg-gray-700 after:block after:mt-1 before:content-[''] before:h-1.5 before:bg-green-500 before:absolute before:mt-1 before:bottom-0 before:w-[80%]">
                      HTML / CSS
                    </li>
                    <li className="skill-percentage relative mb-3 after:content-[''] after:w-full after:h-1.5 after:bg-gray-700 after:block after:mt-1 before:content-[''] before:h-1.5 before:bg-green-500 before:absolute before:mt-1 before:bottom-0 before:w-[90%]">
                      JavaScript
                    </li>
                    <li className="skill-percentage relative mb-3 after:content-[''] after:w-full after:h-1.5 after:bg-gray-700 after:block after:mt-1 before:content-[''] before:h-1.5 before:bg-green-500 before:absolute before:mt-1 before:bottom-0 before:w-[75%]">
                      React
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="section-wrapper after:clear-both before:table after:table w-1/2 float-left text-left text-gray-400 font-light mb-5">
              <h3 className="text-green-500 text-left uppercase text-xl mb-5 font-normal">
                Education
              </h3>
              {education?.map((edu, index) => (
                <div key={index} className="mb-4">
                  <p className="font-medium text-white">{edu.institution}</p>
                  <p>{edu.degree}</p>
                  <p className="text-sm">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                  {edu.description && (
                    <p className="text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}

              {/* If no education provided, show placeholder */}
              {(!education || education.length === 0) && (
                <div className="mb-4">
                  <p className="font-medium text-white">University Name</p>
                  <p>Bachelor's Degree</p>
                  <p className="text-sm">2016 - 2020</p>
                  <p className="text-sm mt-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="clear-both"></div>
      </div>

      {/* Single style block with all animations */}
      <style jsx global>{`
        /* Define the animation */
        @keyframes skillWidth {
          from { width: 0%; }
          to { width: 80%; }
        }
        
        /* Default animation for all skill bars */
        .skill-percentage::before {
          width: 80%;
          animation: skillWidth 0.6s ease;
        }
        
        /* Apply specific widths for the first 10 possible skills */
        .skill-percentage[data-skill-index="0"]::before { width: var(--skill-width-0, 80%); }
        .skill-percentage[data-skill-index="1"]::before { width: var(--skill-width-1, 75%); }
        .skill-percentage[data-skill-index="2"]::before { width: var(--skill-width-2, 60%); }
        .skill-percentage[data-skill-index="3"]::before { width: var(--skill-width-3, 85%); }
        .skill-percentage[data-skill-index="4"]::before { width: var(--skill-width-4, 70%); }
        .skill-percentage[data-skill-index="5"]::before { width: var(--skill-width-5, 65%); }
        .skill-percentage[data-skill-index="6"]::before { width: var(--skill-width-6, 90%); }
        .skill-percentage[data-skill-index="7"]::before { width: var(--skill-width-7, 55%); }
        .skill-percentage[data-skill-index="8"]::before { width: var(--skill-width-8, 75%); }
        .skill-percentage[data-skill-index="9"]::before { width: var(--skill-width-9, 60%); }
        
        .clear-both {
          clear: both;
        }

        .w-3/10 {
          width: 30%;
        }

        .w-7/10 {
          width: 70%;
        }
      `}</style>
    </div>
  );
}

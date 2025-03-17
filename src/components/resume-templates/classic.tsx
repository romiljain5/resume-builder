import { ResumeFormData } from '@/types/resume';
import { CSSProperties, useEffect } from 'react';

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
}

interface ClassicTemplateProps {
  data: ResumeFormData | NestedResumeData;
}

// Define the CSS as a JavaScript object
const styles: Record<string, CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '1000px',
    minHeight: '1000px',
    background: '#fff',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    boxShadow: '0 35px 55px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Poppins', sans-serif",
    pageBreakInside: 'avoid',
    breakInside: 'avoid',
  },
  leftSide: {
    position: 'relative',
    background: '#003147',
    padding: '40px',
  },
  rightSide: {
    position: 'relative',
    background: '#fff',
    padding: '40px',
  },
  profileText: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    paddingBottom: '20px',
  },
  imgBx: {
    position: 'relative',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    color: '#fff',
    fontSize: '1.5em',
    marginTop: '20px',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 600,
    lineHeight: '1.4em',
    marginBottom: '20px',
  },
  profileSpan: {
    fontSize: '0.8em',
    fontWeight: 300,
  },
  contactInfo: {
    paddingTop: '40px',
  },
  title: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: '1px',
    marginBottom: '20px',
  },
  contactList: {
    position: 'relative',
    listStyle: 'none',
  },
  contactItem: {
    position: 'relative',
    margin: '10px 0',
    cursor: 'pointer',
  },
  contactIcon: {
    display: 'inline-block',
    width: '30px',
    fontSize: '18px',
    color: '#03a9f4',
  },
  contactText: {
    color: '#fff',
    fontWeight: 300,
  },
  contactLink: {
    textDecoration: 'none',
    color: '#fff',
  },
  educationItem: {
    marginBottom: '15px',
  },
  educationDate: {
    color: '#03a9f4',
    fontWeight: 500,
  },
  educationDegree: {
    color: '#fff',
    fontWeight: 500,
  },
  educationSchool: {
    color: '#fff',
    fontWeight: 300,
  },
  percentContainer: {
    position: 'relative',
    width: '100%',
    height: '6px',
    background: '#081921',
    display: 'block',
    marginTop: '5px',
  },
  percentFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: '#03a9f4',
  },
  about: {
    marginBottom: '50px',
  },
  title2: {
    color: '#003147',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px',
  },
  paragraph: {
    color: '#333',
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    margin: '20px 0',
  },
  yearCompany: {
    minWidth: '150px',
  },
  yearText: {
    textTransform: 'uppercase',
    color: '#848c90',
    fontWeight: 600,
  },
  jobTitle: {
    textTransform: 'uppercase',
    color: '#2a7da2',
    fontSize: '16px',
  },
  skillsBox: {
    position: 'relative',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '150px 1fr',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
  },
  skillName: {
    textTransform: 'uppercase',
    color: '#848c99',
    fontWeight: 500,
  },
  skillPercent: {
    position: 'relative',
    width: '100%',
    height: '10px',
    background: '#f0f0f0',
  },
  skillFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: '#03a9f4',
  },
  interestList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    listStyle: 'none',
  },
  interestItem: {
    color: '#333',
    fontWeight: 500,
    margin: '10px 0',
  },
  interestIcon: {
    color: '#03a9f4',
    fontSize: '18px',
    width: '28px',
  },
  // Media queries would be handled with conditional rendering or responsive utilities
};

// Add print-specific CSS
const printStyles = `
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

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  // Debug: Log the data being received
  console.log('ClassicTemplate received data:', data);
  
  // Check if data has a content property (nested structure)
  const resumeData = (data as NestedResumeData).content || data as ResumeFormData;
  console.log('Extracted resume data:', resumeData);
  
  // Treat data as potentially having extended properties
  const extendedData = resumeData as ExtendedResumeData;
  
  const experience = resumeData?.experience || [];
  const education = resumeData?.education || [];
  const skills = resumeData?.skills || [];
  
  // Debug: Log the extracted arrays
  console.log('Experience:', experience);
  console.log('Education:', education);
  console.log('Skills:', skills);
  
  // Extract title from the first experience if available
  const title = experience.length > 0 && experience[0]?.position 
    ? experience[0].position 
    : 'Professional Title';

  // Helper function to get initials for avatar if no image
  const getInitials = (name: string = '') => {
    if (!name) return 'UN'; // Default to 'UN' for 'User Name'
    return name
      .split(' ')
      .map(part => part?.[0] || '')
      .join('')
      .toUpperCase();
  };

  // Add print styles to document head
  useEffect(() => {
    // Add print styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = printStyles;
    document.head.appendChild(styleElement);

    // Clean up
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // If data is null or undefined, show an error message
  if (!resumeData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error: No resume data available</h2>
        <p>Please check the data passed to the template.</p>
      </div>
    );
  }

  return (
    <div className="template-classic">
      <div style={styles.container}>
        {/* Left Side */}
        <div style={styles.leftSide}>
          {/* Profile */}
          <div style={styles.profileText}>
            <div style={styles.imgBx}>
              {resumeData.photoUrl ? (
                <img 
                  src={resumeData.photoUrl} 
                  alt={`${resumeData.fullName || 'Profile'} photo`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const initials = document.createElement('div');
                      initials.textContent = getInitials(resumeData.fullName);
                      initials.style.fontSize = '3rem';
                      initials.style.fontWeight = 'bold';
                      initials.style.color = '#003147';
                      parent.appendChild(initials);
                    }
                  }}
                />
              ) : (
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#003147' }}>
                  {getInitials(resumeData.fullName)}
                </div>
              )}
            </div>
            <h2 style={styles.profileName}>
              {resumeData.fullName || 'Your Name'}
              <br />
              <span style={styles.profileSpan}>{title}</span>
            </h2>
          </div>

          {/* Contact Info */}
          <div style={styles.contactInfo}>
            <h3 style={styles.title}>Contact Info</h3>
            <ul style={styles.contactList}>
              {resumeData.email && (
                <li style={styles.contactItem}>
                  <span style={styles.contactIcon}>
                    <i className="fa fa-envelope" style={{ color: '#03a9f4' }}></i>
                  </span>
                  <span style={styles.contactText}>{resumeData.email}</span>
                </li>
              )}
              {resumeData.phone && (
                <li style={styles.contactItem}>
                  <span style={styles.contactIcon}>
                    <i className="fa fa-phone" style={{ color: '#03a9f4' }}></i>
                  </span>
                  <span style={styles.contactText}>{resumeData.phone}</span>
                </li>
              )}
              {resumeData.location && (
                <li style={styles.contactItem}>
                  <span style={styles.contactIcon}>
                    <i className="fa fa-map-marker" style={{ color: '#03a9f4' }}></i>
                  </span>
                  <span style={styles.contactText}>{resumeData.location}</span>
                </li>
              )}
            </ul>
          </div>

          <div style={{ ...styles.contactInfo, ...{ className: 'education' } }}>
            <h3 style={styles.title}>Education</h3>
            <ul style={styles.contactList}>
              {!education || education.length === 0 ? (
                <li style={styles.educationItem}>
                  <h5 style={styles.educationSchool}>No education added yet.</h5>
                </li>
              ) : (
                education.map((edu, index) => (
                  <li key={index} style={styles.educationItem}>
                    <h5 style={{ ...styles.educationDate, color: '#03a9f4' }}>
                      {edu?.startDate || 'Start Date'} - {edu?.endDate || 'Present'}
                    </h5>
                    <h4 style={{ ...styles.educationDegree, color: '#fff' }}>
                      {edu?.degree || 'Degree'}
                    </h4>
                    <h4 style={{ ...styles.educationSchool, color: '#fff' }}>
                      {edu?.institution || 'Institution'}
                    </h4>
                    {edu?.description && <p style={{ ...styles.contactText, marginTop: '5px', color: '#fff' }}>
                      {edu.description}
                    </p>}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Only show skills section if we have skills to display */}
          {skills && skills.length > 0 && (
            <div style={{ ...styles.contactInfo, ...{ className: 'language' } }}>
              <h3 style={{ ...styles.title, color: '#fff' }}>Skills</h3>
              <ul style={styles.contactList}>
                {skills.slice(0, 3).map((skill, index) => (
                  <li key={index} style={styles.contactItem}>
                    <span style={{ ...styles.contactText, color: '#fff' }}>
                      {skill || `Skill ${index + 1}`}
                    </span>
                    <span style={styles.percentContainer}>
                      <div style={{ ...styles.percentFill, width: `${100 - (index * 15)}%`, backgroundColor: '#03a9f4' }}></div>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={styles.rightSide}>
          <div style={styles.about}>
            <h2 style={{ ...styles.title2, color: '#003147' }}>Profile</h2>
            <p style={styles.paragraph}>{resumeData.summary || 'Add your professional summary here.'}</p>
          </div>

          <div style={styles.about}>
            <h2 style={{ ...styles.title2, color: '#003147' }}>Experience</h2>
            {!experience || experience.length === 0 ? (
              <p style={styles.paragraph}>No experience added yet.</p>
            ) : (
              experience.map((exp, index) => (
                <div key={index} style={styles.box}>
                  <div style={styles.yearCompany}>
                    <h5 style={styles.yearText}>
                      {exp?.startDate || 'Start Date'} - {exp?.endDate || 'Present'}
                    </h5>
                    <h5 style={styles.yearText}>{exp?.company || 'Company'}</h5>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ ...styles.jobTitle, color: '#2a7da2' }}>
                      {exp?.position || 'Position'}
                    </h4>
                    <p style={styles.paragraph}>{exp?.description || 'Job description'}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ ...styles.about, ...{ className: 'skills' } }}>
            <h2 style={{ ...styles.title2, color: '#003147' }}>Professional Skills</h2>
            {!skills || skills.length === 0 ? (
              <p style={styles.paragraph}>No skills added yet.</p>
            ) : (
              skills.map((skill, index) => (
                <div key={index} style={styles.skillsBox}>
                  <h4 style={styles.skillName}>{skill || `Skill ${index + 1}`}</h4>
                  <div style={styles.skillPercent}>
                    <div style={{ ...styles.skillFill, width: `${90 - (index * 10)}%`, backgroundColor: '#03a9f4' }}></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Replace hardcoded interests with skills if available */}
          {skills && skills.length > 0 && (
            <div style={{ ...styles.about, ...{ className: 'interest' } }}>
              <h2 style={{ ...styles.title2, color: '#003147' }}>Interests</h2>
              <ul style={styles.interestList}>
                {skills.slice(0, 4).map((skill, index) => (
                  <li key={index} style={styles.interestItem}>
                    <i className={`fas ${getInterestIcon(index)}`} style={{ ...styles.interestIcon, color: '#03a9f4' }}></i> {skill || `Interest ${index + 1}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get an appropriate icon for each interest
function getInterestIcon(index: number): string {
  const icons = ['fa-edit', 'fa-glasses', 'fa-code', 'fa-check', 'fa-book', 'fa-music', 'fa-film', 'fa-hiking'];
  return icons[index % icons.length];
} 
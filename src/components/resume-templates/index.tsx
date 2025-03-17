import { ModernTemplate } from './modern';
import { ClassicTemplate } from './classic';
import { MinimalTemplate } from './minimal';
import { ResumeFormData } from '@/types/resume';

export type TemplateType = 'modern' | 'classic' | 'minimal';

// Interface for the nested data structure
interface NestedResumeData {
  title?: string;
  content?: ResumeFormData;
  template?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TemplateProps {
  type: TemplateType;
  data: ResumeFormData | NestedResumeData;
}

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
};

export function ResumeTemplate({ type, data }: TemplateProps) {
  console.log('ResumeTemplate received type:', type, 'and data:', data);
  const Template = templates[type] || templates.modern;
  
  // Wrap the template in a div with a specific class for PDF generation
  return (
    <div className="resume-template-wrapper" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
      <Template data={data} />
    </div>
  );
}

// Import the template previews from the config file instead
// This is kept for backward compatibility
export { templatePreviews, getTemplateInfo } from '@/config/templates'; 
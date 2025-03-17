import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design with a modern layout',
    preview: 'https://placehold.co/600x800/1a1a1a/ffffff?text=Modern+Template',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional resume format with a timeless look',
    preview: 'https://placehold.co/600x800/1a1a1a/ffffff?text=Classic+Template',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design focusing on content',
    preview: 'https://placehold.co/600x800/1a1a1a/ffffff?text=Minimal+Template',
  },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg',
            selectedTemplate === template.id && 'ring-2 ring-primary'
          )}
          onClick={() => onSelect(template.id)}
        >
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
            <img
              src={template.preview}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
} 
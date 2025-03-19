export const templatePreviews = {
  modern: {
    name: 'Modern',
    description: 'A clean, modern design with a focus on readability',
    preview: '/templates/modern-preview.png'
  },
  classic: {
    name: 'Classic',
    description: 'A traditional resume format that employers are familiar with',
    preview: '/templates/classic-preview.png'
  },
  minimal: {
    name: 'Minimal',
    description: 'A minimalist design that lets your content stand out',
    preview: '/templates/minimal-preview.png'
  },
  // Fallback for any unknown template
  default: {
    name: 'Default Template',
    description: 'Standard resume template',
    preview: '/templates/modern-preview.png'
  }
} as const;

type TemplateName = keyof typeof templatePreviews;

// Helper function to safely get template info
export function getTemplateInfo(templateName: string | undefined) {
  if (!templateName || !(templateName in templatePreviews)) {
    return templatePreviews.default;
  }
  return templatePreviews[templateName as TemplateName];
} 
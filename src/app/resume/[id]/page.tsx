import { use } from 'react';
import ResumePageClient from './resume-page-client';
import { RegeneratePreviewButton } from '@/components/regenerate-preview-button';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ResumePageProps {
  params: Promise<{ id: string }>;
}

export default function ResumePage({ params }: ResumePageProps) {
  const { id } = use(params);
  return <ResumePageClient id={id} />;
} 
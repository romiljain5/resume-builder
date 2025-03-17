import { use } from 'react';
import ResumeEditClient from './resume-edit-client';

interface ResumeEditPageProps {
  params: Promise<{ id: string }>;
}

export default function ResumeEditPage({ params }: ResumeEditPageProps) {
  const { id } = use(params);
  return <ResumeEditClient id={id} />;
} 
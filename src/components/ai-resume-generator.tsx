'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ResumeFormData } from '@/types/resume';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AIResumeGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIResumeGenerator({ open, onOpenChange }: AIResumeGeneratorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateResume = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!prompt) {
        throw new Error('Please enter a prompt for generating your resume');
      }

      try {
        // Generate resume with Claude using server-side API
        const response = await fetch('/api/generate-resume-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user?.id}`,
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate resume');
        }

        const resumeData = await response.json();

        // Create resume in database
        const createResponse = await fetch('/api/resumes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.user?.id}`,
          },
          body: JSON.stringify({
            ...resumeData,
            template: 'modern', // Default template
          }),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create resume');
        }

        const newResume = await createResponse.json();
        
        // Close modal and redirect to the new resume
        onOpenChange(false);
        toast.success('Resume generated successfully!');
        router.push(`/resume/${newResume._id}`);
      } catch (apiError: any) {
        console.error('API error:', apiError);
        throw apiError;
      }
    } catch (err) {
      console.error('Error generating resume:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate resume');
      toast.error('Failed to generate resume');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Resume with Claude</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe your experience, skills, and education. For example: I'm a software engineer with 5 years of experience in React and Node.js..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-gray-500">
              Powered by Claude Sonnet, a state-of-the-art AI assistant from Anthropic.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerateResume} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate with Claude'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AIResumeGenerator; 
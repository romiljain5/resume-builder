'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

export default function Settings() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Function to test the server's API key
  const testApiKey = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/test-claude', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.user?.id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Claude API is configured and working!');
        console.log('Claude response:', data.response);
      } else {
        const data = await response.json();
        toast.error(`API error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Failed to test Claude API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="max-w-md">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Claude API Configuration</h2>
          <p className="text-sm text-blue-700 mb-4">
            The Claude API key is now configured on the server side for enhanced security. 
            This prevents exposing your API key in the browser and follows best practices 
            for API key management.
          </p>
          <Button 
            onClick={testApiKey} 
            disabled={isLoading}
            variant="outline"
            className="bg-white"
          >
            {isLoading ? 'Testing...' : 'Test Claude API Connection'}
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Other Settings</h2>
            <p className="text-sm text-gray-500">
              Additional settings will be available in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className={`flex items-center px-3 text-sm font-medium ${
                isActive('/') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link
              href="/resume/new"
              className={`flex items-center px-3 text-sm font-medium ${
                pathname.startsWith('/resume') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New Resume
            </Link>
            <Link
              href="/settings"
              className={`flex items-center px-3 text-sm font-medium ${
                isActive('/settings') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Settings
            </Link>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-4">
              {session.user?.name}
            </span>
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="text-sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 
"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth(); // Get loading state for logout button

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Task Manager
        </h1>
        {user && (
          <div className="flex items-center space-x-4">
             <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                Welcome, {user.email}
             </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              disabled={loading} // Disable button while logging out
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
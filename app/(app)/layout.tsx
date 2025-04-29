"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import Header from '@/components/layout/Header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While loading or if no user (and redirecting), show a spinner
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  // If authenticated, render the layout and children
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
       <footer className="text-center py-4 text-sm text-gray-500">
         Task Manager © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
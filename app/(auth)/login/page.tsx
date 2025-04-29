"use client";

import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import Link from 'next/link';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard'); // Redirect if already logged in
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while checking auth state
  }

  if (user) {
     return <LoadingSpinner />; // Or null, redirecting anyway
  }

  return (
    <div>
       <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <LoginForm />
       <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}
"use client";

import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import Link from 'next/link';


export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

   useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard'); // Redirect if already logged in
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

   if (user) {
     return <LoadingSpinner />; // Or null, redirecting anyway
  }


  return (
     <div>
      <SignupForm />
       <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
       Já tem uma conta?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
          Entrar
        </Link>
      </p>
    </div>
  );
}
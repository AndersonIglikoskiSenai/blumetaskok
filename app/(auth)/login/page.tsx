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
      router.push('/dashboard'); 
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />; 
  }

  if (user) {
     return <LoadingSpinner />; 
  }

  return (

    <div>
      <LoginForm />
       <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Não tem uma conta?
        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
          Crie aqui
        </Link>
      </p>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
      © {new Date().getFullYear()} SENAI - Todos os direitos reservados.</p>
    </div>
  );
}
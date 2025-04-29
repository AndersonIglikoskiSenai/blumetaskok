"use client"; // Precisa ser Client Component para usar hooks

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/layout/LoadingSpinner'; // Importe seu componente de loading

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só redireciona quando o estado de autenticação não estiver mais carregando
    if (!loading) {
      if (user) {
        // Se tem usuário logado, vai para o dashboard
        router.replace('/dashboard');
      } else {
        // Se não tem usuário logado, vai para o login
         router.replace('/login');
      }
    }
  }, [user, loading, router]); // Executa quando user, loading ou router mudarem

  // Mostra um loading enquanto verifica o estado de autenticação
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size={48} />
    </div>
  );
}
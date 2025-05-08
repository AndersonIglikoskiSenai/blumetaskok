import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login'); // Redireciona para login se não autenticado
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <LoadingSpinner />; // Mostra spinner enquanto verifica autenticação
    }

    return <Component {...props} />;
  };
}
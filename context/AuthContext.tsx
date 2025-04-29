"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config'; // Verifique se o caminho está correto
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { toast } from "sonner"; // Usar sonner para toasts
import { AuthCredentials } from '@/lib/types'; // Assumindo que está definido em lib/types.ts

// 1. Definição da Interface para o tipo do Contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. Criação do Contexto - ADICIONADO O 'export' AQUI
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Definição da Interface para as Props do Provider
interface AuthProviderProps {
  children: ReactNode;
}

// 4. Componente Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Efeito para ouvir mudanças no estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Define o usuário (pode ser null se não logado)
      setLoading(false); // Marca que o carregamento inicial terminou
    });
    // Cleanup: Cancela a inscrição ao desmontar o componente
    return () => unsubscribe();
  }, []); // Array de dependências vazio significa que só roda na montagem/desmontagem

  // Função de Login
  const login = async ({ email, password }: AuthCredentials) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard'); // Redireciona para o dashboard
    } catch (error: any) {
      console.error("Erro no Login:", error);
      // Tenta pegar uma mensagem de erro mais amigável do Firebase
      const errorMessage = error.code ? mapFirebaseAuthError(error.code) : 'Falha ao fazer login. Verifique suas credenciais.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Função de Cadastro (Signup)
  const signup = async ({ email, password }: AuthCredentials) => {
     setLoading(true);
    try {
      // Cria o usuário no Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);

      // Opcional: Criar um documento no Firestore para o usuário aqui se necessário
      // await setDoc(doc(db, "users", userCredential.user.uid), { email, createdAt: serverTimestamp() });

      toast.success('Conta criada com sucesso! Por favor, faça o login.');
       router.push('/login'); // Redireciona para a página de login após cadastro
    } catch (error: any) {
      console.error("Erro no Cadastro:", error);
      const errorMessage = error.code ? mapFirebaseAuthError(error.code) : 'Falha ao criar a conta.';
      toast.error(errorMessage);
    } finally {
       setLoading(false);
    }
  };

  // Função de Logout
  const logout = async () => {
    setLoading(true); // Pode remover se não quiser loading no logout
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso!');
      router.push('/login'); // Redireciona para login após logout
    } catch (error: any) {
       console.error("Erro no Logout:", error);
      toast.error(error.message || 'Falha ao fazer logout.');
    } finally {
       // setLoading(false); // O redirecionamento já muda o estado
    }
  };

  // 5. Objeto de Valor fornecido pelo Contexto
  const value = { user, loading, login, signup, logout };

  // 6. Retorna o Provider envolvendo os filhos
  // Renderiza os filhos imediatamente, o estado de loading é usado pelos consumidores
   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Função auxiliar para mapear códigos de erro do Firebase (opcional, mas útil)
const mapFirebaseAuthError = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Formato de e-mail inválido.';
        case 'auth/user-disabled':
            return 'Este usuário foi desabilitado.';
        case 'auth/user-not-found':
        case 'auth/wrong-password': // Combina os dois para login
            return 'E-mail ou senha inválidos.';
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso por outra conta.';
        case 'auth/weak-password':
            return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
        case 'auth/operation-not-allowed':
            return 'Login com e-mail/senha não está habilitado.';
        // Adicione outros mapeamentos conforme necessário
        default:
            return 'Ocorreu um erro inesperado. Tente novamente.';
    }
};

// Nota: Certifique-se de que a interface AuthCredentials está definida
// ou em '@/lib/types.ts' ou descomente/adicione aqui:
// export interface AuthCredentials {
//     email: string;
//     password: string;
// }
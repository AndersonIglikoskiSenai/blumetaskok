"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { AuthCredentials } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// ADICIONADO O 'export' AQUI <<<========================= CORREÇÃO
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // O restante do seu código aqui está correto...
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async ({ email, password }: AuthCredentials) => {
        setLoading(true);
        try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login realizado com sucesso!');
        router.push('/dashboard');
        } catch (error: any) {
        console.error("Erro no Login:", error);
        const errorMessage = error.code ? mapFirebaseAuthError(error.code) : 'Falha ao fazer login. Verifique suas credenciais.';
        toast.error(errorMessage);
        } finally {
        setLoading(false);
        }
    };

    const signup = async ({ email, password }: AuthCredentials) => {
        setLoading(true);
        try {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Conta criada com sucesso! Por favor, faça o login.');
        router.push('/login');
        } catch (error: any) {
        console.error("Erro no Cadastro:", error);
        const errorMessage = error.code ? mapFirebaseAuthError(error.code) : 'Falha ao criar a conta.';
        toast.error(errorMessage);
        } finally {
        setLoading(false);
        }
    };

    const logout = async () => {
        // setLoading(true); // Opcional: pode remover loading no logout
        try {
        await signOut(auth);
        toast.success('Logout realizado com sucesso!');
        router.push('/login');
        } catch (error: any) {
        console.error("Erro no Logout:", error);
        toast.error(error.message || 'Falha ao fazer logout.');
        } finally {
        // setLoading(false); // Estado será atualizado pelo onAuthStateChanged
        }
    };

    const value = { user, loading, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Função auxiliar mapFirebaseAuthError (mantida)
const mapFirebaseAuthError = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/invalid-email': return 'Formato de e-mail inválido.';
        case 'auth/user-disabled': return 'Este usuário foi desabilitado.';
        case 'auth/user-not-found':
        case 'auth/wrong-password': return 'E-mail ou senha inválidos.';
        case 'auth/email-already-in-use': return 'Este e-mail já está em uso por outra conta.';
        case 'auth/weak-password': return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
        case 'auth/operation-not-allowed': return 'Login com e-mail/senha não está habilitado.';
        default: return 'Ocorreu um erro inesperado. Tente novamente.';
    }
};
"use client";

import { signIn } from 'next-auth/react';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AtSignIcon, KeyIcon, LogInIcon, Github } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Corrigido aqui
import {signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider} from 'firebase/auth';
import { auth } from '@/firebase/config';


const githubProvider = new GithubAuthProvider();

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth(); // Get loading state from context

  const handleSubmit = async () => {
    try{
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    }catch (error: any) {
    console.error(error.message);
  }
};

  const [error, setError] = useState('');
  const router = useRouter(); // Agora usando o hook correto

  const handleGithubLogin = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex items-center w-full">
      <div className="w-full ">
        {/* Card de Login */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Cabeçalho */}
          <div className="bg-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white text-center">Bem vindo</h1>
            <p className="text-white text-center mt-2">Acesse sua conta para continuar</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-5">
            <div className="space-y-5">
              {/* Campo de E-mail */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSignIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Campo de Senha */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm 
                text-sm font-medium text-white bg-indigo-600"
              >

                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <LogInIcon className="h-4 w-4" />
                    <span>Entrar</span>
                  </>
                )}
              </button>
              <button
                onClick={handleGithubLogin}
                className="flex items-center justify-center
                        bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition
                        duration-200"
              >
                <Github className="h-5 w-5 mr-2" />
                Login com GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
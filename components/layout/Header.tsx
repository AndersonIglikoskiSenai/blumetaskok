"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react'; 


interface HeaderProps {
  onMobileMenuClick?: () => void; 
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuClick }) => {
  const { user, logout, loading } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <nav className="px-4 lg:px-6 py-3 lg:py-4 flex justify-between items-center">
          
          <button
              
              onClick={onMobileMenuClick}
              className="lg:hidden mr-2 p-1 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded" // Adicionado estilo de foco/hover
              aria-label="Abrir menu"
          >
              <Menu className="h-6 w-6" />
          </button>

         <div className="flex-1 lg:flex-none"> {/* Ajuda a alinhar */}
             <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                 BlumeTask
             </h1>
         </div>

        {/* Informações do Usuário e Logout */}
        {user && (
          <div className="flex items-center space-x-2 sm:space-x-4">
             <span className="text-sm text-gray-600 hidden sm:inline">
                Bem-vindo, {user.displayName || user.email}
             </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              disabled={loading}
              className="text-gray-600 hover:bg-gray-100 px-2 sm:px-3"
            >
              <LogOut className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Sair</span>
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
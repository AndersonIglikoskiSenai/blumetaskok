import React from 'react';
import Header from '@/components/layout/Header'; // Seu Header

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // ESTA É A ESTRUTURA DO *LAYOUT* DO DASHBOARD
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Container principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header fixo no topo */}
                <Header />
                {/* Área principal onde a PÁGINA (page.tsx) será renderizada */}
                <main className="flex-1 overflow-y-auto">
                    {children} {/* O conteúdo de page.tsx entra aqui */}
                </main>
            </div>
        </div>
    );
}
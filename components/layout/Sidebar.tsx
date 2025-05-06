import React from 'react';
import { Layout, Clock, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
    activeTab: 'all' | 'pending' | 'completed';
    setActiveTab: (tab: 'all' | 'pending' | 'completed') => void;
    counts: { all: number; pending: number; completed: number };
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, counts }) => {
    const navItems = [
        { id: 'all', label: 'Todas', icon: Layout, count: counts.all },
        { id: 'pending', label: 'Pendentes', icon: Clock, count: counts.pending },
        { id: 'completed', label: 'Concluídas', icon: CheckCircle2, count: counts.completed },
    ] as const;

    return (
        // Largura fixa, fundo branco, borda direita
        // Removido h-full, height será determinado pelo container flex em page.tsx
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
            <div className="p-6"> {/* Padding interno */}
                {/* Logo/Título da Sidebar */}
                <div className="flex items-center gap-2 mb-8">
                    <Layout className="h-6 w-6 text-indigo-600" />
                    <h1 className="text-xl font-bold text-indigo-600">Fluxo de Tarefas</h1>
                </div>

                {/* Navegação/Filtros */}
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            // Estilos condicionais para aba ativa/inativa (light mode)
                            className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors text-sm font-medium ${
                                activeTab === item.id
                                    ? 'bg-indigo-50 text-indigo-600' // Estilo ativo
                                    : 'text-gray-600 hover:bg-gray-100' // Estilo inativo
                            }`}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label} ({item.count})</span>
                        </button>
                    ))}
                </nav>
            </div>
            {/* Pode adicionar links/seções extras aqui se necessário */}
        </aside>
    );
};

export default Sidebar;
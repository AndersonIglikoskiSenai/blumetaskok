"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/lib/types';
import { subscribeToTasks } from '@/lib/firestore';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import TaskList from '@/components/tasks/TaskList';
import LoadingSpinner from '@/components/layout/LoadingSpinner';
import Sidebar from '@/components/layout/Sidebar';
import { toast } from 'sonner';
import { FirestoreError } from 'firebase/firestore';
import { Menu } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const displayName = useMemo(() => {
        if (user?.displayName) return user.displayName;
        if (user?.email) return user.email.split('@')[0];
        return 'Usuário';
    }, [user]);

    useEffect(() => {
        if (!user) {
            setLoadingTasks(false);
            setTasks([]);
            return;
        }
        setLoadingTasks(true);
        setError(null);

        const unsubscribe = subscribeToTasks(
            (fetchedTasks) => {
                setTasks(fetchedTasks);
                setLoadingTasks(false);
                setError(null);
            },
            (err: Error | FirestoreError) => {
                console.error("Falha na subscrição:", err);
                const userMessage = err.message.includes("permissions")
                    ? "Permissões insuficientes. Verifique as regras do Firestore."
                    : err.message || "Erro ao carregar tarefas.";
                setError(userMessage);
                toast.error(userMessage);
                setLoadingTasks(false);
            }
        );
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [user]);

    const taskCounts = useMemo(() => {
        const pending = tasks.filter(task => !task.completed).length;
        const completed = tasks.length - pending;
        return { all: tasks.length, pending, completed };
    }, [tasks]);

    const renderContent = () => {
        if (loadingTasks) {
            return (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner size={48} className="text-indigo-600" />
                </div>
            );
        }
        if (error) {
            return <div className="mt-4 p-4 text-center text-red-700 bg-red-100 border border-red-300 rounded-md">{error}</div>;
        }
        return <TaskList tasks={tasks} activeTab={activeTab} />;
    };

    // --- ESTRUTURA RESPONSIVA ---
    return (
        <div className="flex h-full">
            <div className="hidden lg:block"> 
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    counts={taskCounts}
                />
            </div>

            <div className="w-full lg:flex-1 p-4 sm:p-6 overflow-y-auto"> 
                 <div className="lg:hidden mb-4">
                     <button
                         onClick={() => setIsMobileSidebarOpen(true)}
                         className="p-2 rounded bg-gray-100 hover:bg-gray-200"
                        >
                         <Menu className="h-5 w-5 text-gray-700" />
                     </button>
                 </div> 
                 
                <section className="mb-6 md:mb-8"> 
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                        Olá, <span className="text-indigo-600">{displayName}</span>!
                    </h2>
                    <p className="text-sm text-gray-600"> 
                         {loadingTasks && !error ? 'Carregando suas tarefas...' :
                          !loadingTasks && !error && taskCounts.pending > 0 ? `Você tem ${taskCounts.pending} ${taskCounts.pending === 1 ? 'tarefa pendente' : 'tarefas pendentes'}.` :
                          !loadingTasks && !error && taskCounts.pending === 0 ? 'Nenhuma tarefa pendente. Bom trabalho!' :
                          error ? 'Não foi possível carregar as tarefas.' : ''
                         }
                    </p>
                </section>

                <AddTaskForm />

                {renderContent()}
            </div>

            {isMobileSidebarOpen && (
                 <div className="fixed inset-0 z-40 flex lg:hidden">
                     <div className="fixed inset-0 bg-black/30" onClick={() => setIsMobileSidebarOpen(false)}></div>
                     <div className="relative bg-white w-64 h-full border-r border-gray-200">
                         <Sidebar
                             activeTab={activeTab}
                             setActiveTab={(tab) => {
                                 setActiveTab(tab);
                                 setIsMobileSidebarOpen(false); // Fecha ao selecionar
                             }}
                             counts={taskCounts}
                         />
                         <button
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
                         >
                             X
                         </button>
                     </div>
                 </div>
             )} 
        </div>
    );
}
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from 'lucide-react';
import { addTask } from '@/lib/firestore';
import { toast } from "sonner";

const AddTaskForm: React.FC = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('--- handleSubmit EXECUTADO ---', new Date().toLocaleTimeString());
        e.preventDefault();

        if (!taskTitle.trim()) {
            console.log('Título vazio, mostrando toast...');
            // ---- TENTATIVA: Atrasar o toast ligeiramente ----
            setTimeout(() => {
                toast.error("O título da tarefa não pode estar vazio.");
            }, 0); // Delay de 0ms
            // ---------------------------------------------
            return;
        }

        setLoading(true);
        try {
            const newTaskId = await addTask(taskTitle.trim());
            if (newTaskId) {
                setTaskTitle('');
                // ---- TENTATIVA: Atrasar o toast ligeiramente ----
                setTimeout(() => {
                    toast.success("Tarefa adicionada!");
                }, 0);
                // ---------------------------------------------
            } else {
                // ---- TENTATIVA: Atrasar o toast ligeiramente ----
                setTimeout(() => {
                    toast.error("Falha ao adicionar tarefa.");
                }, 0);
                // ---------------------------------------------
            }
        } catch (error) {
            console.error("Erro ao tentar adicionar tarefa:", error);
            // ---- TENTATIVA: Atrasar o toast ligeiramente ----
            setTimeout(() => {
                toast.error("Ocorreu um erro ao adicionar a tarefa.");
            }, 0);
            // ---------------------------------------------
        } finally {
            setLoading(false);
        }
    };

    // --- JSX do Componente (sem alterações) ---
    return (
        <section className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <Input
                        type="text"
                        placeholder="Adicionar nova tarefa..."
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className="flex-grow px-4 py-2 h-10 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                        disabled={loading}
                        aria-label="Nova tarefa"
                    />
                    <Button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 disabled:opacity-70 flex items-center gap-2 shrink-0"
                    >
                        {loading ? ( <Loader2 className="h-5 w-5 animate-spin" /> ) : ( <Plus className="h-5 w-5" /> )}
                        <span className="hidden sm:inline">{loading ? 'Adicionando...' : 'Adicionar'}</span>
                        <span className="sm:hidden inline">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}</span>
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default AddTaskForm;
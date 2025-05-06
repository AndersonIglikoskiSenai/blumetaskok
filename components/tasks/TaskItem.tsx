"use client";

import React, { useState, useMemo } from 'react';
import { Task, Activity } from '@/lib/types';
import { updateTask, deleteTask } from '@/lib/firestore';
import { db } from '@/firebase/config';
import { doc, collection } from 'firebase/firestore';
// CORRIGIDO O CAMINHO DOS IMPORTS UI <<<========================= CORREÇÃO
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input"; // Corrigido
import { Separator } from "@/components/ui/separator"; // Corrigido
import { toast } from "sonner";
import { Trash2, Edit, ChevronDown, ChevronUp, Plus, Loader2 } from 'lucide-react';

// O restante do componente TaskItem permanece igual ao que te enviei antes...
// (Cole o restante do código do TaskItem aqui)
interface TaskItemProps {
    task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    // === MANTENHA TODO O SEU ESTADO E LÓGICA ===
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const [newActivityName, setNewActivityName] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingActivity, setLoadingActivity] = useState(false);

    const progress = useMemo(() => {
        if (!task.activities || task.activities.length === 0) return 0;
        const completedCount = task.activities.filter(act => act.completed).length;
        return Math.round((completedCount / task.activities.length) * 100);
    }, [task.activities]);

    // --- Handlers (Mantidos como no seu original) ---
    const handleToggleComplete = async (checked: boolean) => {
        setLoadingUpdate(true);
        const success = await updateTask(task.id, { completed: checked });
        if (!success) toast.error("Falha ao atualizar status da tarefa.");
        setLoadingUpdate(false);
    };

    const handleDelete = async () => {
        if (window.confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
            setLoadingDelete(true);
            const success = await deleteTask(task.id);
            if (success) {
                toast.success("Tarefa excluída.");
            } else {
                toast.error("Falha ao excluir tarefa.");
            }
            setLoadingDelete(false);
        }
    };

    const handleTitleUpdate = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newTitle.trim() || newTitle === task.title) {
            setIsEditingTitle(false);
            setNewTitle(task.title);
            return;
        }
        setLoadingUpdate(true);
        const success = await updateTask(task.id, { title: newTitle.trim() });
        if (success) {
            toast.success("Título da tarefa atualizado.");
            setIsEditingTitle(false);
        } else {
            toast.error("Falha ao atualizar título.");
            setNewTitle(task.title); // Reverte em caso de erro
        }
        setLoadingUpdate(false);
    };

    const handleAddActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newActivityName.trim()) return;
        setLoadingActivity(true);
        const newActivity: Activity = {
            id: doc(collection(db, '_')).id, // Sua geração de ID
            name: newActivityName.trim(),
            completed: false,
        };
        const updatedActivities = [...(task.activities || []), newActivity];
        const success = await updateTask(task.id, { activities: updatedActivities });
        if (success) {
            toast.success("Atividade adicionada.");
            setNewActivityName('');
            if (!isExpanded) setIsExpanded(true);
        } else {
            toast.error("Falha ao adicionar atividade.");
        }
        setLoadingActivity(false);
    };

    const handleToggleActivity = async (activityId: string, completed: boolean) => {
        setLoadingActivity(true);
        const updatedActivities = (task.activities || []).map(act =>
            act.id === activityId ? { ...act, completed } : act
        );
        const success = await updateTask(task.id, { activities: updatedActivities });
        if (!success) toast.error("Falha ao atualizar status da atividade.");
        setLoadingActivity(false);
    };

    const handleDeleteActivity = async (activityId: string) => {
        if (!window.confirm("Tem certeza que deseja excluir esta atividade?")) return;
        setLoadingActivity(true);
        const updatedActivities = (task.activities || []).filter(act => act.id !== activityId);
        const success = await updateTask(task.id, { activities: updatedActivities });
        if (success) {
            toast.success("Atividade excluída.");
        } else {
            toast.error("Falha ao excluir atividade.");
        }
        setLoadingActivity(false);
    };
    // === FIM DA LÓGICA MANTIDA ===


    // --- JSX (Aplicando Estilos do App.tsx) ---
    return (
        // Container principal do item (div em vez de Card) com estilos App.tsx
        <div
            className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ${
                task.completed ? 'opacity-70' : '' // Opacidade para tarefas concluídas
            }`}
        >
            {/* Header do Item (Checkbox, Título, Botões) */}
            <div className="flex items-center gap-4 p-4"> {/* Gap e Padding */}
                {/* Checkbox Principal */}
                <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={handleToggleComplete}
                    className="h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white focus:ring-indigo-500 transition-colors duration-200 flex-shrink-0"
                    aria-label={`Marcar tarefa ${task.title} como ${task.completed ? 'incompleta' : 'completa'}`}
                    disabled={loadingUpdate || loadingDelete || loadingActivity}
                />
                {/* Título (Editável ou Display) */}
                <div className="flex-grow min-w-0">
                    {isEditingTitle ? (
                        <form onSubmit={handleTitleUpdate} className="flex-grow">
                            <Input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onBlur={handleTitleUpdate} // Salva ao perder foco
                                autoFocus
                                // Estilo sutil para edição in-loco
                                className={`h-8 text-sm p-1 border-b border-gray-300 focus:border-indigo-500 outline-none ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                                disabled={loadingUpdate}
                            />
                        </form>
                    ) : (
                        <label
                            htmlFor={`task-${task.id}`} // Associar ao checkbox
                            className={`block text-sm font-medium cursor-pointer ${
                                task.completed
                                    ? 'line-through text-gray-500' // Cor concluída
                                    : 'text-gray-800' // Cor pendente
                            }`}
                            // Permitir clique para editar (poderia desabilitar se task.completed)
                            onClick={() => setIsEditingTitle(true)}
                            title={task.title} // Tooltip para títulos longos
                        >
                            {task.title}
                        </label>
                    )}
                     {/* Data de criação (Opcional, como em App.tsx) */}
                     {task.createdAt && (
                         <p className="text-xs text-gray-500 mt-1">
                            Adicionada em {new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                                .format(task.createdAt instanceof Date ? task.createdAt : task.createdAt.toDate()) /* Necessário .toDate() para Timestamp */}
                        </p>
                      )}
                </div>
                {/* Botões de Ação */}
                <div className="flex items-center flex-shrink-0 space-x-1 ml-2">
                    {!isEditingTitle && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-indigo-600 hover:bg-gray-100" onClick={() => setIsEditingTitle(true)} disabled={loadingUpdate || loadingDelete || loadingActivity} aria-label="Editar título">
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-100" onClick={handleDelete} disabled={loadingDelete || loadingUpdate || loadingActivity} aria-label="Excluir tarefa">
                        {loadingDelete ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                    {/* Renderiza botão de expandir apenas se houver atividades ou for desejado */}
                    {(task.activities && task.activities.length > 0 || !isExpanded) && ( // Ajuste a condição se quiser sempre mostrar
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100" onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}>
                             {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                         </Button>
                     )}
                </div>
            </div>

            {/* Conteúdo Expansível (Atividades) */}
            {isExpanded && (
                <>
                    <Separator />
                    <div className="px-4 pt-3 pb-4 text-sm space-y-3"> {/* Padding interno */}
                        {/* Barra de Progresso (Mantida) */}
                        {task.activities && task.activities.length > 0 && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Progresso</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1.5" aria-label={`${progress}% de conclusão da tarefa`} />
                            </div>
                        )}

                        {/* Lista de Atividades (Mantida com ajustes de estilo) */}
                        <div className="space-y-2">
                            <h4 className="font-medium text-xs text-gray-600">Atividades:</h4>
                            {(task.activities && task.activities.length > 0) ? (
                                <ul className="space-y-1 pl-1"> {/* Reduzido pl */}
                                    {task.activities.map(activity => (
                                        <li key={activity.id} className="flex items-center justify-between group -ml-1"> {/* Negativo ml para alinhar checkbox */}
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`activity-${activity.id}`}
                                                    checked={activity.completed}
                                                    onCheckedChange={(checked) => handleToggleActivity(activity.id, !!checked)}
                                                    disabled={loadingActivity || loadingDelete}
                                                    className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white focus:ring-indigo-400"
                                                    aria-label={`Marcar atividade ${activity.name} como ${activity.completed ? 'incompleta' : 'completa'}`}
                                                />
                                                <label htmlFor={`activity-${activity.id}`} className={`text-xs ${activity.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                                    {activity.name}
                                                </label>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100" onClick={() => handleDeleteActivity(activity.id)} disabled={loadingActivity || loadingDelete} aria-label="Excluir atividade">
                                                {/* Spinner sutil no delete da atividade */}
                                                {loadingActivity ? <Loader2 className="h-3 w-3 animate-spin"/> : <Trash2 className="h-3 w-3"/>}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-gray-500 italic pl-1">Nenhuma atividade adicionada.</p>
                            )}
                        </div>

                        <form onSubmit={handleAddActivity} className="flex gap-1 items-center pt-2">
                            <Input
                                type="text"
                                placeholder="Adicionar nova atividade..."
                                value={newActivityName}
                                onChange={(e) => setNewActivityName(e.target.value)}
                                // Estilo sutil para input de atividade
                                className="flex-grow h-7 text-xs px-2 rounded border-gray-200 bg-gray-50 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={loadingActivity || loadingDelete}
                                aria-label="Nome da nova atividade"
                            />
                            <Button type="submit" size="sm" variant="outline" className="h-7 px-2 border-gray-300 text-gray-600 hover:bg-gray-100" disabled={loadingActivity || loadingDelete}>
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                            </Button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskItem;
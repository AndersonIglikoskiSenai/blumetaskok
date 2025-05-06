import React from 'react';
import { Task } from '@/lib/types';
import TaskItem from '@/components/tasks/TaskItem';
import { Layout } from 'lucide-react';

interface TaskListProps {
    tasks: Task[];
    activeTab: 'all' | 'pending' | 'completed';
}

const TaskList: React.FC<TaskListProps> = ({ tasks, activeTab }) => {
    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'pending') return !task.completed;
        if (activeTab === 'completed') return task.completed;
        return true;
    });

    const getEmptyStateMessage = () => {
        switch (activeTab) {
            case 'pending': return 'Nenhuma tarefa pendente. Ótimo trabalho!';
            case 'completed': return 'Nenhuma tarefa concluída ainda.';
            default: return 'Nenhuma tarefa ainda. Adicione uma acima!';
        }
    };

    return (
        <section>
            {filteredTasks.length === 0 ? (
                // Estado vazio
                <div className="text-center py-10 sm:py-12"> 
                    <div className="block w-full max-w-md mx-auto bg-gray-100 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
                        <Layout className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" /> {/* Ícone responsivo */}
                        <p className="text-gray-500 text-sm sm:text-base"> {/* Texto responsivo */}
                            {getEmptyStateMessage()}
                        </p>
                    </div>
                </div>
            ) : (
                // Lista de tarefas
                <div className="space-y-3">
                    {filteredTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default TaskList;
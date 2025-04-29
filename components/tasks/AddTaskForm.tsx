import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from 'lucide-react';
import { addTask } from '@/lib/firestore';
import { toast } from "sonner"; // <<< Atualizado aqui

const AddTaskForm: React.FC = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
        toast.error("Task title cannot be empty."); // <<< Uso do toast do sonner
        return;
    }
    setLoading(true);
    const success = await addTask(taskTitle.trim());
    if (success) {
      setTaskTitle('');
      toast.success("Task added!"); // <<< Uso do toast do sonner
    } else {
      toast.error("Failed to add task. Please try again."); // <<< Uso do toast do sonner
    }
    setLoading(false);
  };

  // ... resto do componente
  return (
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="flex-grow"
          disabled={loading}
          aria-label="New task title"
        />
        <Button type="submit" disabled={loading}>
          <Plus className="h-4 w-4 mr-1" />
          {loading ? 'Adding...' : 'Add Task'}
        </Button>
      </form>
    );
};

export default AddTaskForm;
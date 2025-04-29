"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Task } from '@/lib/types';
import { subscribeToTasks } from '@/lib/firestore'; // Import the subscription function
import AddTaskForm from '@/components/tasks/AddTaskForm';
import TaskList from '@/components/tasks/TaskList';
import LoadingSpinner from '@/components/layout/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return; // Don't try to fetch if user is not loaded

    setLoadingTasks(true);
    setError(null);

    // Subscribe to tasks and get the unsubscribe function
    const unsubscribe = subscribeToTasks((fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoadingTasks(false);
    });

    // Return the unsubscribe function to be called on component unmount
    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
  }, [user]); // Re-run effect when user changes

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
            Welcome back! Here are your tasks. Add new ones below.
        </p>
        <AddTaskForm />
      </div>

      <hr className="dark:border-gray-700"/>

      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Your Tasks</h3>
        {loadingTasks && <div className="text-center p-4"><LoadingSpinner /></div>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loadingTasks && !error && (
          tasks.length > 0
            ? <TaskList tasks={tasks} />
            : <p className="text-center text-gray-500 dark:text-gray-400">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}
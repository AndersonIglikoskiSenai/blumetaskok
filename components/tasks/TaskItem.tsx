"use client"; // Needs client-side interaction

import React, { useState, useMemo } from 'react';
import { Task, Activity } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Trash2, Edit, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { updateTask, deleteTask, updateActivityInTask, deleteActivityFromTask, addActivityToTask } from '@/lib/firestore';
import { toast } from "sonner";
import { Input } from '../ui/input'; // Assuming Input is correctly imported
import { Separator } from '../ui/separator';


interface TaskItemProps {
    task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const [newActivityName, setNewActivityName] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false); // General update loading
    const [loadingActivity, setLoadingActivity] = useState(false); // For add/update/delete activity


    // Memoize calculation of progress
    const progress = useMemo(() => {
        if (!task.activities || task.activities.length === 0) return 0;
        const completedCount = task.activities.filter(act => act.completed).length;
        return Math.round((completedCount / task.activities.length) * 100);
    }, [task.activities]);

    // --- Handlers ---

    const handleToggleComplete = async (checked: boolean) => {
        setLoadingUpdate(true);
        const success = await updateTask(task.id, { completed: checked });
        if (!success) toast.error("Failed to update task status.");
        // No success toast needed, UI change is indication
        setLoadingUpdate(false);
    };

     const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
            setLoadingDelete(true);
            const success = await deleteTask(task.id);
            if (success) {
                toast.success("Task deleted.");
                // The task will disappear due to the real-time subscription
            } else {
                toast.error("Failed to delete task.");
            }
            setLoadingDelete(false); // Still set loading false on error
        }
    };

     const handleTitleUpdate = async (e?: React.FormEvent) => {
        e?.preventDefault(); // Prevent form submission if used in a form
        if (!newTitle.trim() || newTitle === task.title) {
            setIsEditingTitle(false);
            setNewTitle(task.title); // Reset if invalid or unchanged
            return;
        }
        setLoadingUpdate(true);
        const success = await updateTask(task.id, { title: newTitle.trim() });
         if (success) {
             toast.success("Task title updated.");
             setIsEditingTitle(false);
         } else {
             toast.error("Failed to update title.");
             setNewTitle(task.title); // Reset on error
         }
        setLoadingUpdate(false);
    };

    const handleAddActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newActivityName.trim()) return;

        setLoadingActivity(true);
        const newActivity: Activity = {
            id: doc(collection(db, '_')).id, // Firestore offline ID generation
            name: newActivityName.trim(),
            completed: false,
        };
        const updatedActivities = [...(task.activities || []), newActivity];
        const success = await updateTask(task.id, { activities: updatedActivities });

        if (success) {
            toast.success("Activity added.");
            setNewActivityName(''); // Clear input
            if (!isExpanded) setIsExpanded(true); // Expand if adding first activity
        } else {
            toast.error("Failed to add activity.");
        }
        setLoadingActivity(false);
    };

    const handleToggleActivity = async (activityId: string, completed: boolean) => {
         setLoadingActivity(true);
         const updatedActivities = (task.activities || []).map(act =>
             act.id === activityId ? { ...act, completed } : act
         );
         const success = await updateTask(task.id, { activities: updatedActivities });
         if (!success) toast.error("Failed to update activity status.");
         setLoadingActivity(false);
    };

     const handleDeleteActivity = async (activityId: string) => {
        if (!window.confirm("Are you sure you want to delete this activity?")) return;

        setLoadingActivity(true);
        const updatedActivities = (task.activities || []).filter(act => act.id !== activityId);
        const success = await updateTask(task.id, { activities: updatedActivities });
        if (success) {
            toast.success("Activity deleted.");
        } else {
            toast.error("Failed to delete activity.");
        }
        setLoadingActivity(false);
    };


    return (
        <Card className={`transition-all duration-300 ${task.completed ? 'bg-gray-100 dark:bg-gray-800 opacity-70' : 'bg-white dark:bg-gray-850'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4">
                <div className="flex items-center space-x-3 flex-grow min-w-0">
                     {/* Disable checkbox interaction while updating */}
                    <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={handleToggleComplete}
                        aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                        disabled={loadingUpdate || loadingDelete || loadingActivity}
                    />
                    {isEditingTitle ? (
                         <form onSubmit={handleTitleUpdate} className="flex-grow">
                            <Input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onBlur={() => handleTitleUpdate()} // Save on blur
                                autoFocus
                                className={`h-8 text-sm ${task.completed ? 'line-through' : ''}`}
                                disabled={loadingUpdate}
                            />
                        </form>
                    ) : (
                       <label
                          htmlFor={`task-${task.id}`}
                          className={`text-sm font-medium leading-none truncate cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}
                          onClick={() => setIsEditingTitle(true)} // Click label to edit
                          title={task.title} // Show full title on hover if truncated
                        >
                          {task.title}
                        </label>
                    )}
                </div>
                 <div className="flex items-center space-x-1">
                     {!isEditingTitle && (
                         <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setIsEditingTitle(true)}
                            disabled={loadingUpdate || loadingDelete || loadingActivity}
                            aria-label="Edit task title"
                         >
                            <Edit className="h-4 w-4" />
                        </Button>
                     )}
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        onClick={handleDelete}
                        disabled={loadingDelete || loadingUpdate || loadingActivity}
                        aria-label="Delete task"
                     >
                         {loadingDelete ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                     </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setIsExpanded(!isExpanded)}
                         aria-label={isExpanded ? "Collapse details" : "Expand details"}
                     >
                         {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                     </Button>
                 </div>
            </CardHeader>

            {/* Expandable Content */}
            {isExpanded && (
                <>
                 <Separator className="my-0" />
                <CardContent className="pt-3 pb-2 px-4 text-sm space-y-3">
                    {/* Progress Bar */}
                     {task.activities && task.activities.length > 0 && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} aria-label={`${progress}% task completion`} />
                        </div>
                    )}

                     {/* Activities List */}
                    <div className="space-y-2">
                         <h4 className="font-medium text-xs text-gray-600 dark:text-gray-300">Activities:</h4>
                         {(task.activities && task.activities.length > 0) ? (
                            <ul className="space-y-1 pl-2">
                                {task.activities.map(activity => (
                                    <li key={activity.id} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`activity-${activity.id}`}
                                                checked={activity.completed}
                                                onCheckedChange={(checked) => handleToggleActivity(activity.id, !!checked)} // Ensure boolean
                                                 disabled={loadingActivity || loadingDelete}
                                                 aria-label={`Mark activity ${activity.name} as ${activity.completed ? 'incomplete' : 'complete'}`}
                                             />
                                             <label
                                                htmlFor={`activity-${activity.id}`}
                                                 className={`text-xs ${activity.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}
                                             >
                                                 {activity.name}
                                            </label>
                                        </div>
                                         <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteActivity(activity.id)}
                                             disabled={loadingActivity || loadingDelete}
                                             aria-label="Delete activity"
                                         >
                                              {loadingActivity ? <Loader2 className="h-3 w-3 animate-spin"/> : <Trash2 className="h-3 w-3"/>}
                                         </Button>
                                    </li>
                                ))}
                            </ul>
                         ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-400 italic pl-2">No activities added yet.</p>
                         )}
                     </div>

                     {/* Add Activity Form */}
                     <form onSubmit={handleAddActivity} className="flex gap-1 items-center pt-2">
                        <Input
                            type="text"
                            placeholder="Add new activity..."
                            value={newActivityName}
                            onChange={(e) => setNewActivityName(e.target.value)}
                            className="flex-grow h-7 text-xs"
                            disabled={loadingActivity || loadingDelete}
                             aria-label="New activity name"
                         />
                         <Button
                            type="submit"
                            size="sm"
                            variant="outline"
                             className="h-7 px-2"
                            disabled={loadingActivity || loadingDelete}
                         >
                             <Plus className="h-3 w-3 mr-1" />
                            {loadingActivity ? 'Adding...' : 'Add'}
                         </Button>
                    </form>
                </CardContent>
                 {/* Optional Footer Content if needed */}
                {/* <Separator className="my-0" />
                <CardFooter className="text-xs text-gray-500 dark:text-gray-400 px-4 py-2">
                    Created: {task.createdAt ? new Date(task.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                </CardFooter> */}
                 </>
            )}
        </Card>
    );
};


// You might need the Loader2 icon if not already imported
import { Loader2 } from 'lucide-react';
// You might need Firestore functions if not already imported
import { doc, collection } from 'firebase/firestore';
import { db } from '@/firebase/config';

export default TaskItem;
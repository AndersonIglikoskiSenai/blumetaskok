import { db, auth } from '@/firebase/config';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  onSnapshot, // Import for real-time updates
  orderBy // Import for sorting
} from 'firebase/firestore';
import { Task, Activity } from './types'; // Assuming types are defined here

const TASKS_COLLECTION = 'tasks';

// --- Task Operations ---

export const addTask = async (title: string): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user logged in to add task");
    return null;
  }

  try {
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
      title: title,
      userId: user.uid,
      createdAt: serverTimestamp(),
      completed: false,
      activities: [], // Initialize with empty activities array
    });
    console.log("Task added with ID: ", docRef.id);
    return docRef.id; // Return the new task ID
  } catch (e) {
    console.error("Error adding task: ", e);
    return null;
  }
};

// Subscribe to real-time task updates
export const subscribeToTasks = (
    callback: (tasks: Task[]) => void
): (() => void) | null => { // Return an unsubscribe function
    const user = auth.currentUser;
    if (!user) {
        console.error("No user logged in to subscribe to tasks");
        // Instead of returning null, maybe return a no-op unsubscribe?
        return () => {};
    }

    const q = query(
        collection(db, TASKS_COLLECTION),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc") // Order by creation time, newest first
    );

    // onSnapshot returns an unsubscribe function
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasks: Task[] = [];
        querySnapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() } as Task);
        });
        callback(tasks); // Call the callback with the new tasks array
    }, (error) => {
        console.error("Error subscribing to tasks: ", error);
        // Handle error appropriately, maybe notify the user
    });

    return unsubscribe; // Return the function to stop listening
};


export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<boolean> => {
   const user = auth.currentUser;
   if (!user) return false; // Or check if task belongs to user based on fetched data

  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  try {
    // TODO: Add security rule check server-side to ensure user owns task
    await updateDoc(taskRef, updates);
    console.log("Task updated successfully: ", taskId);
    return true;
  } catch (e) {
    console.error("Error updating task: ", e);
    return false;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  const user = auth.currentUser;
   if (!user) return false; // Or check ownership before deleting

  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  try {
    // TODO: Add security rule check server-side to ensure user owns task
    await deleteDoc(taskRef);
    console.log("Task deleted successfully: ", taskId);
    return true;
  } catch (e) {
    console.error("Error deleting task: ", e);
    return false;
  }
};


// --- Activity Operations (within a Task) ---

// Note: Activities are part of the Task document. We update the task document.

export const addActivityToTask = async (taskId: string, activityName: string): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  const newActivity: Activity = {
    id: doc(collection(db, 'dummy')).id, // Generate a unique ID client-side
    name: activityName,
    completed: false,
  };

  try {
    // Fetch the current task data first (or use the data you already have in state)
    // For simplicity here, we assume you might need to fetch, but ideally use state data
    // const taskSnap = await getDoc(taskRef);
    // if (!taskSnap.exists() || taskSnap.data().userId !== user.uid) return false; // Security check
    // const currentActivities = taskSnap.data().activities || [];

    // Get current activities from state if available, otherwise fetch
    // This example assumes direct update - ensure you have the latest task data
    // A better approach is to fetch the task, update activities array, then save.
    // Or, get the task data from your component's state if it's up-to-date.

    // Simplification: Directly update using arrayUnion (might not be ideal if order matters or duplicates are issue)
    // await updateDoc(taskRef, {
    //   activities: arrayUnion(newActivity)
    // });

    // Better: Update the entire activities array (assuming you have it in state)
    // Let's assume you pass the current activities array to this function or fetch it
    // For now, we'll skip the fetch for brevity - **UPDATE THIS IN REAL IMPLEMENTATION**
    // You'll likely manage activities state in your TaskItem component

    // Placeholder: In a real app, you'd get the current activities, add the new one,
    // and then call updateTask with the new activities array.
     console.warn("addActivityToTask needs to fetch current activities or receive them to update correctly.");
     // Example structure (replace with actual logic using state or fetching):
     // const currentTask = ... // Get task data from state or fetch
     // const updatedActivities = [...currentTask.activities, newActivity];
     // return await updateTask(taskId, { activities: updatedActivities });
    return false; // Placeholder return

  } catch (e) {
    console.error("Error adding activity: ", e);
    return false;
  }
};

// Update/Delete Activity will similarly require getting the task, modifying the
// activities array, and then calling updateTask.

export const updateActivityInTask = async (taskId: string, activityId: string, updates: Partial<Activity>): Promise<boolean> => {
     const user = auth.currentUser;
     if (!user) return false;
     console.warn("updateActivityInTask needs implementation using updateTask and modifying the activities array.");
      // Fetch task, find activity by id, update it, save task using updateTask
     return false; // Placeholder
};


export const deleteActivityFromTask = async (taskId: string, activityId: string): Promise<boolean> => {
      const user = auth.currentUser;
      if (!user) return false;
     console.warn("deleteActivityFromTask needs implementation using updateTask and removing from the activities array.");
     // Fetch task, filter out activity by id, save task using updateTask
     return false; // Placeholder
};
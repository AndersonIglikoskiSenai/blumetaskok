import { db, auth } from '@/firebase/config';
import {
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  FirestoreError // Mantenha a importação para tipar erros recebidos do Firestore
} from 'firebase/firestore';
import { Task } from './types';

const TASKS_COLLECTION = 'tasks';

// --- Task Operations ---

// addTask, updateTask, deleteTask permanecem iguais

export const addTask = async (title: string): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Nenhum usuário logado para adicionar tarefa");
    // Você poderia lançar um erro aqui também, se preferir
    // throw new Error("Nenhum usuário logado.");
    return null;
  }
  try {
    const docData = {
      title: title,
      userId: user.uid,
      createdAt: serverTimestamp(),
      completed: false,
      activities: [],
    };
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), docData);
    console.log("Tarefa adicionada com ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Erro ao adicionar tarefa: ", e);
    // Relançar ou retornar null
    return null;
  }
};

// Subscribe to real-time task updates
export const subscribeToTasks = (
    onUpdate: (tasks: Task[]) => void,
    // O callback de erro pode receber um Error genérico ou um FirestoreError
    onError: (error: Error | FirestoreError) => void
): (() => void) => { // Sempre retorna uma função de unsubscribe
    const user = auth.currentUser;
    if (!user) {
        console.error("Nenhum usuário logado para subscrever tarefas");
        // CORREÇÃO: Crie um objeto Error padrão
        onError(new Error("Nenhum usuário logado. Não é possível carregar tarefas."));
        return () => {}; // Retorna função vazia
    }

    const q = query(
        collection(db, TASKS_COLLECTION),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    // O onSnapshot lida com FirestoreError internamente
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasks: Task[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            tasks.push({
                id: doc.id,
                ...data,
            } as Task);
        });
        onUpdate(tasks);
    },
    (error: FirestoreError) => { // O erro do onSnapshot É um FirestoreError
        console.error("Erro ao subscrever tarefas: ", error);
        onError(error); // Passa o erro específico do Firestore
    });

    return unsubscribe;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<boolean> => {
   const user = auth.currentUser;
   if (!user) {
       console.error("Usuário não autenticado para atualizar tarefa");
       return false;
   }
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  try {
    await updateDoc(taskRef, updates);
    console.log("Tarefa atualizada com sucesso: ", taskId);
    return true;
  } catch (e) {
    console.error("Erro ao atualizar tarefa: ", e);
    return false;
  }
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  const user = auth.currentUser;
   if (!user) {
       console.error("Usuário não autenticado para deletar tarefa");
       return false;
   }
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  try {
    await deleteDoc(taskRef);
    console.log("Tarefa deletada com sucesso: ", taskId);
    return true;
  } catch (e) {
    console.error("Erro ao deletar tarefa: ", e);
    return false;
  }
};
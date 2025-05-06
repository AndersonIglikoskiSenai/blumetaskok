import { Timestamp } from 'firebase/firestore';

// Definição para Atividades
export interface Activity {
  id: string; // ID único para a atividade
  name: string;
  completed: boolean;
}

// Definição para Tarefas
export interface Task {
  id: string; // ID do documento no Firestore
  title: string;
  userId: string; // ID do usuário que criou a tarefa
  createdAt: Timestamp | Date; // Timestamp do Firestore ou objeto Date após conversão
  completed: boolean;
  activities: Activity[]; // Array de sub-atividades
}

// Definição para Credenciais de Autenticação (se usar em algum lugar)
export interface AuthCredentials {
    email: string;
    password: string;
}
import { Timestamp } from 'firebase/firestore';

// Definição para Tarefas e Atividades (já deve estar aqui)
export interface Activity {
  id: string;
  name: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  userId: string;
  createdAt: Timestamp;
  completed: boolean;
  activities: Activity[];
}

// --- ADICIONE OU VERIFIQUE ESTA PARTE ---
// Definição para Credenciais de Autenticação
export interface AuthCredentials {
    email: string;
    password: string;
}
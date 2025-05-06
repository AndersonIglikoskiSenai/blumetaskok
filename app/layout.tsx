import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css'; // Import global CSS aqui
import { AuthProvider } from '@/context/AuthContext'; // Provider aqui
import { Toaster } from "@/components/ui/sonner"; // Toaster aqui

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager App', // Título raiz
  description: 'Gerencie suas tarefas eficientemente.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Defina idioma e tags raiz aqui
    <html lang="pt-BR">
      {/* Aplique fontes e classes globais aqui */}
      <body className={`${inter.className} antialiased`}>
        {/* Envolva com providers globais aqui */}
        <AuthProvider>
           {/* Renderize Toaster global aqui */}
           <Toaster richColors position="top-center" />
           {/* Renderize os filhos (que podem ser layouts aninhados ou páginas) */}
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}
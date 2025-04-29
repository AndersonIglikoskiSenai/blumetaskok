// app/layout.tsx (Atualizado)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner"; // <<< Atualizado aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager Platform",
  description: "Manage your daily tasks efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
           <Toaster richColors position="top-center" /> {/* <<< Atualizado aqui (richColors é opcional) */}
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}
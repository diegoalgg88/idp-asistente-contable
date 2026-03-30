import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";
import { CommandMenu } from "@/components/layout/command-menu";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Header } from "@/components/layout/header";
import { ErrorBoundary } from "@/components/layout/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IDP Asistente Contable",
  description: "Intelligent Data Processing Hub for Accountants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="antialiased">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <div className="relative min-h-screen flex flex-col">
              <CommandMenu />
              <Header />
              <div className="container px-6 py-4">
                <Breadcrumbs />
              </div>
              <ErrorBoundary>
                <main className="flex-1">
                  {children}
                </main>
              </ErrorBoundary>
              <Toaster position="top-right" richColors closeButton />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

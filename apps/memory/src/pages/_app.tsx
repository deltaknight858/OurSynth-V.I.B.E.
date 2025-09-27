import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Layout/Navigation";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Component {...pageProps} />
            </main>
          </div>
          <Toaster />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

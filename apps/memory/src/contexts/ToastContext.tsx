
import { createContext, useContext, ReactNode } from "react";

interface ToastContextType {
  toast: (options: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = (options: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    // Simple console log for now - in a real app you'd use a toast library
    console.log("Toast:", options);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

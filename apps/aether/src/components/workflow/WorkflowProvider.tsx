
import { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";

interface WorkflowProviderProps {
  children: ReactNode;
}

export function WorkflowProvider({ children }: WorkflowProviderProps) {
  return (
    <ReactFlowProvider>
      {children}
    </ReactFlowProvider>
  );
}

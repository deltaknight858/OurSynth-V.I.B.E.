
import { ReactNode } from "react";
import { NodeLibrary } from "./NodeLibrary";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface WorkflowLayoutProps {
  children: ReactNode;
}

export function WorkflowLayout({ children }: WorkflowLayoutProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-4rem)]"
    >
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <NodeLibrary />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={80}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

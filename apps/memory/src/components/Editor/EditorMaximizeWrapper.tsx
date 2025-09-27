
import { ReactNode, useState } from "react";
import { MaximizeWrapper } from "@/components/MindMap/MaximizeWrapper";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface EditorMaximizeWrapperProps {
  children: ReactNode;
  isPageMaximized?: boolean;
  onPageMaximizeChange?: () => void;
  title?: string;
}

export function EditorMaximizeWrapper({
  children,
  isPageMaximized,
  onPageMaximizeChange,
  title = "Note Editor"
}: EditorMaximizeWrapperProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  // Handle maximizing either through internal state or page state
  const handleToggleMaximize = () => {
    // If we have page maximize control, use that
    if (onPageMaximizeChange) {
      onPageMaximizeChange();
    } else {
      // Otherwise use internal state
      setIsMaximized(!isMaximized);
    }
  };

  // Determine if we're maximized based on props or internal state
  const effectivelyMaximized = isPageMaximized !== undefined ? isPageMaximized : isMaximized;

  return (
    <MaximizeWrapper
      isMaximized={effectivelyMaximized}
      onToggleMaximize={handleToggleMaximize}
      title={title}
    >
      {children}
    </MaximizeWrapper>
  );
}

// Standalone maximize button component for use in UI headers
export function MaximizeButton({ 
  isMaximized, 
  onToggleMaximize, 
  className = "" 
}: { 
  isMaximized: boolean; 
  onToggleMaximize: () => void; 
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggleMaximize}
      className={className}
    >
      {isMaximized ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
    </Button>
  );
}

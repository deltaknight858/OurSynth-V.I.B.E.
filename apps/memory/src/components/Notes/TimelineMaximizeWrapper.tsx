
import { ReactNode, useState } from "react";
import { MaximizeWrapper } from "@/components/MindMap/MaximizeWrapper";

interface TimelineMaximizeWrapperProps {
  children: ReactNode;
  isPageMaximized?: boolean;
  onPageMaximizeChange?: () => void;
  title?: string;
}

export function TimelineMaximizeWrapper({
  children,
  isPageMaximized,
  onPageMaximizeChange,
  title = "Note History"
}: TimelineMaximizeWrapperProps) {
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

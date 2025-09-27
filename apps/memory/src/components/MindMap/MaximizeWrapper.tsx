import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface MaximizeWrapperProps {
  children: ReactNode;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  title?: string;
}

export function MaximizeWrapper({ children, isMaximized, onToggleMaximize, title }: MaximizeWrapperProps) {
  return (
    <>
      <AnimatePresence>
        {isMaximized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
      
      <motion.div
        layout
        className={`relative bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 
          rounded-lg border border-border/50 shadow-lg overflow-hidden
          transition-all duration-300 ease-in-out ${
          isMaximized 
            ? "fixed inset-4 z-50" 
            : "w-full h-[600px]"
        }`}
      >
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {title && isMaximized && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-medium mr-2"
            >
              {title}
            </motion.h2>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleMaximize}
              className="bg-background/50 backdrop-blur-sm hover:bg-background/80"
            >
              {isMaximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        </div>
        
        {children}
      </motion.div>
    </>
  );
}
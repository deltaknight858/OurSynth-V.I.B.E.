import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ProjectGenerator, GeneratedFile, ProjectConfig } from '@/services/ProjectGenerator';

interface StreamingContextState {
  files: GeneratedFile[];
  isGenerating: boolean;
  progress: number;
  error: string | null;
  startGeneration: (config: ProjectConfig) => Promise<void>;
  reset: () => void;
}

const StreamingContext = createContext<StreamingContextState | undefined>(undefined);

export const StreamingProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = useCallback(async (config: ProjectConfig) => {
    setIsGenerating(true);
    setFiles([]);
    setProgress(0);
    setError(null);

    try {
      const generator = new ProjectGenerator(config);
      
      let fileCount = 0;
      const totalFilesEstimate = 25; // Estimate based on typical project
      
      const onFileGenerated = (file: GeneratedFile) => {
        setFiles(prevFiles => [...prevFiles, file]);
        fileCount++;
        setProgress(Math.min((fileCount / totalFilesEstimate) * 100, 100));
      };

      await generator.generateProjectWithStreaming(onFileGenerated);
      setProgress(100);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFiles([]);
    setIsGenerating(false);
    setProgress(0);
    setError(null);
  }, []);

  const value = {
    files,
    isGenerating,
    progress,
    error,
    startGeneration,
    reset,
  };

  return (
    <StreamingContext.Provider value={value}>
      {children}
    </StreamingContext.Provider>
  );
};

export const useStreaming = () => {
  const context = useContext(StreamingContext);
  if (context === undefined) {
    throw new Error('useStreaming must be used within a StreamingProvider');
  }
  return context;
};

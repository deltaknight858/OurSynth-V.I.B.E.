import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStreaming } from '../contexts/StreamingContext';

interface GenerationProgressProps {
  className?: string;
}

export default function GenerationProgress({ className = '' }: GenerationProgressProps) {
  const { files, isGenerating, progress, error } = useStreaming();

  // Deduplicate files and filter out empty directories
  const uniqueFiles = useMemo(() => {
    const seen = new Set<string>();
    return files.filter((file) => {
      if (seen.has(file.path)) return false;
      seen.add(file.path);
      // Only show actual files with content, not empty directories
      return file.type === 'file' && file.content.length > 0;
    });
  }, [files]);

  if (!isGenerating && files.length === 0 && !error) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`glass p-6 rounded-xl ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold neon-text">
          {isGenerating ? 'Generating Project...' : error ? 'Generation Error' : 'Generation Complete'}
        </h3>
        {isGenerating && (
          <div className="text-sm text-white/70">
            {Math.min(Math.round(progress), 100)}%
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="w-full h-2 glass rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 glow"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 mb-4"
        >
          <p className="text-red-300 font-medium">Error during generation:</p>
          <p className="text-red-200 text-sm mt-1">{error}</p>
        </motion.div>
      )}

      {/* Files List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium neon-text">Generated Files</span>
          <span className="text-xs neon-accent">{uniqueFiles.length} files</span>
        </div>
        <AnimatePresence>
          {uniqueFiles.map((file, index) => (
            <motion.div
              key={`${file.path}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 py-2 px-3 glass-strong rounded-lg"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full glow"></div>
              <span className="text-white/80 text-sm font-mono truncate flex-1">{file.path}</span>
              <span className="text-xs text-white/50">
                {(file.content.length / 1024).toFixed(1)}kb
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-center text-white/60 text-sm"
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Generating files... Please wait</span>
          </div>
        </motion.div>
      )}

      {/* Completion Message */}
      {!isGenerating && uniqueFiles.length > 0 && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Generation completed successfully!</span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Generated {uniqueFiles.length} files
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

'use client';

import React from 'react';
import { useProjectContext } from '@/contexts/ProjectProvider';

// ========================================
// SAVE INDICATOR COMPONENT
// ========================================

interface SaveIndicatorProps {
  className?: string;
}

export default function SaveIndicator({ className = '' }: SaveIndicatorProps) {
  const { saveState, hasUnsavedChanges, forceSave } = useProjectContext();

  const getStatusIcon = () => {
    switch (saveState.status) {
      case 'saving':
        return (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        );
      case 'saved':
        return <span className="text-green-500">✓</span>;
      case 'error':
        return <span className="text-red-500">⚠</span>;
      default:
        return hasUnsavedChanges ? (
          <span className="text-yellow-500">●</span>
        ) : (
          <span className="text-gray-400">○</span>
        );
    }
  };

  const getStatusText = () => {
    switch (saveState.status) {
      case 'saving':
        return saveState.retryCount > 0 
          ? `Retrying... (${saveState.retryCount}/3)`
          : 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return saveState.error || 'Save failed';
      default:
        return hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved';
    }
  };

  const getStatusColor = () => {
    switch (saveState.status) {
      case 'saving':
        return 'text-blue-600';
      case 'saved':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return hasUnsavedChanges ? 'text-yellow-600' : 'text-gray-600';
    }
  };

  const handleRetry = () => {
    if (saveState.status === 'error') {
      forceSave();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Icon */}
      <div className="flex items-center justify-center w-4 h-4">
        {getStatusIcon()}
      </div>

      {/* Status Text */}
      <span className={`text-sm font-medium transition-colors ${getStatusColor()}`}>
        {getStatusText()}
      </span>

      {/* Last Saved Time */}
      {saveState.lastSaved && saveState.status !== 'saving' && (
        <span className="text-xs text-gray-500">
          {saveState.lastSaved.toLocaleTimeString()}
        </span>
      )}

      {/* Retry Button */}
      {saveState.status === 'error' && (
        <button
          onClick={handleRetry}
          className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      )}

      {/* Force Save Button */}
      {hasUnsavedChanges && saveState.status !== 'saving' && (
        <button
          onClick={forceSave}
          className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          title="Force save now"
        >
          Save Now
        </button>
      )}
    </div>
  );
}

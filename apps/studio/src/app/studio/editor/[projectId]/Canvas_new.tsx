// Visual Canvas with React DnD Drop Zone
// Scrollable, pannable canvas with absolute positioned nodes

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useProjectContext } from '@/contexts/ProjectProvider';
import type { Node } from '@/types/projects';

// Simple UUID generator to avoid external dependency
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

interface CanvasProps {
  onSelectNode?: (node: Node | null) => void;
}

export default function Canvas({ onSelectNode }: CanvasProps) {
  const { project, nodes, updateNode, addNode, setNodes } = useProjectContext();
  
  return (
    <div className="flex-1 bg-gray-100 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <h2 className="text-xl font-medium mb-2">Canvas Loading...</h2>
        <p>Visual canvas component is being rebuilt</p>
      </div>
    </div>
  );
}

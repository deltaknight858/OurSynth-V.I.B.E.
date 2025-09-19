// Studio Editor Component
// Example component that uses the ProjectProvider context

'use client';

import React from 'react';
import { useProjectContext, useCanvasOperations } from '@/contexts/ProjectProvider';

export default function StudioEditor() {
  const {
    project,
    nodes,
    loading,
    error,
    saveProject,
    addNode
  } = useProjectContext();

  const { moveNode, resizeNode } = useCanvasOperations();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-500 mb-2">Project Not Found</h1>
          <p className="text-gray-600">The requested project could not be found.</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    const success = await saveProject();
    if (success) {
      console.log('Project saved successfully!');
    } else {
      console.error('Failed to save project');
    }
  };

  const handleAddButton = async () => {
    await addNode({
      project_id: project.id,
      type: 'Button',
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: 120,
      height: 40,
      props: {
        text: 'New Button',
        variant: 'primary'
      },
      z_index: 0,
      locked: false,
      visible: true
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-gray-600">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddButton}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Button
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Save Project
            </button>
          </div>
        </div>
      </header>

      {/* Canvas Area */}
      <main className="flex-1 bg-gray-100 p-6 overflow-hidden">
        <div className="relative w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
          {/* Canvas Content */}
          <div className="relative w-full h-full min-w-[800px] min-h-[600px]">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="absolute border border-gray-300 bg-white rounded shadow-sm cursor-move"
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.width || 100,
                  height: node.height || 50,
                  zIndex: node.z_index
                }}
                onMouseDown={(e) => {
                  // Simple drag implementation
                  const startX = e.clientX - node.x;
                  const startY = e.clientY - node.y;

                  const handleMouseMove = (e: MouseEvent) => {
                    const newX = e.clientX - startX;
                    const newY = e.clientY - startY;
                    moveNode(node.id, newX, newY);
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-600">{node.type}</div>
                  {node.type === 'Button' && (
                    <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded">
                      {node.props.text || 'Button'}
                    </button>
                  )}
                  {node.type === 'Card' && (
                    <div className="border rounded p-2">
                      <h3 className="font-medium text-sm">{node.props.title || 'Card Title'}</h3>
                      <p className="text-xs text-gray-600">{node.props.content || 'Card content'}</p>
                    </div>
                  )}
                  {node.type === 'Input' && (
                    <input
                      type={node.props.type || 'text'}
                      placeholder={node.props.placeholder || 'Enter text...'}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  )}
                </div>
              </div>
            ))}
            
            {nodes.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p className="text-lg mb-2">Empty Canvas</p>
                  <p className="text-sm">Click &quot;Add Button&quot; to add your first component</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

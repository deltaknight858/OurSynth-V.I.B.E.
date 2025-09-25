'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useProjectContext } from '@/contexts/ProjectProvider';
import type { Node } from '@/types/projects';
import { calculateSnapPosition } from '@/lib/snap-utils';
import { 
  CanvasContainer, 
  AlignmentGuide, 
  ResizeHandle, 
  ComponentWrapper 
} from '@/components/CanvasComponents';
import { DroppableContainer } from '@/components/DroppableContainer';
import { baseComponents } from '@/components/base-components';
import { interactiveComponents } from '@/components/interactive-components';

// Simple UUID generator to avoid external dependency
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

interface CanvasProps {
  onSelectNode?: (node: Node | null) => void;
}

const renderComponent = (node: Node) => {
  const component = [...baseComponents, ...interactiveComponents].find(c => c.type === node.type);
  if (!component) return null;

  // Use the component's default props merged with node props
  const finalProps = {
    ...component.defaultProps,
    ...node.props,
    style: {
      ...component.defaultProps?.style,
      ...node.props?.style
    }
  };

  // Render component based on type
  switch (node.type) {
    case 'Text':
    case 'Heading':
    case 'Button':
      return (
        <div style={finalProps.style}>
          {(finalProps as { text?: string; style: React.CSSProperties }).text || 'Text content'}
        </div>
      );
    case 'Image':
      const imageProps = finalProps as { src?: string; alt?: string; style: React.CSSProperties };
      return (
        <img 
          src={imageProps.src || 'https://via.placeholder.com/300x200'} 
          alt={imageProps.alt || 'Image'} 
          style={imageProps.style} 
        />
      );
    case 'Container':
    case 'Card':
    case 'Grid':
      return <div style={finalProps.style}>{node.type}</div>;
    case 'DataTable':
      const tableProps = finalProps as { 
        style: React.CSSProperties;
        columns: Array<{ field: string; header: string }>;
        data: Array<Record<string, unknown>>;
      };
      return (
        <div style={tableProps.style}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {tableProps.columns?.map((col: { field: string; header: string }, i: number) => (
                  <th key={i} style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableProps.data?.map((row: Record<string, unknown>, i: number) => (
                <tr key={i}>
                  {tableProps.columns?.map((col: { field: string; header: string }, j: number) => (
                    <td key={j} style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {row[col.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return (
        <div style={finalProps.style}>
          {node.type}
        </div>
      );
  }
};

export default function Canvas({ onSelectNode }: CanvasProps) {
  const { project, nodes, updateNode, addNode, setNodes } = useProjectContext();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [guides, setGuides] = useState<{ vertical: number[], horizontal: number[] }>({
    vertical: [],
    horizontal: []
  });

  const handleNodeSelect = useCallback((node: Node) => {
    setSelectedNode(node);
    onSelectNode?.(node);
  }, [onSelectNode]);

  const renderNode = useCallback((node: Node) => {
    const childNodes = nodes.filter(n => n.parent_id === node.id);
    
    if (node.type === 'Container' || node.type === 'Card' || node.type === 'Grid') {
      return (
        <DroppableContainer
          key={node.id}
          node={node}
          onDrop={(item, x, y) => handleDropComponent(item.type, item.defaultProps, x, y, Number(node.id))}
        >
          {childNodes.map(renderNode)}
        </DroppableContainer>
      );
    }
    
    return (
      <ComponentWrapper
        key={node.id}
        $isSelected={selectedNode?.id === node.id}
        $isDragging={false}
        style={{
          ...node.props.style,
          position: 'absolute',
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: node.width ? `${node.width}px` : 'auto',
          height: node.height ? `${node.height}px` : 'auto',
          zIndex: node.z_index || 0
        }}
        onClick={() => handleNodeSelect(node)}
      >
        {renderComponent(node)}
      </ComponentWrapper>
    );
  }, [nodes, selectedNode]);

  // Handle dropping components from palette
  const handleDropComponent = useCallback(async (
    componentType: string,
    defaultProps: Record<string, unknown>,
    x: number,
    y: number,
    targetContainerId?: number
  ) => {
    const width = getDefaultWidth(componentType);
    const height = getDefaultHeight(componentType);
    
    // If dropping into a container, adjust coordinates to container's space
    let finalX = x;
    let finalY = y;
    let parentNode = null;
    
    if (targetContainerId) {
      parentNode = nodes.find(n => n.id === targetContainerId);
      if (parentNode) {
        // Adjust coordinates relative to container
        finalX = x - parentNode.x;
        finalY = y - parentNode.y;
      }
    }
    
    // Calculate snapped position
    const [snappedX, snappedY] = calculateSnapPosition(
      finalX,
      finalY,
      { x: finalX, y: finalY, width, height },
      targetContainerId ? nodes.filter(n => n.parent_id === targetContainerId) : nodes
    );
    
    console.log(`Adding ${componentType} component at position (${snappedX}, ${snappedY})`);
    
    const newNode: Partial<Node> = {
      id: Number(generateId()),
      project_id: project?.id || 1,
      type: componentType,
      x: snappedX,
      y: snappedY,
      width,
      height,
      props: {
        ...defaultProps,
        style: {
          ...defaultProps?.style,
          position: 'absolute',
          left: `${snappedX}px`,
          top: `${snappedY}px`,
        }
      },
      z_index: Math.max(...nodes.map(n => n.z_index || 0), 0) + 1,
      locked: false,
      visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating new node:', newNode);

    // Add to context immediately for instant feedback
    const updatedNodes = [...nodes, newNode as Node];
    setNodes(updatedNodes);
    
    console.log('Updated nodes count:', updatedNodes.length);

    // For development mode, skip database persistence
    console.log('Development mode: Component added to in-memory storage only');
    
    /* Database persistence disabled for development
    // Also persist to database
    try {
      await addNode({
        project_id: project?.id || 1,
        type: componentType,
        x: Math.round(Math.max(0, x)),
        y: Math.round(Math.max(0, y)),
        width: getDefaultWidth(componentType),
        height: getDefaultHeight(componentType),
        props: defaultProps,
        z_index: Math.max(...nodes.map(n => n.z_index || 0), 0) + 1,
        locked: false,
        visible: true
      });
      console.log('Component saved to database successfully');
    } catch (error) {
      console.log('Could not save to database (development mode):', error);
    }
    */
  }, [project?.id, nodes, setNodes, addNode]);

  // React DnD drop target
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'component',
    drop: (item: { type: string; defaultProps: Record<string, unknown> }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;

      // Get the canvas element to calculate relative position
      const canvasElement = document.querySelector('[data-canvas="true"]');
      const canvasRect = canvasElement?.getBoundingClientRect();
      
      if (!canvasRect) {
        console.warn('Canvas element not found, using fallback positioning');
        handleDropComponent(item.type, item.defaultProps || {}, 50, 50);
        return;
      }

      // Calculate position relative to canvas
      const x = Math.round(Math.max(0, offset.x - canvasRect.left - 10));
      const y = Math.round(Math.max(0, offset.y - canvasRect.top - 10));

      console.log('Dropped component:', item.type, 'at canvas position:', { x, y });
      handleDropComponent(item.type, item.defaultProps || {}, x, y);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  return (
    <div 
      ref={drop as React.LegacyRef<HTMLDivElement>}
      data-canvas="true"
      className={`flex-1 overflow-hidden relative ${
        isOver && canDrop ? 'bg-blue-50' : 'bg-gray-50'
      }`}
    >
      <div className="w-full h-full bg-white">
        {/* Drop indicator */}
        {isOver && canDrop && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50 bg-opacity-50 rounded-lg flex items-center justify-center text-blue-600 font-medium z-10">
            Drop component here
          </div>
        )}

        {/* Render existing nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute group border-2 ${selectedNode?.id === node.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'} rounded transition-all`}
            style={{
              left: node.x,
              top: node.y,
              width: node.width,
              height: node.height,
              zIndex: node.z_index || 0
            }}
            onClick={() => {
              setSelectedNode(node);
              onSelectNode?.(node);
            }}
          >
            <SimpleNodeRenderer node={node} />
            
            {/* Node info tooltip on hover */}
            <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {node.type} ({node.x}, {node.y})
            </div>
          </div>
        ))}

        {/* Debug info */}
        {nodes.length > 0 && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-xs p-2 rounded">
            {nodes.length} component{nodes.length !== 1 ? 's' : ''} on canvas
          </div>
        )}

        {/* Empty state */}
        {nodes.length === 0 && !isOver && (
          <div className="p-8 text-center text-gray-500">
            <div className="text-lg font-medium mb-2">Canvas</div>
            <div className="text-sm mb-4">Drag components here to build your interface</div>
            <button 
              onClick={() => handleDropComponent('Button', { text: 'Test Button' }, 100, 100)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Add Test Button
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple node renderer component
function SimpleNodeRenderer({ node }: { node: Node }) {
  switch (node.type) {
    case 'Button':
      return (
        <button className="w-full h-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">
          {node.props?.text || 'Click Me'}
        </button>
      );
    case 'Input':
      return (
        <div className="w-full h-full">
          {node.props?.label && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {node.props.label}
            </label>
          )}
          <input
            type="text"
            placeholder={node.props?.placeholder || 'Enter text here...'}
            className="w-full h-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            readOnly
          />
        </div>
      );
    case 'Text':
      return (
        <div className="w-full h-full flex items-center text-gray-800 font-medium">
          {node.props?.text || 'Your text content here'}
        </div>
      );
    case 'Container':
      return (
        <div 
          className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm"
          style={{
            backgroundColor: node.props?.background || '#f8fafc',
            padding: node.props?.padding || '16px',
            borderRadius: node.props?.borderRadius || '8px'
          }}
        >
          📦 Flex Container
        </div>
      );
    case 'Card':
      return (
        <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="font-semibold text-gray-800 mb-2">
            {node.props?.title || 'Card Title'}
          </div>
          <div className="text-gray-600 text-sm">
            {node.props?.content || 'Card description goes here...'}
          </div>
        </div>
      );
    case 'Image':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border border-blue-200 flex items-center justify-center text-blue-600 text-sm">
          🖼️ Image Display
        </div>
      );
    case 'Checkbox':
      return (
        <div className="w-full h-full flex items-center space-x-2">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-gray-300"
            defaultChecked={node.props?.checked || false}
            disabled
          />
          <span className="text-gray-700 text-sm">
            {node.props?.label || 'Check this option'}
          </span>
        </div>
      );
    case 'Link':
      return (
        <div className="w-full h-full flex items-center">
          <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm">
            {node.props?.text || 'Go to page'}
          </a>
        </div>
      );
    case 'Icon':
      return (
        <div 
          className="w-full h-full flex items-center justify-center text-2xl"
          style={{ color: node.props?.color || '#3b82f6' }}
        >
          ⭐
        </div>
      );
    case 'Menu':
      return (
        <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm p-2">
          <div className="flex space-x-4">
            {(node.props?.items || ['Home', 'About', 'Contact']).map((item: string, index: number) => (
              <span key={index} className="text-gray-700 text-sm hover:text-blue-600 cursor-pointer">
                {item}
              </span>
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-full bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm">
          {node.type}
        </div>
      );
  }
}

// Helper functions
function getDefaultWidth(componentType: string): number {
  switch (componentType) {
    case 'Button': return 120;
    case 'Input': return 200;
    case 'Text': return 150;
    case 'Card': return 250;
    case 'Image': return 200;
    case 'Container': return 300;
    case 'Checkbox': return 180;
    case 'Link': return 100;
    case 'Icon': return 40;
    case 'Menu': return 250;
    default: return 100;
  }
}

function getDefaultHeight(componentType: string): number {
  switch (componentType) {
    case 'Button': return 40;
    case 'Input': return 40;
    case 'Text': return 24;
    case 'Card': return 120;
    case 'Image': return 150;
    case 'Container': return 100;
    case 'Checkbox': return 30;
    case 'Link': return 24;
    case 'Icon': return 40;
    case 'Menu': return 50;
    default: return 50;
  }
}

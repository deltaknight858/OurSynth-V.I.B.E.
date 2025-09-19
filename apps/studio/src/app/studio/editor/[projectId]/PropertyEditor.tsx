// Property Editor
// Right sidebar for editing selected component properties

'use client';

import React, { useState, useEffect } from 'react';
import { useProjectContext } from '@/contexts/ProjectProvider';
import type { Node } from '@/types/projects';

interface PropertyEditorProps {
  selectedNode: Node | null;
}

export default function PropertyEditor({ selectedNode }: PropertyEditorProps) {
  const { updateNode } = useProjectContext();
  const [localProps, setLocalProps] = useState<Record<string, unknown>>({});

  // Update local props when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setLocalProps(selectedNode.props || {});
    } else {
      setLocalProps({});
    }
  }, [selectedNode]);

  const handlePropChange = (key: string, value: unknown) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);
    
    if (selectedNode) {
      updateNode(selectedNode.id!, { props: newProps });
    }
  };

  const handlePositionChange = (property: 'x' | 'y', value: number) => {
    if (selectedNode) {
      updateNode(selectedNode.id!, { [property]: value });
    }
  };

  const handleSizeChange = (property: 'width' | 'height', value: number) => {
    if (selectedNode) {
      updateNode(selectedNode.id!, { [property]: value });
    }
  };

  const handleVisibilityToggle = () => {
    if (selectedNode) {
      updateNode(selectedNode.id!, { visible: !selectedNode.visible });
    }
  };

  const handleLockToggle = () => {
    if (selectedNode) {
      updateNode(selectedNode.id!, { locked: !selectedNode.locked });
    }
  };

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-300 text-3xl mb-2">⚙️</div>
            <p className="text-gray-500">Select a component to edit properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        <p className="text-sm text-gray-500">{selectedNode.type} Component</p>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Layout Properties */}
        <PropertySection title="Layout">
          <div className="grid grid-cols-2 gap-3">
            <PropertyField
              label="X"
              type="number"
              value={selectedNode.x}
              onChange={(value) => handlePositionChange('x', Number(value))}
            />
            <PropertyField
              label="Y"
              type="number"
              value={selectedNode.y}
              onChange={(value) => handlePositionChange('y', Number(value))}
            />
            <PropertyField
              label="Width"
              type="number"
              value={selectedNode.width || 100}
              onChange={(value) => handleSizeChange('width', Number(value))}
            />
            <PropertyField
              label="Height"
              type="number"
              value={selectedNode.height || 50}
              onChange={(value) => handleSizeChange('height', Number(value))}
            />
          </div>
        </PropertySection>

        {/* Component-Specific Properties */}
        <PropertySection title="Component Properties">
          {renderComponentProperties(selectedNode.type, localProps, handlePropChange)}
        </PropertySection>

        {/* Style Properties */}
        <PropertySection title="Advanced">
          <div className="space-y-3">
            <PropertyField
              label="Z-Index"
              type="number"
              value={selectedNode.z_index || 0}
              onChange={(value) => updateNode(selectedNode.id!, { z_index: Number(value) })}
            />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Visible</label>
              <button
                onClick={handleVisibilityToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  selectedNode.visible !== false ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    selectedNode.visible !== false ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Locked</label>
              <button
                onClick={handleLockToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  selectedNode.locked ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    selectedNode.locked ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </PropertySection>
      </div>
    </div>
  );
}

// ========================================
// PROPERTY SECTION
// ========================================

interface PropertySectionProps {
  title: string;
  children: React.ReactNode;
}

function PropertySection({ title, children }: PropertySectionProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}

// ========================================
// PROPERTY FIELD
// ========================================

interface PropertyFieldProps {
  label: string;
  type: 'text' | 'number' | 'select' | 'color' | 'checkbox';
  value: unknown;
  onChange: (value: unknown) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

function PropertyField({ label, type, value, onChange, options, placeholder }: PropertyFieldProps) {
  if (type === 'select' && options) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="ml-2 text-sm text-gray-700">{label}</label>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

// ========================================
// COMPONENT-SPECIFIC PROPERTIES
// ========================================

function renderComponentProperties(
  componentType: string,
  props: Record<string, unknown>,
  onChange: (key: string, value: unknown) => void
) {
  switch (componentType) {
    case 'Button':
      return (
        <div className="space-y-3">
          <PropertyField
            label="Text"
            type="text"
            value={props.text}
            onChange={(value) => onChange('text', value)}
            placeholder="Button text"
          />
          <PropertyField
            label="Variant"
            type="select"
            value={props.variant}
            onChange={(value) => onChange('variant', value)}
            options={[
              { label: 'Primary', value: 'primary' },
              { label: 'Secondary', value: 'secondary' },
              { label: 'Outline', value: 'outline' },
              { label: 'Ghost', value: 'ghost' }
            ]}
          />
          <PropertyField
            label="Size"
            type="select"
            value={props.size}
            onChange={(value) => onChange('size', value)}
            options={[
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' }
            ]}
          />
        </div>
      );

    case 'Input':
      return (
        <div className="space-y-3">
          <PropertyField
            label="Label"
            type="text"
            value={props.label}
            onChange={(value) => onChange('label', value)}
            placeholder="Input label"
          />
          <PropertyField
            label="Placeholder"
            type="text"
            value={props.placeholder}
            onChange={(value) => onChange('placeholder', value)}
            placeholder="Placeholder text"
          />
          <PropertyField
            label="Type"
            type="select"
            value={props.type}
            onChange={(value) => onChange('type', value)}
            options={[
              { label: 'Text', value: 'text' },
              { label: 'Email', value: 'email' },
              { label: 'Password', value: 'password' },
              { label: 'Number', value: 'number' }
            ]}
          />
        </div>
      );

    case 'Text':
      return (
        <div className="space-y-3">
          <PropertyField
            label="Content"
            type="text"
            value={props.content}
            onChange={(value) => onChange('content', value)}
            placeholder="Text content"
          />
          <PropertyField
            label="Variant"
            type="select"
            value={props.variant}
            onChange={(value) => onChange('variant', value)}
            options={[
              { label: 'Body', value: 'body1' },
              { label: 'Heading 1', value: 'h1' },
              { label: 'Heading 2', value: 'h2' },
              { label: 'Caption', value: 'caption' }
            ]}
          />
        </div>
      );

    case 'Card':
      return (
        <div className="space-y-3">
          <PropertyField
            label="Title"
            type="text"
            value={props.title}
            onChange={(value) => onChange('title', value)}
            placeholder="Card title"
          />
          <PropertyField
            label="Content"
            type="text"
            value={props.content}
            onChange={(value) => onChange('content', value)}
            placeholder="Card description"
          />
        </div>
      );

    case 'Image':
      return (
        <div className="space-y-3">
          <PropertyField
            label="Source URL"
            type="text"
            value={props.src}
            onChange={(value) => onChange('src', value)}
            placeholder="Image URL"
          />
          <PropertyField
            label="Alt Text"
            type="text"
            value={props.alt}
            onChange={(value) => onChange('alt', value)}
            placeholder="Alternative text"
          />
        </div>
      );

    case 'Container':
      return (
        <div className="space-y-3">
          <PropertyField
            label="Padding"
            type="text"
            value={props.padding}
            onChange={(value) => onChange('padding', value)}
            placeholder="e.g., 16px"
          />
          <PropertyField
            label="Background"
            type="color"
            value={props.background}
            onChange={(value) => onChange('background', value)}
          />
        </div>
      );

    default:
      return (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No properties available</p>
        </div>
      );
  }
}

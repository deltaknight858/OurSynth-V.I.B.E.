'use client';

import React, { useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { FaBox, FaHeading, FaImage, FaFont, FaTable, FaChartBar, FaList, FaLink } from 'react-icons/fa';
import { MdViewModule, MdInput } from 'react-icons/md';

import { interactiveComponents } from './interactive-components';
import { animationPresets } from './animations';

export const baseComponents = [
  {
    id: 'container',
    type: 'Container',
    name: 'Container',
    icon: FaBox,
    color: '#4CAF50',
    category: 'Layout',
    description: 'A basic container for grouping elements',
    defaultProps: {
      style: {
        padding: '20px',
        minHeight: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)'
      }
    }
  },
  {
    id: 'card',
    type: 'Card',
    name: 'Card',
    icon: FaBox,
    color: '#9C27B0',
    category: 'Layout',
    description: 'A styled card component with shadow',
    defaultProps: {
      style: {
        padding: '24px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.1)'
      }
    }
  },
  {
    id: 'text',
    type: 'Text',
    name: 'Text',
    icon: FaFont,
    color: '#2196F3',
    category: 'Basic',
    description: 'Text content with customizable styling',
    defaultProps: {
      text: 'Text content',
      style: {
        fontSize: '16px',
        color: '#ffffff'
      }
    }
  },
  {
    id: 'heading',
    type: 'Heading',
    name: 'Heading',
    icon: FaHeading,
    color: '#9C27B0',
    category: 'Basic',
    description: 'Section headings (h1-h6)',
    defaultProps: {
      text: 'Heading',
      level: 'h2',
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#ffffff'
      }
    }
  },
  {
    id: 'image',
    type: 'Image',
    name: 'Image',
    icon: FaImage,
    color: '#FF9800',
    category: 'Media',
    description: 'Image component with alt text',
    defaultProps: {
      src: 'https://via.placeholder.com/300x200',
      alt: 'Placeholder image',
      style: {
        maxWidth: '100%',
        height: 'auto'
      }
    }
  },
  {
    id: 'button',
    type: 'Button',
    name: 'Button',
    icon: MdInput,
    color: '#E91E63',
    category: 'Interactive',
    description: 'Clickable button element',
    defaultProps: {
      text: 'Click me',
      style: {
        padding: '10px 20px',
        background: 'linear-gradient(45deg, #6366f1, #a855f7)',
        border: 'none',
        borderRadius: '4px',
        color: '#ffffff',
        cursor: 'pointer'
      }
    }
  },
  {
    id: 'grid',
    type: 'Grid',
    name: 'Grid',
    icon: MdViewModule,
    color: '#00BCD4',
    category: 'Layout',
    description: 'Grid layout container',
    defaultProps: {
      columns: 3,
      gap: 20,
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        padding: '20px'
      }
    }
  },
  {
    id: 'form',
    type: 'Form',
    name: 'Form',
    icon: FaList,
    color: '#FF9800',
    category: 'Forms',
    description: 'Form container with submit handling',
    defaultProps: {
      onSubmit: '() => console.log("Form submitted")',
      style: {
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px'
      }
    }
  },
  {
    id: 'input',
    type: 'Input',
    name: 'Input Field',
    icon: MdInput,
    color: '#2196F3',
    category: 'Forms',
    description: 'Text input field with label',
    defaultProps: {
      label: 'Label',
      placeholder: 'Enter text...',
      type: 'text',
      style: {
        width: '100%',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '4px',
        color: '#ffffff',
        fontSize: '14px'
      }
    }
  },
  {
    id: 'slider',
    type: 'Slider',
    name: 'Slider',
    icon: MdInput,
    color: '#E91E63',
    category: 'Interactive',
    description: 'Range slider with value display',
    defaultProps: {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
      style: {
        width: '100%',
        padding: '12px 0'
      }
    }
  },
  {
    id: 'toggle',
    type: 'Toggle',
    name: 'Toggle Switch',
    icon: MdInput,
    color: '#4CAF50',
    category: 'Interactive',
    description: 'Toggle switch for boolean values',
    defaultProps: {
      defaultChecked: false,
      label: 'Toggle me',
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }
  },
  {
    id: 'dropdown',
    type: 'Dropdown',
    name: 'Dropdown',
    icon: MdInput,
    color: '#9C27B0',
    category: 'Forms',
    description: 'Select dropdown with options',
    defaultProps: {
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],
      placeholder: 'Select an option',
      style: {
        width: '100%',
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '4px',
        color: '#ffffff'
      }
    }
  }
];

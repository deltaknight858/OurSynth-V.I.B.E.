'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { useProjectContext } from '@/contexts/ProjectProvider';
import type { Node } from '@/types/projects';

// ========================================
// TYPES
// ========================================

interface CodeViewProps {
  className?: string;
}

// ========================================
// CODE GENERATION UTILITIES
// ========================================

/**
 * Convert a Node to TSX component code
 */
function nodeToTSX(node: Node, indent: string = '  '): string {
  const { type, props = {}, x, y, width, height } = node;
  
  // Generate inline styles for positioning
  const style = {
    position: 'absolute' as const,
    left: `${x}px`,
    top: `${y}px`,
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined
  };

  // Convert props to JSX attributes
  const propsString = Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      } else if (typeof value === 'boolean') {
        return value ? key : '';
      } else if (typeof value === 'number') {
        return `${key}={${value}}`;
      } else if (Array.isArray(value)) {
        return `${key}={${JSON.stringify(value)}}`;
      } else if (typeof value === 'object') {
        return `${key}={${JSON.stringify(value)}}`;
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');

  // Generate style prop
  const styleString = `style={${JSON.stringify(style)}}`;

  // Generate the component JSX
  switch (type) {
    case 'Button':
      return `${indent}<button ${propsString} ${styleString}>\n${indent}  ${props.children || 'Button'}\n${indent}</button>`;
    
    case 'Input':
      return `${indent}<input ${propsString} ${styleString} />`;
    
    case 'Text':
      return `${indent}<p ${propsString} ${styleString}>\n${indent}  ${props.children || 'Text content'}\n${indent}</p>`;
    
    case 'Card':
      return `${indent}<div ${propsString} ${styleString} className="border rounded-lg p-4 shadow-sm">\n${indent}  <h3 className="font-semibold">${props.title || 'Card Title'}</h3>\n${indent}  <p className="text-gray-600">${props.content || 'Card content goes here'}</p>\n${indent}</div>`;
    
    case 'Image':
      return `${indent}<img ${propsString} ${styleString} alt="${props.alt || 'Image'}" />`;
    
    case 'Container':
      return `${indent}<div ${propsString} ${styleString} className="border-2 border-dashed border-gray-300 p-4">\n${indent}  {/* Container content */}\n${indent}</div>`;
    
    case 'Grid':
      const gridCols = props.columns || 3;
      return `${indent}<div ${propsString} ${styleString} className="grid grid-cols-${gridCols} gap-4">\n${indent}  {/* Grid items */}\n${indent}</div>`;
    
    case 'Stack':
      const direction = props.direction || 'vertical';
      const flexDirection = direction === 'horizontal' ? 'flex-row' : 'flex-col';
      return `${indent}<div ${propsString} ${styleString} className="flex ${flexDirection} gap-4">\n${indent}  {/* Stack items */}\n${indent}</div>`;
    
    case 'Badge':
      return `${indent}<span ${propsString} ${styleString} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">\n${indent}  ${props.children || 'Badge'}\n${indent}</span>`;
    
    case 'Slider':
      return `${indent}<input type="range" ${propsString} ${styleString} />`;
    
    case 'Checkbox':
      return `${indent}<label ${styleString} className="flex items-center gap-2">\n${indent}  <input type="checkbox" ${propsString} />\n${indent}  ${props.label || 'Checkbox'}\n${indent}</label>`;
    
    case 'Select':
      const options = props.options || ['Option 1', 'Option 2', 'Option 3'];
      const optionsJSX = options.map((option: string) => 
        `\n${indent}    <option value="${option}">${option}</option>`
      ).join('');
      return `${indent}<select ${propsString} ${styleString}>${optionsJSX}\n${indent}</select>`;
    
    case 'Menu':
      const menuItems = props.items || ['Home', 'About', 'Contact'];
      const menuJSX = menuItems.map((item: string) => 
        `\n${indent}    <a href="#" className="hover:text-blue-600">${item}</a>`
      ).join('');
      return `${indent}<nav ${propsString} ${styleString} className="flex gap-4">${menuJSX}\n${indent}</nav>`;
    
    case 'Breadcrumb':
      const breadcrumbItems = props.items || ['Home', 'Category', 'Current'];
      const breadcrumbJSX = breadcrumbItems.map((item: string, index: number) => {
        const isLast = index === breadcrumbItems.length - 1;
        return `\n${indent}    <span>${item}</span>${!isLast ? `\n${indent}    <span className="mx-2">/</span>` : ''}`;
      }).join('');
      return `${indent}<nav ${propsString} ${styleString} className="flex items-center text-sm">${breadcrumbJSX}\n${indent}</nav>`;
    
    case 'Tabs':
      const tabs = props.tabs || ['Tab 1', 'Tab 2', 'Tab 3'];
      const tabsJSX = tabs.map((tab: string, index: number) => 
        `\n${indent}    <button className="px-4 py-2 ${index === 0 ? 'border-b-2 border-blue-500' : 'text-gray-600'}">${tab}</button>`
      ).join('');
      return `${indent}<div ${propsString} ${styleString}>\n${indent}  <div className="flex border-b">${tabsJSX}\n${indent}  </div>\n${indent}  <div className="p-4">\n${indent}    {/* Tab content */}\n${indent}  </div>\n${indent}</div>`;
    
    default:
      return `${indent}<div ${propsString} ${styleString}>\n${indent}  {/* ${type} component */}\n${indent}</div>`;
  }
}

/**
 * Generate complete React component code from nodes
 */
function generateComponentCode(nodes: Node[], componentName: string = 'GeneratedComponent'): string {
  const imports = `'use client';

import React from 'react';

// ========================================
// GENERATED COMPONENT
// ========================================

interface ${componentName}Props {
  className?: string;
}

export default function ${componentName}({ className }: ${componentName}Props) {
  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
`;

  const componentsCode = nodes
    .filter(node => node.visible !== false)
    .sort((a, b) => (a.z_index || 0) - (b.z_index || 0))
    .map(node => nodeToTSX(node, '      '))
    .join('\n\n');

  const closing = `    </div>
  );
}`;

  return `${imports}${componentsCode ? `\n${componentsCode}\n` : '\n      {/* No components added yet */}\n'}${closing}`;
}

/**
 * Generate package.json for the component
 */
function generatePackageJson(componentName: string): string {
  return JSON.stringify({
    name: componentName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    version: "1.0.0",
    description: `Generated React component from OurSynth`,
    main: "index.js",
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint"
    },
    dependencies: {
      "next": "14.2.5",
      "react": "^18",
      "react-dom": "^18"
    },
    devDependencies: {
      "@types/node": "^20",
      "@types/react": "^18",
      "@types/react-dom": "^18",
      "eslint": "^8",
      "eslint-config-next": "14.2.5",
      "typescript": "^5"
    }
  }, null, 2);
}

/**
 * Generate Tailwind config
 */
function generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function CodeView({ className = '' }: CodeViewProps) {
  const { nodes, project } = useProjectContext();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [editorMounted, setEditorMounted] = useState(false);

  // Generate the component code
  const componentCode = useMemo(() => {
    const componentName = project?.name?.replace(/[^a-zA-Z0-9]/g, '') || 'GeneratedComponent';
    return generateComponentCode(nodes, componentName);
  }, [nodes, project?.name]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+C or Cmd+C to copy code
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && event.shiftKey) {
        event.preventDefault();
        handleCopy();
      }
      // Ctrl+S or Cmd+S to download
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleDownloadZip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [componentCode]);

  // Monaco editor configuration
  const handleEditorDidMount = (editor: any, monaco: any) => {
    setEditorMounted(true);
    
    // Define custom theme
    monaco.editor.defineTheme('oursynth-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'delimiter.bracket', foreground: 'FFD700' },
        { token: 'delimiter.parenthesis', foreground: 'FFD700' },
        { token: 'delimiter.square', foreground: 'FFD700' },
        { token: 'tag', foreground: '569CD6' },
        { token: 'attribute.name', foreground: '92C5F8' },
        { token: 'attribute.value', foreground: 'CE9178' }
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2d2d30',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6',
        'editorGutter.background': '#1e1e1e',
        'editorCursor.foreground': '#aeafad',
        'editor.selectionHighlightBackground': '#add6ff26'
      }
    });
    
    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Add React types (basic)
    const reactTypes = `
      declare module 'react' {
        export interface ComponentProps {
          className?: string;
          style?: React.CSSProperties;
          children?: React.ReactNode;
        }
        export function useState<T>(initial: T): [T, (value: T) => void];
        export function useEffect(effect: () => void, deps?: any[]): void;
        export function useMemo<T>(factory: () => T, deps: any[]): T;
        export namespace React {
          type ReactNode = any;
          type CSSProperties = any;
        }
      }
    `;
    
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactTypes,
      'file:///node_modules/@types/react/index.d.ts'
    );
    
    // Set the custom theme
    monaco.editor.setTheme('oursynth-dark');
  };

  // Copy to clipboard handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(componentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Download ZIP handler
  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      
      const componentName = project?.name?.replace(/[^a-zA-Z0-9]/g, '') || 'GeneratedComponent';
      
      // Create files content
      const files = {
        [`${componentName}.tsx`]: componentCode,
        'package.json': generatePackageJson(componentName),
        'tailwind.config.js': generateTailwindConfig(),
        'README.md': `# ${componentName}

Generated React component from OurSynth Studio.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`tsx
import ${componentName} from './${componentName}';

export default function App() {
  return (
    <div>
      <${componentName} />
    </div>
  );
}
\`\`\`

## Component Details

- **Total Components**: ${nodes.length}
- **Generated**: ${new Date().toLocaleDateString()}
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS

## File Structure

\`\`\`
${componentName}/
├── ${componentName}.tsx     # Main component
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
└── README.md               # This file
\`\`\`
`
      };

      // Create and download as text bundle
      const fileContents = Object.entries(files)
        .map(([filename, content]) => `${'='.repeat(60)}
FILE: ${filename}
${'='.repeat(60)}

${content}

`)
        .join('\n');

      const blob = new Blob([fileContents], { type: 'text/plain; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${componentName}-bundle.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download bundle:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`h-full flex flex-col bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-white">Generated Code</h2>
          <p className="text-sm text-gray-400">React TSX Component</p>
        </div>
        
        <div className="flex gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy code (Ctrl+Shift+C)"
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy Code'}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            title="Download bundle (Ctrl+S)"
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              downloading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {downloading ? '⏳ Generating...' : '📦 Download Bundle'}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={componentCode}
          theme="oursynth-dark"
          onMount={handleEditorDidMount}
          options={{
            readOnly: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            fontSize: 14,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            folding: true,
            bracketPairColorization: { enabled: true },
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            selectOnLineNumbers: true,
            lineNumbersMinChars: 3,
            glyphMargin: false,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'blink',
            renderLineHighlight: 'none',
            quickSuggestions: false,
            parameterHints: { enabled: false },
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: 'off',
            tabCompletion: 'off',
            wordBasedSuggestions: 'off'
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-gray-800 text-gray-300">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Loading Monaco Editor...</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>{nodes.length} components</span>
            <span>{componentCode.split('\n').length} lines</span>
            <span>{componentCode.length} chars</span>
            <span>{Math.ceil(componentCode.length / 1024)} KB</span>
          </div>
          <div className="flex items-center gap-3">
            <span>TypeScript • React • Tailwind</span>
            {editorMounted && (
              <span className="flex items-center gap-1 text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Monaco Editor
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

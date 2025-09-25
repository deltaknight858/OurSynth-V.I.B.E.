/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { StreamingProvider, useStreaming } from '../contexts/StreamingContext';
import GenerationProgress from './GenerationProgress';
import { FuturisticWizard } from './FuturisticWizard';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface StepProps {
  state: CodeGeneratorState;
  updateState: (updates: Partial<CodeGeneratorState>) => void;
  onNext: () => void;
  onPrev?: () => void;
}

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  description?: string;
}

interface CodeGeneratorState {
  // Step 1: Define
  projectType: 'component' | 'page' | 'feature' | 'fullapp' | 'taskflow';
  description: string;
  framework: 'react' | 'vue' | 'angular' | 'nextjs';
  
  // Step 2: Structure  
  structure: {
    layout: 'cards' | 'list' | 'tabs' | 'grid' | 'sidebar';
    organization: 'atomic' | 'feature' | 'domain';
    files: string[];
    dependencies: string[];
  };
  
  // Step 3: Configure
  features: {
    auth: boolean;
    charts: boolean;
    stateManagement: 'redux' | 'zustand' | 'context' | 'none';
    database: boolean;
    api: boolean;
    testing: boolean;
  };
  styling: 'tailwind' | 'styled' | 'css' | 'scss';
  typescript: boolean;
  
  // Step 4: Generate
  generatedCode: { [key: string]: string };
  isGenerating: boolean;
  generationProgress: number;
  
  // Step 5: Export
  exportFormat: 'zip' | 'github' | 'codesandbox' | 'copy';
}

const steps = [
  { id: 1, title: 'Define', description: 'What do you want to build?' },
  { id: 2, title: 'Structure', description: 'How should it be organized?' },
  { id: 3, title: 'Configure', description: 'Choose features & styling' },
  { id: 4, title: 'Generate', description: 'Watch the magic happen' },
  { id: 5, title: 'Export', description: 'Get your code' }
];

function UnifiedCodeGeneratorInternal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [state, setState] = useState<CodeGeneratorState>({
    projectType: 'component',
    description: '',
    framework: 'react',
    structure: {
      layout: 'cards',
      organization: 'atomic',
      files: [],
      dependencies: []
    },
    features: {
      auth: false,
      charts: false,
      stateManagement: 'none',
      database: false,
      api: false,
      testing: false
    },
    styling: 'tailwind',
    typescript: true,
    generatedCode: {},
    isGenerating: false,
    generationProgress: 0,
    exportFormat: 'copy'
  });

  const supabase = null; // createClientComponentClient();
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current step
  useEffect(() => {
    if (containerRef.current) {
      const stepElement = containerRef.current.querySelector(`[data-step="${currentStep}"]`);
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep]);

  // Save state to Supabase when it changes (temporarily disabled)
  useEffect(() => {
    const saveState = async () => {
      try {
        // Supabase integration will be added here
        console.log('State updated:', state);
      } catch (error) {
        console.log('Could not save to Supabase:', error);
      }
    };
    
    const timeoutId = setTimeout(saveState, 1000); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [state]);

  const updateState = (updates: Partial<CodeGeneratorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Validation function for wizard
  const isStepValid = (step: number) => {
    switch (step) {
      case 0: // Define step
        return state.projectType && state.description.length > 10;
      case 1: // Structure step
        return state.structure.layout && state.structure.organization;
      case 2: // Configure step
        return state.styling && state.features.stateManagement;
      case 3: // Generate step
        return state.generatedCode && Object.keys(state.generatedCode).length > 0;
      case 4: // Export step
        return true;
      default:
        return false;
    }
  };

  // Prepare steps for the wizard
  const wizardSteps = [
    {
      title: 'Define',
      content: (
        <DefineStep 
          state={state} 
          updateState={updateState} 
          onNext={nextStep}
        />
      )
    },
    {
      title: 'Structure',
      content: (
        <StructureStep 
          state={state} 
          updateState={updateState} 
          onNext={nextStep}
          onPrev={prevStep}
        />
      )
    },
    {
      title: 'Configure',
      content: (
        <ConfigureStep 
          state={state} 
          updateState={updateState} 
          onNext={nextStep}
          onPrev={prevStep}
        />
      )
    },
    {
      title: 'Generate',
      content: (
        <GenerateStep 
          state={state} 
          updateState={updateState} 
          onNext={nextStep}
          onPrev={prevStep}
        />
      )
    },
    {
      title: 'Export',
      content: (
        <ExportStep 
          state={state} 
          updateState={updateState} 
          onPrev={prevStep}
        />
      )
    }
  ];

  return (
    <FuturisticWizard 
      steps={wizardSteps}
      initialStep={currentStep - 1}
      onStepChange={(step) => setCurrentStep(step + 1)}
      isStepValid={isStepValid}
    />
  );
}

// Individual Step Components
function DefineStep({ state, updateState, onNext }: StepProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  
  // Simplified to 5 clear project types
  const projectTypes = [
    { id: 'component', title: 'Component', desc: 'Reusable UI component', icon: '🧩' },
    { id: 'page', title: 'Page', desc: 'Complete web page', icon: '📄' },
    { id: 'feature', title: 'Feature', desc: 'App feature with multiple components', icon: '⚡' },
    { id: 'taskflow', title: 'TaskFlow', desc: 'Task management capsule with agents', icon: '✅' },
    { id: 'fullapp', title: 'Full App', desc: 'Complete application', icon: '🚀' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">What do you want to build?</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Choose your project type to get started with AI-powered code generation
        </p>
      </div>

      {/* Main Project Types - Updated to 5 clear choices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">{projectTypes.map(type => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateState({ projectType: type.id as CodeGeneratorState['projectType'] })}
            className={`
              bg-slate-800 bg-opacity-50 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl
              p-6 cursor-pointer text-center transition-all duration-300
              hover:bg-slate-700 hover:bg-opacity-50 hover:border-slate-600 hover:shadow-lg
              ${state.projectType === type.id ? 'bg-cyan-900 bg-opacity-30 border-cyan-400 shadow-lg' : ''}
            `}
          >
            <div className="text-4xl mb-3">{type.icon}</div>
            <h3 className="font-bold text-lg text-white mb-2">{type.title}</h3>
            <p className="text-slate-300 text-sm">{type.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Advanced Options Expander */}
      <div className="text-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
        >
          {showAdvanced ? '▼ Hide Advanced Options' : '▶ Advanced Options...'}
        </button>
      </div>

      {/* AI Prompt Section */}
      <div className="bg-slate-800 bg-opacity-50 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Describe Your Project</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">AI Ready</span>
            </div>
          </div>
          
          {/* Quick Suggestion Tags */}
          <div className="flex gap-2 flex-wrap">
            {[
              "Dashboard with charts",
              "E-commerce store", 
              "Social media feed",
              "Task management"
            ].map((suggestion, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                onClick={() => updateState({ description: suggestion })}
                className="text-xs px-3 py-1 bg-cyan-900 bg-opacity-30 border border-cyan-400 border-opacity-50 rounded-full text-cyan-300 hover:bg-cyan-800 hover:bg-opacity-40 transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>

          <textarea
            value={state.description}
            onChange={(e) => updateState({ description: e.target.value })}
            placeholder="Describe your project in detail... The more specific you are, the better I can help you build it! ✨"
            className="w-full p-4 bg-slate-900 bg-opacity-50 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:border-cyan-400 focus:border-opacity-50 transition-colors"
            rows={4}
          />
          
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>{state.description.length}/500 characters</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI analyzing...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Placeholder components for other steps
function StructureStep({ state, updateState, onNext, onPrev }: StepProps) {
  const layouts = [
    { id: 'cards', title: 'Card Layout', desc: 'Grid of cards with content blocks', icon: '🗃️' },
    { id: 'list', title: 'List Layout', desc: 'Vertical list with items', icon: '📋' },
    { id: 'tabs', title: 'Tabbed Layout', desc: 'Content organized in tabs', icon: '📑' },
    { id: 'grid', title: 'Data Grid', desc: 'Table-like data presentation', icon: '🗂️' },
    { id: 'sidebar', title: 'Sidebar Layout', desc: 'Main content with sidebar', icon: '📐' }
  ];

  const organizations = [
    { id: 'atomic', title: 'Atomic Design', desc: 'Components, molecules, organisms', icon: '⚛️' },
    { id: 'feature', title: 'Feature-based', desc: 'Organized by features/pages', icon: '🎯' },
    { id: 'domain', title: 'Domain-driven', desc: 'Business logic separation', icon: '🏗️' }
  ];

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Project Structure</h2>
        <p className="section-subtitle">Choose how your {state.projectType} should be laid out and organized.</p>
      </div>
      
      {/* Layout Selection */}
      <div className="mb-12">
        <h3 className="subsection-title">Layout Style</h3>
        <div className="choice-grid">
          {layouts.map(layout => (
            <motion.div
              key={layout.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateState({ 
                structure: { 
                  ...state.structure, 
                  layout: layout.id as CodeGeneratorState['structure']['layout'] 
                } 
              })}
              className={`
                layout-card cursor-pointer text-center
                ${state.structure.layout === layout.id ? 'selected' : ''}
              `}
            >
              <div className="icon text-4xl mb-3">{layout.icon}</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">
                {layout.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">{layout.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Organization Selection */}
      <div className="mb-12">
        <h3 className="subsection-title">Code Organization</h3>
        <div className="choice-grid">
          {organizations.map(org => (
            <motion.div
              key={org.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateState({ 
                structure: { 
                  ...state.structure, 
                  organization: org.id as CodeGeneratorState['structure']['organization'] 
                } 
              })}
              className={`
                choice-card cursor-pointer text-center
                ${state.structure.organization === org.id ? 'selected' : ''}
              `}
            >
              <div className="icon text-4xl mb-3">{org.icon}</div>
              <h4 className="font-bold text-lg mb-2 text-gray-900">
                {org.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">{org.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4">
        <motion.button 
          onClick={onPrev} 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all"
        >
          ← Back
        </motion.button>
        <motion.button 
          onClick={onNext} 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-white border-2 border-cyan-400 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition-all shadow-lg shadow-cyan-400/20"
        >
          Continue →
        </motion.button>
      </div>
    </div>
  );
}

function ConfigureStep({ state, updateState, onNext, onPrev }: StepProps) {
  const ToggleSwitch = ({ label, checked, onChange, description }: ToggleSwitchProps) => (
    <div className="toggle-container">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <h4 className="font-bold text-gray-900 text-lg mb-2">{label}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
        <motion.button
          onClick={() => onChange(!checked)}
          className={`toggle-switch ${checked ? 'active' : 'inactive'}`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="toggle-knob"
            animate={{ x: checked ? 28 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.button>
      </div>
    </div>
  );

  const Dropdown = ({ label, value, options, onChange, description }: DropdownProps) => {
    const dropdownId = `dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <div className="dropdown-container">
        <label htmlFor={dropdownId} className="block font-bold text-gray-900 text-lg mb-2">{label}</label>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
        <select
          id={dropdownId}
          name={dropdownId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="enhanced-select"
        >
          {options.map((option: DropdownOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Configure Features</h2>
        <p className="section-subtitle">Choose the features and tools for your {state.projectType}.</p>
      </div>
      
      {/* Feature Toggles */}
      <div className="mb-12">
        <h3 className="subsection-title">Features</h3>
        <div className="feature-grid">
          <ToggleSwitch
            label="Authentication"
            description="User login and registration"
            checked={state.features.auth}
            onChange={(checked: boolean) => updateState({ 
              features: { ...state.features, auth: checked } 
            })}
          />
          <ToggleSwitch
            label="Charts & Analytics"
            description="Data visualization components"
            checked={state.features.charts}
            onChange={(checked: boolean) => updateState({ 
              features: { ...state.features, charts: checked } 
            })}
          />
          <ToggleSwitch
            label="Database Integration"
            description="Backend data persistence"
            checked={state.features.database}
            onChange={(checked: boolean) => updateState({ 
              features: { ...state.features, database: checked } 
            })}
          />
          <ToggleSwitch
            label="API Routes"
            description="Backend API endpoints"
            checked={state.features.api}
            onChange={(checked: boolean) => updateState({ 
              features: { ...state.features, api: checked } 
            })}
          />
          <ToggleSwitch
            label="Testing Suite"
            description="Unit and integration tests"
            checked={state.features.testing}
            onChange={(checked: boolean) => updateState({ 
              features: { ...state.features, testing: checked } 
            })}
          />
        </div>
      </div>

      {/* Configuration Dropdowns */}
      <div className="mb-12">
        <h3 className="subsection-title">Configuration</h3>
        <div className="config-grid">
          <Dropdown
            label="State Management"
            description="How to manage application state"
            value={state.features.stateManagement}
            options={[
              { value: 'none', label: 'React State Only' },
              { value: 'context', label: 'React Context' },
              { value: 'zustand', label: 'Zustand' },
              { value: 'redux', label: 'Redux Toolkit' }
            ]}
            onChange={(value: string) => updateState({ 
              features: { ...state.features, stateManagement: value as CodeGeneratorState['features']['stateManagement'] } 
            })}
          />
          <Dropdown
            label="Styling Solution"
            description="CSS framework and styling approach"
            value={state.styling}
            options={[
              { value: 'tailwind', label: 'Tailwind CSS' },
              { value: 'styled', label: 'Styled Components' },
              { value: 'css', label: 'CSS Modules' },
              { value: 'scss', label: 'SCSS/SASS' }
            ]}
            onChange={(value: string) => updateState({ styling: value as CodeGeneratorState['styling'] })}
          />
        </div>
      </div>

      {/* TypeScript Toggle */}
      <div className="mb-12">
        <h3 className="subsection-title">Language</h3>
        <div className="max-w-md">
          <ToggleSwitch
            label="TypeScript"
            description="Use TypeScript for type safety"
            checked={state.typescript}
            onChange={(checked: boolean) => updateState({ typescript: checked })}
          />
        </div>
      </div>
      
      <div className="flex space-x-4">
        <motion.button 
          onClick={onPrev} 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-all"
        >
          ← Back
        </motion.button>
        <motion.button 
          onClick={onNext} 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-white border-2 border-cyan-400 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition-all shadow-lg shadow-cyan-400/20"
        >
          Generate Code →
        </motion.button>
      </div>
    </div>
  );
}

function GenerateStep({ state, updateState, onNext, onPrev }: StepProps) {
  const { startGeneration, isGenerating, files, error, reset } = useStreaming();
  const [hasStarted, setHasStarted] = useState(false);

  const generateCode = useCallback(async () => {
    setHasStarted(true);
    
    // Convert state to ProjectConfig format
    const projectConfig = {
      projectName: state.description.split(' ').slice(0, 3).join('-').toLowerCase() || 'my-project',
      description: state.description,
      deployment: 'vercel',
      environment: 'development',
      features: [
        ...(state.features.auth ? ['authentication'] : []),
        ...(state.features.database ? ['database'] : []),
        ...(state.features.api ? ['api'] : []),
        ...(state.features.charts ? ['charts'] : []),
        ...(state.features.testing ? ['testing'] : []),
        state.styling,
        state.framework
      ],
      template: {
        id: state.projectType,
        name: state.projectType.charAt(0).toUpperCase() + state.projectType.slice(1),
        description: state.description
      }
    };

    try {
      await startGeneration(projectConfig);
      // Auto advance after generation is complete
      setTimeout(() => {
        if (!isGenerating && files.length > 0) {
          onNext();
        }
      }, 2000);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  }, [state, startGeneration, isGenerating, files.length, onNext]);

  useEffect(() => {
    if (!hasStarted && !isGenerating && files.length === 0 && !error) {
      generateCode();
    }
  }, [hasStarted, isGenerating, files.length, error, generateCode]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Generating Your Code</h2>
      <p className="text-gray-600 mb-8">AI is creating your {state.projectType} with the selected features...</p>
      
      {/* Generation Progress Component */}
      <GenerationProgress className="mb-8" />
      
      {/* Reset/Retry Options */}
      {error && (
        <div className="flex justify-center space-x-4">
          <motion.button
            onClick={() => {
              reset();
              setHasStarted(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-400 hover:shadow-cyan-400/20 hover:shadow-lg transition-all rounded-xl"
          >
            Try Again
          </motion.button>
          <motion.button
            onClick={onPrev}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-400 hover:shadow-cyan-400/20 hover:shadow-lg transition-all rounded-xl"
          >
            ← Back to Configure
          </motion.button>
        </div>
      )}

      {/* Continue to Export when generation is complete */}
      {!isGenerating && files.length > 0 && !error && (
        <div className="flex justify-between">
          <motion.button
            onClick={onPrev}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-400 hover:shadow-cyan-400/20 hover:shadow-lg transition-all rounded-xl"
          >
            ← Back to Configure
          </motion.button>
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-pink-400 text-white font-semibold border-2 border-transparent hover:shadow-cyan-400/20 hover:shadow-lg transition-all rounded-xl"
          >
            Continue to Export →
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

function ExportStep({ state, updateState, onPrev }: Omit<StepProps, 'onNext'>) {
  const { files } = useStreaming();

  // Deduplicate files and filter out empty directories  
  const uniqueFiles = useMemo(() => {
    const seen = new Set<string>();
    return files.filter((file) => {
      if (seen.has(file.path)) return false;
      seen.add(file.path);
      return file.type === 'file' && file.content.length > 0;
    });
  }, [files]);

  const downloadAsZip = useCallback(async () => {
    if (uniqueFiles.length === 0) {
      alert('No files to download. Please generate the code first.');
      return;
    }

    try {
      // Create a simple zip-like structure by combining all files
      const fileContents = uniqueFiles.map(file => 
        `// File: ${file.path}\n${file.content}\n\n${'='.repeat(80)}\n\n`
      ).join('');

      const blob = new Blob([fileContents], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.projectName || 'generated-project'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download files. Please try again.');
    }
  }, [uniqueFiles, state.projectName]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Export Your Code</h2>
      <p className="text-gray-600 mb-8">
        {uniqueFiles.length > 0 
          ? `Ready to download ${uniqueFiles.length} generated files`
          : 'Generate code first to enable download'
        }
      </p>
      
      {uniqueFiles.length > 0 && (
        <div className="mb-6 bg-gray-50 border-2 border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Generated Files:</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {uniqueFiles.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm bg-white border border-gray-200 p-2 rounded">
                <span className="text-green-500">📄</span>
                <span className="text-gray-700">{file.path}</span>
                <span className="text-gray-500 ml-auto">
                  {(file.content.length / 1024).toFixed(1)}kb
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex space-x-4">
        <button 
          onClick={onPrev} 
          className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-400 hover:shadow-cyan-400/20 hover:shadow-lg transition-all rounded-xl"
        >
          ← Back
        </button>
        <button 
          onClick={downloadAsZip}
          disabled={uniqueFiles.length === 0}
          className={`flex-1 py-3 border-2 rounded-xl transition-all ${
            uniqueFiles.length > 0 
              ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-white border-transparent hover:shadow-cyan-400/20 hover:shadow-lg font-semibold' 
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
        >
          {uniqueFiles.length > 0 ? '⬇️ Download Code' : 'No Files to Download'}
        </button>
      </div>
    </motion.div>
  );
}

function LivePreview({ state, currentStep }: { state: CodeGeneratorState; currentStep: number }) {
  const getPreviewContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {state.projectType === 'component' && '🧩'}
                {state.projectType === 'page' && '📄'}
                {state.projectType === 'feature' && '⚡'}
                {state.projectType === 'taskflow' && '✅'}
                {state.projectType === 'fullapp' && '🚀'}
              </div>
              <h4 className="text-gray-900 font-bold capitalize">{state.projectType}</h4>
              <p className="text-gray-600 text-sm mt-1">{state.framework}</p>
            </div>
            {state.description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 border-2 border-gray-200 p-3 rounded-lg"
              >
                <p className="text-gray-700 text-sm">{state.description}</p>
              </motion.div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-gray-900 font-bold">Structure Preview</h4>
            </div>
            <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg">
              <div className="text-sm space-y-2">
                <div className="flex items-center text-gray-900">
                  <span className="text-blue-500 mr-2">📁</span>
                  <span>src/</span>
                </div>
                <div className="ml-4 space-y-1">
                  <div className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">📁</span>
                    <span>{state.structure.organization}/</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-yellow-500 mr-2">📄</span>
                    <span>layout.{state.structure.layout}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`h-20 bg-gray-100 border-2 border-gray-200 rounded-lg p-2 ${
              state.structure.layout === 'cards' ? 'grid grid-cols-3 gap-1' :
              state.structure.layout === 'list' ? 'space-y-1' :
              state.structure.layout === 'tabs' ? 'border-b-4 border-cyan-400' :
              'grid grid-cols-2 gap-1'
            }`}>
              {state.structure.layout === 'cards' && (
                <>
                  <div className="bg-white border-2 border-cyan-200 rounded h-full"></div>
                  <div className="bg-white border-2 border-cyan-200 rounded h-full"></div>
                  <div className="bg-white border-2 border-cyan-200 rounded h-full"></div>
                </>
              )}
              {state.structure.layout === 'list' && (
                <div className="space-y-1">
                  <div className="bg-white border border-gray-300 rounded p-1"></div>
                  <div className="bg-white border border-gray-300 rounded p-1"></div>
                  <div className="bg-white border border-gray-300 rounded p-1"></div>
                </div>
              )}
              {state.structure.layout === 'tabs' && (
                <div className="bg-white rounded-lg h-16 border-2 border-gray-200"></div>
              )}
              {state.structure.layout === 'grid' && (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white border border-cyan-200 rounded"></div>
                ))
              )}
              {state.structure.layout === 'dashboard' && (
                <>
                  <div className="bg-white border-2 border-cyan-200 rounded h-full"></div>
                  <div className="bg-white border-2 border-pink-200 rounded h-full"></div>
                </>
              )}
            </div>
          </div>
        );
      
      case 3:
        const enabledFeatures = Object.entries(state.features).filter(([, enabled]) => enabled);
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-gray-900 font-bold">Features Enabled</h4>
            </div>
            <div className="space-y-2">
              {enabledFeatures.map(([feature]) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center bg-white border-2 border-gray-200 p-2 rounded-lg"
                >
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700 capitalize text-sm">
                    {feature === 'stateManagement' ? `State: ${state.features.stateManagement}` : feature}
                  </span>
                </motion.div>
              ))}
              <div className="flex items-center bg-white border-2 border-gray-200 p-2 rounded-lg">
                <span className="text-cyan-500 mr-2">🎨</span>
                <span className="text-gray-700 text-sm capitalize">{state.styling}</span>
              </div>
              {state.typescript && (
                <div className="flex items-center bg-white border-2 border-gray-200 p-2 rounded-lg">
                  <span className="text-blue-500 mr-2">TS</span>
                  <span className="text-gray-700 text-sm">TypeScript</span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-gray-900 font-bold">Generating...</h4>
            </div>
            <div className="bg-white border-2 border-cyan-200 p-4 rounded-lg">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl mb-2"
                >
                  ⚡
                </motion.div>
                <p className="text-gray-600 text-sm">{state.generationProgress || 0}% Complete</p>
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${state.generationProgress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h4 className="text-gray-900 font-bold">Ready to Export!</h4>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-pink-50 border-2 border-cyan-200 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-gray-700 text-sm">Your code is ready for download</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center text-gray-500">
            Preview will appear here...
          </div>
        );
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Live Preview</h3>
        <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full mx-auto"></div>
      </div>
      
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[320px]"
      >
        {getPreviewContent()}
      </motion.div>
      
      <div className="mt-4 bg-gray-50 border border-gray-200 p-3 rounded-lg">
        <div className="text-xs text-gray-600 text-center mb-2">
          Step {currentStep} of 5
        </div>
        <div className="bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-pink-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Main wrapper component with StreamingProvider
export default function UnifiedCodeGenerator() {
  return (
    <StreamingProvider>
      <UnifiedCodeGeneratorInternal />
    </StreamingProvider>
  );
}

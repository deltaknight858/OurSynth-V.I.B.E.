'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  thumbnail: string;
}

export interface WizardConfig {
  projectName: string;
  description: string;
  features: string[];
  deployment: string;
  environment: string;
}

export interface WizardState {
  currentStep: number;
  selectedTemplate: Template | null;
  config: WizardConfig;
  isComplete: boolean;
}

type WizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SELECT_TEMPLATE'; payload: Template }
  | { type: 'UPDATE_CONFIG'; payload: Partial<WizardConfig> }
  | { type: 'COMPLETE_WIZARD' }
  | { type: 'RESET_WIZARD' };

// Initial state
const initialState: WizardState = {
  currentStep: 1,
  selectedTemplate: null,
  config: {
    projectName: '',
    description: '',
    features: [],
    deployment: '',
    environment: 'development',
  },
  isComplete: false,
};

// Reducer
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SELECT_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    case 'UPDATE_CONFIG':
      return { 
        ...state, 
        config: { ...state.config, ...action.payload } 
      };
    case 'COMPLETE_WIZARD':
      return { ...state, isComplete: true };
    case 'RESET_WIZARD':
      return initialState;
    default:
      return state;
  }
}

// Context
interface WizardContextType {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  selectTemplate: (template: Template) => void;
  updateConfig: (config: Partial<WizardConfig>) => void;
  completeWizard: () => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

// Provider
export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const nextStep = () => {
    if (state.currentStep < 4) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };

  const selectTemplate = (template: Template) => {
    dispatch({ type: 'SELECT_TEMPLATE', payload: template });
  };

  const updateConfig = (config: Partial<WizardConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  };

  const completeWizard = () => {
    dispatch({ type: 'COMPLETE_WIZARD' });
  };

  const resetWizard = () => {
    dispatch({ type: 'RESET_WIZARD' });
  };

  return (
    <WizardContext.Provider
      value={{
        state,
        dispatch,
        nextStep,
        prevStep,
        goToStep,
        selectTemplate,
        updateConfig,
        completeWizard,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

// Hook
export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

/**
 * Test utilities for Jest testing environment
 * Based on Material-UI testing patterns
 */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a default theme for testing
const defaultTheme = createTheme();

// Custom render function with theme provider
export const createRenderer = () => {
  return {
    render: (ui: React.ReactElement, options?: RenderOptions) => {
      const Wrapper = ({ children }: { children: React.ReactNode }) => 
        React.createElement(ThemeProvider, { theme: defaultTheme }, children);
      
      return render(ui, { wrapper: Wrapper, ...options });
    }
  };
};

// Basic conformance testing utility
export const describeConformance = (
  element: React.ReactElement,
  getOptions: () => {
    classes?: Record<string, string>;
    inheritComponent?: React.ComponentType<any>;
    muiName?: string;
    refInstanceof?: any;
    skip?: string[];
    testDeepOverrides?: boolean;
    testRootOverrides?: boolean;
    testStateOverrides?: boolean;
    testVariantProps?: Record<string, any>;
    testComponentPropWith?: string;
  }
) => {
  describe('Material-UI component API', () => {
    it('should render without crashing', () => {
      const { render } = createRenderer();
      expect(() => render(element)).not.toThrow();
    });
  });
};

// Re-export commonly used testing utilities
export { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

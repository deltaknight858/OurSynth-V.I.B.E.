/**
 * Brand Pulse Agent
 * Purpose: Scan UI code + assets for palette / logo drift
 * Outputs: Violations + suggested replacements
 */

import type { AgentEvent } from './types.js';

export interface BrandViolation {
  id: string;
  type: 'color' | 'typography' | 'spacing' | 'logo' | 'icon';
  severity: 'error' | 'warning' | 'info';
  file: string;
  line?: number;
  column?: number;
  currentValue: string;
  expectedValue: string;
  message: string;
  suggestion?: string;
}

export interface BrandConsistencyInput {
  scanPaths: string[];
  brandConfig?: {
    colors?: Record<string, string>;
    typography?: Record<string, string>;
    spacing?: Record<string, string>;
  };
  ignorePatterns?: string[];
  strictMode?: boolean;
}

export interface BrandConsistencyOutput {
  violations: BrandViolation[];
  summary: {
    totalViolations: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    complianceScore: number; // 0-100
  };
  recommendations: string[];
  fixCommands?: string[];
}

export class BrandPulseAgent {
  private onEvent?: (event: AgentEvent) => void;
  private brandTokens = {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    }
  };

  constructor(onEvent?: (event: AgentEvent) => void) {
    this.onEvent = onEvent;
  }

  private emit(type: AgentEvent['type'], payload?: unknown) {
    this.onEvent?.({ type, payload, timestamp: Date.now() });
  }

  async execute(input: BrandConsistencyInput): Promise<BrandConsistencyOutput> {
    this.emit('start', { agent: 'brandPulse', input });

    try {
      this.emit('progress', { message: 'Scanning for brand consistency violations...' });

      // Mock violations - in real implementation, would scan files
      const violations: BrandViolation[] = [
        {
          id: 'color-hardcode-1',
          type: 'color',
          severity: 'error',
          file: 'components/system/HaloButton.tsx',
          line: 15,
          column: 12,
          currentValue: '#0066cc',
          expectedValue: 'var(--color-primary)',
          message: 'Hardcoded color value detected',
          suggestion: 'Use design token var(--color-primary) instead'
        },
        {
          id: 'typography-inline-1',
          type: 'typography',
          severity: 'warning',
          file: 'components/chat/AgentChatPanel.tsx',
          line: 28,
          column: 8,
          currentValue: 'font-size: 14px',
          expectedValue: 'font-size: var(--text-sm)',
          message: 'Inline font size detected',
          suggestion: 'Use typography token for consistency'
        },
        {
          id: 'spacing-hardcode-1',
          type: 'spacing',
          severity: 'warning',
          file: 'components/command-center/CommandCenterShell.tsx',
          line: 42,
          column: 20,
          currentValue: 'padding: 16px',
          expectedValue: 'padding: var(--space-md)',
          message: 'Hardcoded spacing value detected',
          suggestion: 'Use spacing token for responsive design'
        },
        {
          id: 'logo-outdated-1',
          type: 'logo',
          severity: 'info',
          file: 'assets/brand/logo-old.svg',
          currentValue: 'logo-old.svg',
          expectedValue: 'logo-2024.svg',
          message: 'Outdated logo version detected',
          suggestion: 'Update to latest brand guidelines'
        }
      ];

      this.emit('progress', { message: 'Analyzing brand compliance...' });

      const summary = this.generateSummary(violations);
      const recommendations = this.generateRecommendations(violations);
      const fixCommands = this.generateFixCommands(violations);

      const output: BrandConsistencyOutput = {
        violations,
        summary,
        recommendations,
        fixCommands
      };

      this.emit('complete', { output });
      return output;
    } catch (error) {
      this.emit('complete', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  private generateSummary(violations: BrandViolation[]) {
    const totalViolations = violations.length;
    const byType = violations.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const bySeverity = violations.reduce((acc, v) => {
      acc[v.severity] = (acc[v.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate compliance score (simplified)
    const errorWeight = 0.5;
    const warningWeight = 0.3;
    const infoWeight = 0.1;
    
    const errorScore = (bySeverity.error || 0) * errorWeight;
    const warningScore = (bySeverity.warning || 0) * warningWeight;
    const infoScore = (bySeverity.info || 0) * infoWeight;
    
    const totalScore = errorScore + warningScore + infoScore;
    const complianceScore = Math.max(0, Math.round(100 - (totalScore * 10)));

    return {
      totalViolations,
      byType,
      bySeverity,
      complianceScore
    };
  }

  private generateRecommendations(violations: BrandViolation[]): string[] {
    const recommendations = [
      'Implement CSS custom properties for all brand tokens',
      'Create a centralized design system documentation',
      'Set up automated brand consistency checks in CI/CD',
      'Regular brand guideline reviews with design team'
    ];

    if (violations.some(v => v.type === 'color' && v.severity === 'error')) {
      recommendations.unshift('Priority: Fix hardcoded color values immediately');
    }

    if (violations.some(v => v.type === 'logo')) {
      recommendations.push('Update brand assets to latest versions');
    }

    return recommendations;
  }

  private generateFixCommands(violations: BrandViolation[]): string[] {
    const commands: string[] = [];

    violations.forEach(violation => {
      switch (violation.type) {
        case 'color':
          commands.push(`# Fix color in ${violation.file}:${violation.line}`);
          commands.push(`sed -i 's/${violation.currentValue}/${violation.expectedValue}/g' ${violation.file}`);
          break;
        case 'logo':
          commands.push(`# Update logo asset`);
          commands.push(`cp assets/brand/${violation.expectedValue} assets/brand/${violation.currentValue}`);
          break;
        default:
          commands.push(`# Manual fix required for ${violation.type} in ${violation.file}`);
      }
    });

    return commands;
  }
}
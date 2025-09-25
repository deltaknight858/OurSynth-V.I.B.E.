/**
 * Marketplace Publisher Agent
 * Purpose: Prepare marketplace metadata (name, description, keywords, preview media)
 * Outputs: Listing manifest + validation report
 */

import type { AgentEvent } from './types.js';
import type { MonetizationCandidate } from './monetizationScout.js';

export interface MarketplaceListingInput {
  candidate: MonetizationCandidate;
  customMetadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    category?: string;
    tags?: string[];
  };
  generatePreview?: boolean;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  tags: string[];
  price: number;
  pricingTier: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  demoUrl?: string;
  documentation: {
    installation: string;
    usage: string;
    props?: Record<string, string>;
    examples: string[];
  };
  metadata: {
    version: string;
    author: string;
    license: string;
    dependencies: string[];
    compatibility: string[];
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface MarketplacePublisherOutput {
  listing: MarketplaceListing;
  validation: ValidationResult;
  publishUrl?: string;
  estimatedApprovalTime: string;
}

export class MarketplacePublisherAgent {
  private onEvent?: (event: AgentEvent) => void;

  constructor(onEvent?: (event: AgentEvent) => void) {
    this.onEvent = onEvent;
  }

  private emit(type: AgentEvent['type'], payload?: unknown) {
    this.onEvent?.({ type, payload, timestamp: Date.now() });
  }

  async execute(input: MarketplaceListingInput): Promise<MarketplacePublisherOutput> {
    this.emit('start', { agent: 'marketplacePublisher', input });

    try {
      this.emit('progress', { message: 'Generating marketplace listing...' });

      const { candidate, customMetadata } = input;
      
      // Generate enhanced metadata
      const listing: MarketplaceListing = {
        id: candidate.id,
        title: customMetadata?.title || candidate.name,
        description: customMetadata?.description || candidate.description || `Professional ${candidate.type} for modern web applications`,
        keywords: customMetadata?.keywords || this.generateKeywords(candidate),
        category: customMetadata?.category || this.categorizeComponent(candidate),
        tags: customMetadata?.tags || this.generateTags(candidate),
        price: candidate.suggestedPrice,
        pricingTier: candidate.pricingTier,
        previewUrl: input.generatePreview ? `https://preview.oursynth.com/${candidate.id}` : undefined,
        thumbnailUrl: `https://assets.oursynth.com/thumbnails/${candidate.id}.png`,
        demoUrl: `https://demo.oursynth.com/${candidate.id}`,
        documentation: {
          installation: this.generateInstallationInstructions(candidate),
          usage: this.generateUsageExample(candidate),
          props: this.extractComponentProps(candidate),
          examples: this.generateCodeExamples(candidate)
        },
        metadata: {
          version: '1.0.0',
          author: 'OurSynth',
          license: 'MIT',
          dependencies: this.extractDependencies(candidate),
          compatibility: ['React 18+', 'TypeScript 5+', 'Next.js 13+']
        }
      };

      this.emit('progress', { message: 'Validating listing...' });

      const validation = this.validateListing(listing);
      
      this.emit('progress', { message: 'Preparing for publication...' });

      const output: MarketplacePublisherOutput = {
        listing,
        validation,
        publishUrl: validation.isValid ? `https://marketplace.oursynth.com/publish/${listing.id}` : undefined,
        estimatedApprovalTime: validation.isValid ? '2-3 business days' : 'Fix validation errors first'
      };

      this.emit('complete', { output });
      return output;
    } catch (error) {
      this.emit('complete', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  private generateKeywords(candidate: MonetizationCandidate): string[] {
    const baseKeywords = ['react', 'component', 'ui', 'typescript'];
    const typeKeywords = {
      component: ['component', 'widget', 'element'],
      asset: ['asset', 'resource', 'media'],
      template: ['template', 'layout', 'starter'],
      utility: ['utility', 'helper', 'function']
    };
    
    return [...baseKeywords, ...typeKeywords[candidate.type], candidate.name.toLowerCase().replace(/\s+/g, '-')];
  }

  private categorizeComponent(candidate: MonetizationCandidate): string {
    if (candidate.name.toLowerCase().includes('button')) return 'Form Controls';
    if (candidate.name.toLowerCase().includes('chat')) return 'Communication';
    if (candidate.name.toLowerCase().includes('command')) return 'Navigation';
    return 'UI Components';
  }

  private generateTags(candidate: MonetizationCandidate): string[] {
    const tags = ['premium', 'production-ready'];
    if (candidate.complexity === 'high') tags.push('advanced');
    if (candidate.marketPotential === 'high') tags.push('popular');
    return tags;
  }

  private generateInstallationInstructions(candidate: MonetizationCandidate): string {
    return `npm install @oursynth/${candidate.id}`;
  }

  private generateUsageExample(candidate: MonetizationCandidate): string {
    const componentName = candidate.name.replace(/\s+/g, '');
    return `import { ${componentName} } from '@oursynth/${candidate.id}';\n\nfunction App() {\n  return <${componentName} />;\n}`;
  }

  private extractComponentProps(candidate: MonetizationCandidate): Record<string, string> | undefined {
    // Mock prop extraction - in real implementation, would parse TypeScript interfaces
    if (candidate.name.includes('Button')) {
      return {
        variant: 'primary | secondary | outline',
        size: 'sm | md | lg',
        disabled: 'boolean',
        onClick: '() => void'
      };
    }
    return undefined;
  }

  private generateCodeExamples(candidate: MonetizationCandidate): string[] {
    return [
      `// Basic usage\n<${candidate.name.replace(/\s+/g, '')} />`,
      `// With props\n<${candidate.name.replace(/\s+/g, '')} variant="primary" size="lg" />`
    ];
  }

  private extractDependencies(candidate: MonetizationCandidate): string[] {
    return ['react', 'typescript']; // Mock dependencies
  }

  private validateListing(listing: MarketplaceListing): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validation rules
    if (!listing.title || listing.title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    }
    if (!listing.description || listing.description.length < 20) {
      errors.push('Description must be at least 20 characters long');
    }
    if (!listing.keywords.length) {
      errors.push('At least one keyword is required');
    }
    if (listing.keywords.length < 3) {
      warnings.push('Consider adding more keywords for better discoverability');
    }
    if (!listing.documentation.usage) {
      errors.push('Usage documentation is required');
    }

    // Suggestions
    if (!listing.previewUrl) {
      suggestions.push('Consider adding a preview URL for better engagement');
    }
    if (!listing.documentation.props) {
      suggestions.push('Adding prop documentation improves developer experience');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }
}
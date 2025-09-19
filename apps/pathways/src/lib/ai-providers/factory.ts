import { AIProvider, ProviderType, AIProviderConfig } from './types';
import { OpenAIProvider } from './openai-provider';
import { VertexAIProvider } from './vertex-provider';

export const PROVIDER_CONFIGS: Record<ProviderType, AIProviderConfig> = {
  openai: {
    type: 'openai',
    name: 'OpenAI',
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
    defaultModel: 'gpt-3.5-turbo',
    requiresCredentials: ['OPENAI_API_KEY'],
  },
  vertex: {
    type: 'vertex',
    name: 'Vertex AI (Google)',
    models: ['gemini-pro', 'gemini-pro-vision', 'text-bison'],
    defaultModel: 'gemini-pro',
    requiresCredentials: ['GOOGLE_CLOUD_PROJECT', 'GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY'],
  },
};

export class AIProviderFactory {
  private static providers: Map<ProviderType, AIProvider> = new Map();

  static getProvider(type: ProviderType): AIProvider {
    if (!this.providers.has(type)) {
      const provider = this.createProvider(type);
      this.providers.set(type, provider);
    }
    
    return this.providers.get(type)!;
  }

  private static createProvider(type: ProviderType): AIProvider {
    switch (type) {
      case 'openai':
        return new OpenAIProvider();
      case 'vertex':
        return new VertexAIProvider();
      default:
        throw new Error(`Unsupported AI provider: ${type}`);
    }
  }

  static getAllConfigs(): AIProviderConfig[] {
    return Object.values(PROVIDER_CONFIGS);
  }

  static getConfig(type: ProviderType): AIProviderConfig {
    return PROVIDER_CONFIGS[type];
  }

  static getAvailableProviders(): ProviderType[] {
    return Object.keys(PROVIDER_CONFIGS) as ProviderType[];
  }

  static isProviderConfigured(type: ProviderType): boolean {
    try {
      const provider = this.getProvider(type);
      return provider.isConfigured();
    } catch {
      return false;
    }
  }
}

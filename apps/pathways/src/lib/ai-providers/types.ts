export interface AIProvider {
  name: string;
  generateComponent(prompt: string): Promise<string>;
  isConfigured(): boolean;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerationOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export type ProviderType = 'openai' | 'vertex';

export interface AIProviderConfig {
  type: ProviderType;
  name: string;
  models: string[];
  defaultModel: string;
  requiresCredentials: string[];
}

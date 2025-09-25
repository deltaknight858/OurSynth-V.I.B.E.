export * from './types.js';

export interface AgentRunnerConfig {
  onEvent?: (e: import('./types.js').AgentEvent) => void;
}

export function runAgent(config: AgentRunnerConfig = {}){
  const emit = (type: 'start'|'progress'|'complete', payload?: unknown) => config.onEvent?.({ type, payload, timestamp: Date.now() });
  emit('start');
  // Placeholder work
  emit('progress', { message: 'Agent runtime initialized' });
  emit('complete');
}

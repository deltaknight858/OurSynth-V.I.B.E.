// Local agent types for Phase 3 agents
export type AgentEvent = {
  type: 'start' | 'progress' | 'complete';
  payload?: unknown;
  timestamp: number;
};
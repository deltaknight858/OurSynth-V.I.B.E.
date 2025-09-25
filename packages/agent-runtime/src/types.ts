// Agent event contract for agent-runtime
export type AgentEvent = {
  type: 'start' | 'progress' | 'complete';
  payload?: unknown;
  timestamp: number;
};

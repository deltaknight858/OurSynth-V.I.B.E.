export type OAIEvent = {
  id: string;
  ts: number;
  type: string;
  source: string;
  data?: unknown;
};

// Temporary stub; real implementation should subscribe to OAI event bus.
export function useOAIEvents(): OAIEvent[] {
  return [];
}

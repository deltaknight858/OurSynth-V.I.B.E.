type AgentEvent = {
    type: 'start' | 'progress' | 'complete';
    payload?: unknown;
    timestamp: number;
};

interface AgentRunnerConfig {
    onEvent?: (e: AgentEvent) => void;
}
declare function runAgent(config?: AgentRunnerConfig): void;

export { type AgentEvent, type AgentRunnerConfig, runAgent };

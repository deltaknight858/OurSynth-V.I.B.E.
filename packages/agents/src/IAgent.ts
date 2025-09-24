/**
 * Core Agent Interface
 * 
 * Defines the contract for all AI agents within the VIBE system.
 * Agents are executable logic units that can be orchestrated
 * through the event bus system.
 */

export interface AgentCapability {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
}

export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: AgentCapability[];
  tags: string[];
  tier: 'free' | 'pro' | 'enterprise';
  provider?: string;
  model?: string;
}

export interface AgentContext {
  userId: string;
  sessionId: string;
  conversationId?: string;
  memory?: Record<string, any>;
  environment: 'development' | 'staging' | 'production';
  trace?: {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
  };
}

export interface AgentRequest {
  capability: string;
  input: any;
  context: AgentContext;
  timeout?: number;
  priority?: 'low' | 'normal' | 'high';
}

export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  metadata?: {
    duration: number;
    tokensUsed?: number;
    model?: string;
    provider?: string;
  };
  trace?: {
    traceId: string;
    spanId: string;
    events: Array<{
      timestamp: number;
      event: string;
      data?: any;
    }>;
  };
}

/**
 * Base Agent Interface
 */
export interface IAgent {
  /**
   * Agent metadata and configuration
   */
  readonly metadata: AgentMetadata;

  /**
   * Initialize the agent with configuration
   */
  initialize(config?: Record<string, any>): Promise<void>;

  /**
   * Execute a capability with the given request
   */
  execute<T = any>(request: AgentRequest): Promise<AgentResponse<T>>;

  /**
   * Check agent health and readiness
   */
  healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy' | 'degraded';
    details?: Record<string, any>;
  }>;

  /**
   * Gracefully shutdown the agent
   */
  shutdown(): Promise<void>;
}

/**
 * Agent Registry Interface
 * 
 * Manages discovery and lifecycle of agents within the system.
 */
export interface IAgentRegistry {
  /**
   * Register an agent instance
   */
  register(agent: IAgent): Promise<void>;

  /**
   * Unregister an agent
   */
  unregister(agentId: string): Promise<void>;

  /**
   * Discover agents by capability or metadata
   */
  discover(filters?: {
    capability?: string;
    tags?: string[];
    tier?: string;
    provider?: string;
  }): Promise<AgentMetadata[]>;

  /**
   * Get a specific agent instance
   */
  getAgent(agentId: string): Promise<IAgent | null>;

  /**
   * List all registered agents
   */
  listAgents(): Promise<AgentMetadata[]>;
}

/**
 * Agent Orchestrator Interface
 * 
 * Coordinates execution of multiple agents and manages workflows.
 */
export interface IAgentOrchestrator {
  /**
   * Execute a single agent capability
   */
  execute<T = any>(
    agentId: string,
    request: AgentRequest
  ): Promise<AgentResponse<T>>;

  /**
   * Execute multiple agents in parallel
   */
  executeParallel<T = any>(
    requests: Array<{
      agentId: string;
      request: AgentRequest;
    }>
  ): Promise<AgentResponse<T>[]>;

  /**
   * Execute agents in a sequential workflow
   */
  executeWorkflow<T = any>(
    workflow: {
      steps: Array<{
        agentId: string;
        request: AgentRequest;
        condition?: (previousResults: any[]) => boolean;
      }>;
    }
  ): Promise<AgentResponse<T>[]>;
}

// Pre-defined agent types for common use cases
export namespace AgentTypes {
  export interface AssistAgent extends IAgent {
    chat(message: string, context: AgentContext): Promise<AgentResponse<{
      response: string;
      suggestions?: string[];
      actions?: Array<{
        name: string;
        description: string;
        payload: any;
      }>;
    }>>;
  }

  export interface CodeAgent extends IAgent {
    generateCode(
      prompt: string,
      language: string,
      context: AgentContext
    ): Promise<AgentResponse<{
      code: string;
      explanation: string;
      tests?: string;
    }>>;

    reviewCode(
      code: string,
      language: string,
      context: AgentContext
    ): Promise<AgentResponse<{
      feedback: string;
      suggestions: Array<{
        line: number;
        message: string;
        severity: 'info' | 'warning' | 'error';
      }>;
      score: number;
    }>>;
  }

  export interface WorkflowAgent extends IAgent {
    executeWorkflow(
      workflowId: string,
      input: any,
      context: AgentContext
    ): Promise<AgentResponse<{
      result: any;
      steps: Array<{
        step: string;
        status: 'pending' | 'running' | 'completed' | 'failed';
        result?: any;
        error?: string;
      }>;
    }>>;
  }
}
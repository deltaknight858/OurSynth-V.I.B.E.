// Memory System Types for Phase 1

export interface MemoryNode {
  id: string;
  userId: string;
  title: string;
  content?: string;
  type: string; // 'note', 'conversation', 'insight', 'task', etc.
  sourceApp?: string; // 'synthnote', 'chat', 'voice', etc.
  conversationId?: string;
  messageId?: string;
  importance: number; // 1-10 scale
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: string; // 'relates_to', 'follows_from', 'contradicts', etc.
  weight: number; // 0-1 relationship strength
  metadata: Record<string, any>;
  createdAt: Date;
}

// Visual representation types for D3MindMap compatibility
export interface VisualNode {
  id: string;
  title: string;
  type: string;
  content?: string;
  position?: { x: number; y: number };
  template?: any; // For D3MindMap template system
}

export interface VisualEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

// API request/response types
export interface IngestMemoryRequest {
  title: string;
  content?: string;
  type: string;
  sourceApp?: string;
  conversationId?: string;
  messageId?: string;
  importance?: number;
  metadata?: Record<string, any>;
}

export interface QueryMemoryRequest {
  q?: string; // search query
  type?: string; // filter by type
  conversationId?: string; // filter by conversation
  limit?: number;
}

export interface LinkMemoryRequest {
  sourceId: string;
  targetId: string;
  type?: string;
  weight?: number;
  metadata?: Record<string, any>;
}

export interface MemoryGraphResponse {
  nodes: MemoryNode[];
  edges: MemoryEdge[];
}
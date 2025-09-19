export type CapsuleId = string;

export interface CapsuleMeta {
  id: CapsuleId;
  title: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MemoryNote {
  id: string;
  capsuleId: CapsuleId;
  content: string;
  tags?: string[];
  timestamp: string;
}

export interface MemoryAPI {
  add(note: Omit<MemoryNote, 'id' | 'timestamp'>): Promise<MemoryNote>;
  list(capsuleId: CapsuleId): Promise<MemoryNote[]>;
  remove(id: string): Promise<void>;
  search?: (query: string, options?: SearchOptions) => Promise<SemanticResult[]>;
}

// Extended graph types
export interface MediaAttachment {
  id: string;
  kind: 'image' | 'audio' | 'video' | 'file';
  url: string;
  mime?: string;
  meta?: Record<string, unknown>;
}

export interface MemoryNode {
  id: string;
  capsuleId?: CapsuleId; // optional when using global memory per user
  userId?: string;
  title: string;
  content?: string;
  summary?: string;
  tags?: string[];
  attachments?: MediaAttachment[]; // legacy
  media?: MediaAttachment[]; // new
  createdAt: string | Date; // ISO or Date
  embedding?: number[];
}

export interface MemoryEdge {
  id: string;
  userId?: string;
  sourceId: string;
  targetId: string;
  reason?: string;
  score?: number; // relevance
  type?: string;
  weight?: number;
}

export interface GraphContext {
  node: MemoryNode;
  edges: MemoryEdge[];
  neighbors: MemoryNode[];
}

export interface GraphAPI {
  createNode(input: Omit<MemoryNode, 'id' | 'createdAt'> & { createdAt: Date | string }): Promise<MemoryNode>;
  createEdge(input: Omit<MemoryEdge, 'id'>): Promise<MemoryEdge>;
  getGraphContext(nodeId: string, depth?: number): Promise<GraphContext>;
}

// Semantic search
export interface SemanticFilter {
  tagsAny?: string[];
  tagsAll?: string[];
  since?: string; // ISO
  until?: string; // ISO
}

export interface SemanticResult {
  node: MemoryNode;
  score: number; // distance or similarity (document metric)
}

export interface SearchOptions {
  topK?: number; // default 10
  minScore?: number; // filter out below threshold
  metric?: 'cosine' | 'euclidean' | 'inner';
  filter?: SemanticFilter;
  userId?: string;
  capsuleId?: CapsuleId;
}

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
export interface MediaAttachment {
    id: string;
    kind: 'image' | 'audio' | 'video' | 'file';
    url: string;
    mime?: string;
    meta?: Record<string, unknown>;
}
export interface MemoryNode {
    id: string;
    capsuleId?: CapsuleId;
    userId?: string;
    title: string;
    content?: string;
    summary?: string;
    tags?: string[];
    attachments?: MediaAttachment[];
    media?: MediaAttachment[];
    createdAt: string | Date;
    embedding?: number[];
}
export interface MemoryEdge {
    id: string;
    userId?: string;
    sourceId: string;
    targetId: string;
    reason?: string;
    score?: number;
    type?: string;
    weight?: number;
}
export interface GraphContext {
    node: MemoryNode;
    edges: MemoryEdge[];
    neighbors: MemoryNode[];
}
export interface GraphAPI {
    createNode(input: Omit<MemoryNode, 'id' | 'createdAt'> & {
        createdAt: Date | string;
    }): Promise<MemoryNode>;
    createEdge(input: Omit<MemoryEdge, 'id'>): Promise<MemoryEdge>;
    getGraphContext(nodeId: string, depth?: number): Promise<GraphContext>;
}
export interface SemanticFilter {
    tagsAny?: string[];
    tagsAll?: string[];
    since?: string;
    until?: string;
}
export interface SemanticResult {
    node: MemoryNode;
    score: number;
}
export interface SearchOptions {
    topK?: number;
    minScore?: number;
    metric?: 'cosine' | 'euclidean' | 'inner';
    filter?: SemanticFilter;
    userId?: string;
    capsuleId?: CapsuleId;
}

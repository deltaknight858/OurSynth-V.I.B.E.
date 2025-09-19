import type { GraphAPI, MemoryEdge, MemoryNode, GraphContext } from '../types.js';
export declare class MemoryNoteNode {
    private api;
    constructor(api: GraphAPI);
    createNode(data: Omit<MemoryNode, 'id' | 'createdAt'>): Promise<MemoryNode>;
    linkNodes(sourceId: string, targetId: string, edge: Omit<MemoryEdge, 'id' | 'sourceId' | 'targetId'>): Promise<MemoryEdge>;
    getContext(nodeId: string, depth?: number): Promise<GraphContext>;
}

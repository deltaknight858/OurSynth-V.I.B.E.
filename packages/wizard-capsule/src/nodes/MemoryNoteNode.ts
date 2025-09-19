import type { GraphAPI, MemoryEdge, MemoryNode, GraphContext } from '../types.js';

export class MemoryNoteNode {
  constructor(private api: GraphAPI) {}

  async createNode(data: Omit<MemoryNode, 'id' | 'createdAt'>) {
    return this.api.createNode({ ...data, createdAt: new Date() });
  }

  async linkNodes(sourceId: string, targetId: string, edge: Omit<MemoryEdge, 'id' | 'sourceId' | 'targetId'>) {
    return this.api.createEdge({ ...edge, sourceId, targetId });
  }

  async getContext(nodeId: string, depth = 2): Promise<GraphContext> {
    return this.api.getGraphContext(nodeId, depth);
  }
}

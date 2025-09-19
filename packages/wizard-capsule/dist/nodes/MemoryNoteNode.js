export class MemoryNoteNode {
    constructor(api) {
        this.api = api;
    }
    async createNode(data) {
        return this.api.createNode({ ...data, createdAt: new Date() });
    }
    async linkNodes(sourceId, targetId, edge) {
        return this.api.createEdge({ ...edge, sourceId, targetId });
    }
    async getContext(nodeId, depth = 2) {
        return this.api.getGraphContext(nodeId, depth);
    }
}

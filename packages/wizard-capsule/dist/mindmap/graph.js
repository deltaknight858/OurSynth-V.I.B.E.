export async function getRelevantContext(api, nodeId, depth = 2) {
    // Placeholder for traversal/relevance scoring; delegates to API for now.
    return api.getGraphContext(nodeId, depth);
}

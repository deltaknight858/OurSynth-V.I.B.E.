import type { GraphAPI, GraphContext } from '../types.js';

export async function getRelevantContext(api: GraphAPI, nodeId: string, depth = 2): Promise<GraphContext> {
  // Placeholder for traversal/relevance scoring; delegates to API for now.
  return api.getGraphContext(nodeId, depth);
}

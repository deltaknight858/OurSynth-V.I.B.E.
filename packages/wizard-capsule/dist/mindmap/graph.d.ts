import type { GraphAPI, GraphContext } from '../types.js';
export declare function getRelevantContext(api: GraphAPI, nodeId: string, depth?: number): Promise<GraphContext>;

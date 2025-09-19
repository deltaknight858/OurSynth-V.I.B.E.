import React from 'react';
import type { GraphContext } from '../types.js';
type MindmapViewForceProps = {
    loadContext: (rootNodeId: string, depth?: number) => Promise<GraphContext>;
    rootNodeId: string;
    depth?: number;
    width?: number;
    height?: number;
};
export declare function MindmapViewForce({ loadContext, rootNodeId, depth, width, height }: MindmapViewForceProps): React.JSX.Element;
export {};

import React from 'react';
import type { GraphContext } from '../types.js';
type MindmapViewProps = {
    loadContext: (rootNodeId: string, depth?: number) => Promise<GraphContext>;
    rootNodeId: string;
    depth?: number;
    width?: number;
    height?: number;
};
export declare function MindmapView({ loadContext, rootNodeId, depth, width, height }: MindmapViewProps): React.JSX.Element;
export {};

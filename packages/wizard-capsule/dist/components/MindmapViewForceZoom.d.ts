import React from 'react';
import type { GraphContext } from '../types.js';
type Props = {
    loadContext: (rootNodeId: string, depth?: number) => Promise<GraphContext>;
    rootNodeId: string;
    depth?: number;
    width?: number;
    height?: number;
};
export declare function MindmapViewForceZoom({ loadContext, rootNodeId, depth, width, height }: Props): React.JSX.Element;
export {};

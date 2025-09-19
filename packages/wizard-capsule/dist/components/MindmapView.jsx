import React, { useEffect, useState } from 'react';
export function MindmapView({ loadContext, rootNodeId, depth = 2, width = 800, height = 600 }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    useEffect(() => {
        let alive = true;
        loadContext(rootNodeId, depth).then((ctx) => {
            if (!alive)
                return;
            const allNodes = [ctx.node, ...ctx.neighbors];
            setNodes(allNodes);
            setEdges(ctx.edges);
        });
        return () => {
            alive = false;
        };
    }, [loadContext, rootNodeId, depth]);
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusStep = 150;
    const positions = {};
    const neighbors = nodes.filter((n) => n.id !== rootNodeId);
    nodes.forEach((node, idx) => {
        if (node.id === rootNodeId) {
            positions[node.id] = { x: centerX, y: centerY };
        }
        else {
            const angle = (idx / Math.max(1, neighbors.length)) * 2 * Math.PI;
            positions[node.id] = {
                x: centerX + radiusStep * Math.cos(angle),
                y: centerY + radiusStep * Math.sin(angle),
            };
        }
    });
    return (<svg width={width} height={height} className="border" data-border-color="var(--border-color, #ccc)">
      {edges.map((e) => {
            const src = positions[e.sourceId];
            const tgt = positions[e.targetId];
            if (!src || !tgt)
                return null;
            return <line key={e.id} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} stroke="#999" strokeWidth={1 + (e.weight ?? 0)}/>;
        })}

      {nodes.map((n) => {
            const pos = positions[n.id];
            const isRoot = n.id === rootNodeId;
            return (<g key={n.id} transform={`translate(${pos.x},${pos.y})`} className="cursor-pointer">
            <circle r={30} fill={isRoot ? '#4cafef' : '#eee'} stroke="#333"/>
            <text textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={isRoot ? '#fff' : '#000'}>
              {n.title ?? 'Untitled'}
            </text>
          </g>);
        })}
    </svg>);
}

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
export function MindmapViewForce({ loadContext, rootNodeId, depth = 2, width = 800, height = 600 }) {
    const svgRef = useRef(null);
    useEffect(() => {
        let sim = null;
        loadContext(rootNodeId, depth).then((ctx) => {
            const nodes = ctx.neighbors.concat(ctx.node).map((n) => ({
                id: n.id,
                title: n.title,
                fx: n.id === rootNodeId ? width / 2 : null,
                fy: n.id === rootNodeId ? height / 2 : null,
            }));
            const links = ctx.edges.map((e) => ({ source: e.sourceId, target: e.targetId, weight: e.weight ?? 1 }));
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const link = svg
                .append('g')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .selectAll('line')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .data(links)
                .join('line')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('stroke-width', (d) => Math.sqrt(d.weight));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const node = svg
                .append('g')
                .attr('stroke', '#fff')
                .attr('stroke-width', 1.5)
                .selectAll('circle')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .data(nodes)
                .join('circle')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('r', 30)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .attr('fill', (d) => (d.id === rootNodeId ? '#4cafef' : '#eee'));
            node
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .call(d3.drag()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('start', function (event, d) {
                if (!event.active && sim)
                    sim.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('drag', function (event, d) {
                d.fx = event.x;
                d.fy = event.y;
            })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .on('end', function (event, d) {
                if (!event.active && sim)
                    sim.alphaTarget(0);
                if (d.id !== rootNodeId) {
                    d.fx = null;
                    d.fy = null;
                }
            }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const label = svg
                .append('g')
                .selectAll('text')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .data(nodes)
                .join('text')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .text((d) => d.title ?? d.id)
                .attr('font-size', 12)
                .attr('text-anchor', 'middle')
                .attr('dy', 4)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .style('pointer-events', 'none');
            sim = d3
                .forceSimulation(nodes)
                .force('link', d3.forceLink(links).id((d) => d.id).distance(150))
                .force('charge', d3.forceManyBody().strength(-400))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .on('tick', () => {
                link
                    .attr('x1', (d) => typeof d.source === 'object' && d.source !== null ? d.source.x ?? 0 : 0)
                    .attr('y1', (d) => typeof d.source === 'object' && d.source !== null ? d.source.y ?? 0 : 0)
                    .attr('x2', (d) => typeof d.target === 'object' && d.target !== null ? d.target.x ?? 0 : 0)
                    .attr('y2', (d) => typeof d.target === 'object' && d.target !== null ? d.target.y ?? 0 : 0);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                label.attr('x', (d) => d.x).attr('y', (d) => d.y);
            });
        });
        return () => {
            if (sim)
                sim.stop();
        };
    }, [loadContext, rootNodeId, depth, width, height]);
    return <svg ref={svgRef} width={width} height={height} className="border"/>;
}

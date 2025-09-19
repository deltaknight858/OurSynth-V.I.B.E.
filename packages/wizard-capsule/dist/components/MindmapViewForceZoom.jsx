/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
export function MindmapViewForceZoom({ loadContext, rootNodeId, depth = 2, width = 800, height = 600 }) {
    const svgRef = useRef(null);
    useEffect(() => {
        let sim = null;
        loadContext(rootNodeId, depth).then((ctx) => {
            const nodes = ctx.neighbors.concat(ctx.node).map((n) => ({
                ...n,
                id: n.id,
                fx: n.id === rootNodeId ? width / 2 : null,
                fy: n.id === rootNodeId ? height / 2 : null,
            }));
            const links = ctx.edges.map((e) => ({ source: e.sourceId, target: e.targetId, weight: e.weight ?? 1 }));
            const svg = d3.select(svgRef.current);
            svg.selectAll('*').remove();
            const container = svg.append('g');
            const zoom = d3
                .zoom()
                .scaleExtent([0.2, 3])
                .on('zoom', (event) => {
                container.attr('transform', event.transform.toString());
            });
            svg.call(zoom);
            const linkKey = (d) => {
                const s = typeof d.source === 'object' ? (d.source.id ?? d.source) : d.source;
                const t = typeof d.target === 'object' ? (d.target.id ?? d.target) : d.target;
                return `${s}|${t}`;
            };
            let link = container
                .append('g')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .selectAll('line')
                .data(links, linkKey)
                .join('line')
                .attr('stroke-width', (d) => Math.sqrt(d.weight));
            let node = container
                .append('g')
                .attr('stroke', '#fff')
                .attr('stroke-width', 1.5)
                .selectAll('circle')
                .data(nodes, (d) => d.id)
                .join((enter) => enter
                .append('circle')
                .attr('r', 0)
                .attr('fill', (d) => (d.id === rootNodeId ? '#4cafef' : '#eee'))
                .call((enterSel) => enterSel.transition().duration(500).attr('r', 30)));
            node = node
                .call(d3.drag()
                .on('start', function (event, d) {
                if (!event.active && sim)
                    sim.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
                .on('drag', function (event, d) {
                d.fx = event.x;
                d.fy = event.y;
            })
                .on('end', function (event, d) {
                if (!event.active && sim)
                    sim.alphaTarget(0);
                if (d.id !== rootNodeId) {
                    d.fx = null;
                    d.fy = null;
                }
            }))
                .on('click', function (event, d) {
                // Zoom to clicked node
                const current = d3.zoomTransform(svg.node());
                const targetScale = current.k || 1;
                const tx = (width / 2) - targetScale * (d.x ?? 0);
                const ty = (height / 2) - targetScale * (d.y ?? 0);
                svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(targetScale));
                // Expand neighbors of clicked node and merge graph
                loadContext(d.id, 1).then((ctx2) => {
                    // Merge nodes
                    const existing = new Map(nodes.map((n) => [n.id, n]));
                    const addables = [ctx2.node, ...ctx2.neighbors];
                    let added = false;
                    for (const n2 of addables) {
                        if (!existing.has(n2.id)) {
                            nodes.push({ ...n2 });
                            existing.set(n2.id, n2);
                            added = true;
                        }
                    }
                    // Merge links
                    const linkSet = new Set(links.map((e) => linkKey(e)));
                    for (const e2 of ctx2.edges) {
                        const key = `${e2.sourceId}|${e2.targetId}`;
                        if (!linkSet.has(key)) {
                            links.push({ source: e2.sourceId, target: e2.targetId, weight: e2.weight ?? 1 });
                            linkSet.add(key);
                            added = true;
                        }
                    }
                    if (!added)
                        return;
                    // Rebind selections with keys and animate entering nodes
                    node = node
                        .data(nodes, (d) => d.id)
                        .join((enter) => enter
                        .append('circle')
                        .attr('r', 0)
                        .attr('fill', (d) => (d.id === rootNodeId ? '#4cafef' : '#eee'))
                        .call((enterSel) => enterSel.transition().duration(500).attr('r', 30)));
                    node = node
                        .call(d3.drag()
                        .on('start', function (event, d) {
                        if (!event.active && sim)
                            sim.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                        .on('drag', function (event, d) {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                        .on('end', function (event, d) {
                        if (!event.active && sim)
                            sim.alphaTarget(0);
                        if (d.id !== rootNodeId) {
                            d.fx = null;
                            d.fy = null;
                        }
                    }))
                        .on('click', function (event, d) {
                        const current = d3.zoomTransform(svg.node());
                        const targetScale = current.k || 1;
                        const tx = (width / 2) - targetScale * (d.x ?? 0);
                        const ty = (height / 2) - targetScale * (d.y ?? 0);
                        svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(targetScale));
                        loadContext(d.id, 1).then( /* recursion safe; handled as above */);
                    });
                    link = link
                        .data(links, linkKey)
                        .join('line')
                        .attr('stroke-width', (d) => Math.sqrt(d.weight));
                    label = label
                        .data(nodes, (d) => d.id)
                        .join('text')
                        .text((d) => d.title ?? d.id)
                        .attr('font-size', 12)
                        .attr('text-anchor', 'middle')
                        .attr('dy', 4)
                        .style('pointer-events', 'none');
                    // Update simulation
                    sim.force('link').links(links);
                    sim.nodes(nodes);
                    sim.alpha(0.6).restart();
                });
            });
            let label = container
                .append('g')
                .selectAll('text')
                .data(nodes, (d) => d.id)
                .join('text')
                .text((d) => d.title ?? d.id)
                .attr('font-size', 12)
                .attr('text-anchor', 'middle')
                .attr('dy', 4)
                .style('pointer-events', 'none');
            sim = d3
                .forceSimulation(nodes)
                .force('link', d3.forceLink(links).id((d) => d.id).distance(150))
                .force('charge', d3.forceManyBody().strength(-400))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .on('tick', () => {
                link
                    .attr('x1', (d) => (typeof d.source === 'object' && d.source !== null ? d.source.x ?? 0 : 0))
                    .attr('y1', (d) => (typeof d.source === 'object' && d.source !== null ? d.source.y ?? 0 : 0))
                    .attr('x2', (d) => (typeof d.target === 'object' && d.target !== null ? d.target.x ?? 0 : 0))
                    .attr('y2', (d) => (typeof d.target === 'object' && d.target !== null ? d.target.y ?? 0 : 0));
                node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
                label.attr('x', (d) => d.x).attr('y', (d) => d.y);
            });
            // Zoom-to-fit after first tick (delayed to measure bbox)
            const zoomToFit = () => {
                const bounds = container.node().getBBox();
                const fullWidth = width;
                const fullHeight = height;
                const midX = bounds.x + bounds.width / 2;
                const midY = bounds.y + bounds.height / 2;
                const scale = 0.85 / Math.max(bounds.width / fullWidth, bounds.height / fullHeight);
                const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
                svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
            };
            setTimeout(zoomToFit, 0);
        });
        return () => {
            if (sim)
                sim.stop();
        };
    }, [loadContext, rootNodeId, depth, width, height]);
    return <svg ref={svgRef} width={width} height={height} className="border"/>;
}

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { GraphContext } from '../types.js';


type MindmapViewForceProps = {
  loadContext: (rootNodeId: string, depth?: number) => Promise<GraphContext>;
  rootNodeId: string;
  depth?: number;
  width?: number;
  height?: number;
};


export function MindmapViewForce({ loadContext, rootNodeId, depth = 2, width = 800, height = 600 }: MindmapViewForceProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let sim: d3.Simulation<NodeDatum, undefined> | null = null;

    type NodeDatum = {
      id: string;
      title?: string;
      x?: number;
      y?: number;
      fx?: number | null;
      fy?: number | null;
    };
    type LinkDatum = { source: string; target: string; weight: number };

    loadContext(rootNodeId, depth).then((ctx) => {
      const nodes: NodeDatum[] = ctx.neighbors.concat(ctx.node).map((n) => ({
        id: n.id,
        title: n.title,
        fx: n.id === rootNodeId ? width! / 2 : null,
        fy: n.id === rootNodeId ? height! / 2 : null,
      }));
      const links: LinkDatum[] = ctx.edges.map((e) => ({ source: e.sourceId, target: e.targetId, weight: e.weight ?? 1 }));

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();


      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const link = (svg
        .append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .data(links as any)
        .join('line')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('stroke-width', (d: any) => Math.sqrt(d.weight)) as any);


      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const node = (svg
        .append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .data(nodes as any)
        .join('circle')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('r', 30)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('fill', (d: any) => (d.id === rootNodeId ? '#4cafef' : '#eee')) as any);
      node
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .call((d3.drag() as any)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .on('start', function(event: any, d: any) {
            if (!event.active && sim) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .on('drag', function(event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .on('end', function(event: any, d: any) {
            if (!event.active && sim) sim.alphaTarget(0);
            if (d.id !== rootNodeId) {
              d.fx = null;
              d.fy = null;
            }
          })
        );


      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const label = (svg
        .append('g')
        .selectAll('text')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .data(nodes as any)
        .join('text')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .text((d: any) => d.title ?? d.id)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .attr('dy', 4)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .style('pointer-events', 'none') as any);


      sim = d3
        .forceSimulation(nodes)
        .force('link', d3.forceLink<NodeDatum, LinkDatum>(links).id((d: NodeDatum) => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width! / 2, height! / 2))
        .on('tick', () => {
          link
            .attr('x1', (d: d3.SimulationLinkDatum<NodeDatum>) =>
              typeof d.source === 'object' && d.source !== null ? (d.source as NodeDatum).x ?? 0 : 0)
            .attr('y1', (d: d3.SimulationLinkDatum<NodeDatum>) =>
              typeof d.source === 'object' && d.source !== null ? (d.source as NodeDatum).y ?? 0 : 0)
            .attr('x2', (d: d3.SimulationLinkDatum<NodeDatum>) =>
              typeof d.target === 'object' && d.target !== null ? (d.target as NodeDatum).x ?? 0 : 0)
            .attr('y2', (d: d3.SimulationLinkDatum<NodeDatum>) =>
              typeof d.target === 'object' && d.target !== null ? (d.target as NodeDatum).y ?? 0 : 0);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (node as any).attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (label as any).attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
        });
    });

    return () => {
      if (sim) sim.stop();
    };
  }, [loadContext, rootNodeId, depth, width, height]);

  return <svg ref={svgRef} width={width} height={height} className="border" />;
}

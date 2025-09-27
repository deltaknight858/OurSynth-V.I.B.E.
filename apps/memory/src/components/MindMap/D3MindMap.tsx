import React, { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { getTemplateByType } from "./MindMapTemplates";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause } from "lucide-react";

// Local types to avoid service dependencies
interface VisualNode {
  id: string;
  mindMapId: string;
  title: string;
  content?: string;
  type?: string;
  position: { x: number; y: number };
  createdAt: Date;
  lastModified: Date;
}

interface FlexibleEdge {
  id: string;
  source?: string;  // For compatibility with MindMap.tsx format
  target?: string;  // For compatibility with MindMap.tsx format
  sourceNodeId?: string;  // Original format
  targetNodeId?: string;  // Original format
  label?: string;
}

interface D3MindMapProps {
  nodes: VisualNode[];
  edges: FlexibleEdge[];
  onNodeClick: (nodeId: string) => void;
  onNodeDrag: (nodeId: string, position: { x: number; y: number }) => void;
  selectedNodeId: string | null;
  showNodeIds?: boolean;
  width?: number;
  height?: number;
  layoutType?: "force" | "hierarchical" | "radial" | "circular";
}

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  type: string;
  content?: string;
  template: any;
  fx?: number | null;
  fy?: number | null;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  id: string;
  label?: string;
}

export function D3MindMap({
  nodes,
  edges,
  onNodeClick,
  onNodeDrag,
  selectedNodeId,
  showNodeIds = false,
  width = 800,
  height = 600,
  layoutType = "force"
}: D3MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [simulation, setSimulation] = useState<d3.Simulation<D3Node, D3Link> | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [transform, setTransform] = useState(d3.zoomIdentity);

  const createD3Data = useCallback(() => {
    const d3Nodes: D3Node[] = nodes.map(node => ({
      id: node.id,
      title: node.title,
      type: node.type || "default",
      content: node.content || "",
      template: getTemplateByType(node.type || "default"),
      x: node.position?.x || Math.random() * width,
      y: node.position?.y || Math.random() * height,
      fx: null,
      fy: null
    }));

    const d3Links: D3Link[] = edges.map(edge => ({
      id: edge.id,
      source: edge.sourceNodeId || edge.source,  // Handle both formats
      target: edge.targetNodeId || edge.target,  // Handle both formats
      label: edge.label || undefined
    }));

    return { d3Nodes, d3Links };
  }, [nodes, edges, width, height]);

  const createSimulation = useCallback((d3Nodes: D3Node[], d3Links: D3Link[]) => {
    let sim: d3.Simulation<D3Node, D3Link>;

    switch (layoutType) {
      case "hierarchical":
        sim = d3.forceSimulation(d3Nodes)
          .force("link", d3.forceLink(d3Links).id((d: any) => d.id).distance(100))
          .force("charge", d3.forceManyBody().strength(-300))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("collision", d3.forceCollide().radius(50));
        break;
      
      case "radial":
        sim = d3.forceSimulation(d3Nodes)
          .force("link", d3.forceLink(d3Links).id((d: any) => d.id).distance(80))
          .force("charge", d3.forceManyBody().strength(-200))
          .force("radial", d3.forceRadial(150, width / 2, height / 2))
          .force("collision", d3.forceCollide().radius(40));
        break;
      
      case "circular":
        d3Nodes.forEach((node, i) => {
          const angle = (i / d3Nodes.length) * 2 * Math.PI;
          const radius = Math.min(width, height) / 3;
          node.x = width / 2 + radius * Math.cos(angle);
          node.y = height / 2 + radius * Math.sin(angle);
          node.fx = node.x;
          node.fy = node.y;
        });
        sim = d3.forceSimulation(d3Nodes)
          .force("link", d3.forceLink(d3Links).id((d: any) => d.id).distance(50))
          .force("collision", d3.forceCollide().radius(30));
        break;
      
      default: // force
        sim = d3.forceSimulation(d3Nodes)
          .force("link", d3.forceLink(d3Links).id((d: any) => d.id).distance(120))
          .force("charge", d3.forceManyBody().strength(-400))
          .force("center", d3.forceCenter(width / 2, height / 2))
          .force("collision", d3.forceCollide().radius(60));
    }

    return sim;
  }, [layoutType, width, height]);

  const renderVisualization = useCallback(() => {
    if (!svgRef.current) {
      console.warn("SVG ref is not available");
      return;
    }

    let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    try {
      svg = d3.select(svgRef.current);
      if (!svg || typeof svg.node !== "function") {
        console.warn("Invalid D3 selection created", svg);
        return;
      }
    } catch (error) {
      console.error("Error creating D3 selection:", error);
      return;
    }

    if (!svg.node() || typeof svg.append !== "function" || typeof svg.call !== "function") {
      console.warn("D3 selection is missing required methods", svg);
      return;
    }

    svg.selectAll("*").remove();

    const { d3Nodes, d3Links } = createD3Data();
    const sim = createSimulation(d3Nodes, d3Links);
    setSimulation(sim);

    let zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown>;
    try {
      zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          setTransform(event.transform);
          if (g && typeof g.attr === "function") {
            g.attr("transform", event.transform.toString());
          }
        });
    } catch (error) {
      console.error("Error creating zoom behavior:", error);
      return;
    }

    zoomBehaviorRef.current = zoomBehavior;

    try {
      svg.call(zoomBehavior);
    } catch (error) {
      console.error("Error applying zoom behavior:", error);
      return;
    }

    let g: d3.Selection<SVGGElement, unknown, null, undefined>;
    try {
      g = svg.append("g");
      if (!g || typeof g.attr !== "function") {
        console.warn("Failed to create main group element");
        return;
      }
    } catch (error) {
      console.error("Error creating main group:", error);
      return;
    }
    
    svg.append("defs").selectAll("marker")
      .data(["arrow"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(d3Links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    const linkLabel = g.append("g")
      .attr("class", "link-labels")
      .selectAll("text")
      .data(d3Links.filter(d => d.label))
      .enter().append("text")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text(d => d.label || "");

    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(d3Nodes)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer");

    node.append("circle")
      .attr("r", 25)
      .attr("fill", d => {
        const template = getTemplateByType(d.type);
        return template.connectionColor || "#3b82f6";
      })
      .attr("stroke", d => selectedNodeId === d.id ? "#000" : "#fff")
      .attr("stroke-width", d => selectedNodeId === d.id ? 3 : 2)
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d.id);
      });

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .text(d => d.title.length > 10 ? d.title.substring(0, 10) + "..." : d.title);

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5em")
      .attr("font-size", "10px")
      .attr("fill", "#666")
      .text(d => {
        if (!d.content) return "";
        return d.content.length > 20 ? d.content.substring(0, 20) + "..." : d.content;
      });

    const drag = d3.drag<SVGGElement, D3Node>()
      .on("start", (event, d) => {
        if (!event.active && sim) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active && sim) sim.alphaTarget(0);
        onNodeDrag(d.id, { x: d.x || 0, y: d.y || 0 });
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any); // Using 'as any' to bypass a complex d3 typing issue with drag

    sim.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkLabel
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    if (g && typeof g.attr === "function") {
      g.attr("transform", transform.toString());
    }

  }, [createD3Data, createSimulation, onNodeClick, onNodeDrag, selectedNodeId, transform]);

  useEffect(() => {
    renderVisualization();
  }, [renderVisualization]);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) {
      console.warn("SVG ref or zoom behavior not available for zoom in");
      return;
    }

    try {
      const svg = d3.select(svgRef.current);
      if (!svg || !svg.node() || typeof svg.transition !== "function") {
        console.warn("Invalid D3 selection for zoom in");
        return;
      }
      
      svg.transition().call(
        zoomBehaviorRef.current.scaleBy,
        1.5
      );
    } catch (error) {
      console.error("Error during zoom in:", error);
    }
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) {
      console.warn("SVG ref or zoom behavior not available for zoom out");
      return;
    }

    try {
      const svg = d3.select(svgRef.current);
      if (!svg || !svg.node() || typeof svg.transition !== "function") {
        console.warn("Invalid D3 selection for zoom out");
        return;
      }

      svg.transition().call(
        zoomBehaviorRef.current.scaleBy,
        1 / 1.5
      );
    } catch (error) {
      console.error("Error during zoom out:", error);
    }
  };

  const handleReset = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) {
      console.warn("SVG ref or zoom behavior not available for reset");
      return;
    }

    try {
      const svg = d3.select(svgRef.current);
      if (!svg || !svg.node() || typeof svg.transition !== "function") {
        console.warn("Invalid D3 selection for reset");
        return;
      }

      svg.transition().duration(750).call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity
      );
      setTransform(d3.zoomIdentity);
    } catch (error) {
      console.error("Error during reset:", error);
    }
  };

  const toggleSimulation = () => {
    if (!simulation) return;
    
    if (isSimulationRunning) {
      simulation.stop();
      setIsSimulationRunning(false);
    } else {
      simulation.restart();
      setIsSimulationRunning(true);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={toggleSimulation}>
          {isSimulationRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      </div>
      
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full border border-border rounded-lg"
      />
    </div>
  );
}

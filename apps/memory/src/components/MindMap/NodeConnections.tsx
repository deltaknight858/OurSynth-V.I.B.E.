import React from "react";
import { MindMapNode as FlowNode, MindMapConnection } from "@/services/mindMapService";
import { motion } from "framer-motion";
import { getTemplateByType, NodeTemplate } from "./MindMapTemplates";

interface NodeConnectionsProps {
  nodes: FlowNode[];
  selectedNode: string | null;
}

export function NodeConnections({ nodes, selectedNode }: NodeConnectionsProps) {
  const getConnectionStyle = (type: string, isSelected: boolean, fromNodeType?: string, toNodeType?: string) => {
    const fromTemplate = fromNodeType ? getTemplateByType(fromNodeType) : null;
    const toTemplate = toNodeType ? getTemplateByType(toNodeType) : null;
    
    // Use explicit connectionColor from template, or fallback
    const fromColor = fromTemplate?.connectionColor || "var(--primary)";
    const toColor = toTemplate?.connectionColor || "var(--primary)";
    
    switch(type) {
      case "parent":
        return {
          stroke: isSelected ? "var(--primary)" : "var(--border)",
          strokeWidth: isSelected ? 2 : 1,
          strokeDasharray: "none",
          fromColor,
          toColor
        };
      case "sibling":
        return {
          stroke: isSelected ? "var(--primary)" : "var(--muted-foreground)",
          strokeWidth: isSelected ? 2 : 1,
          strokeDasharray: "4 4",
          fromColor,
          toColor
        };
      case "reference":
        return {
          stroke: isSelected ? "var(--primary)" : "var(--muted)",
          strokeWidth: isSelected ? 2 : 1,
          strokeDasharray: "2 4",
          fromColor,
          toColor
        };
      default:
        return {
          stroke: isSelected ? "var(--primary)" : "var(--border)",
          strokeWidth: isSelected ? 2 : 1,
          strokeDasharray: "none",
          fromColor,
          toColor
        };
    }
  };

  const lines: React.ReactNode[] = []; // Explicitly typed
  nodes.forEach((node) => {
    // Ensure node.connections is treated as an array of MindMapConnection
    (node.connections as MindMapConnection[] | undefined)?.forEach((connection: MindMapConnection, index: number) => { // Explicit types
      const sourceNode = nodes.find((n) => n.id === connection.from);
      const targetNode = nodes.find((n) => n.id === connection.to);
      
      if (!sourceNode || !targetNode) return null;
      
      if (sourceNode.position && targetNode && targetNode.position) {
        const sourceTemplate = getTemplateByType(sourceNode.type || "default");
        const targetTemplate = getTemplateByType(targetNode.type || "default");
        
        const strokeColor = selectedNode === sourceNode.id || selectedNode === targetNode.id 
          ? sourceTemplate.connectionColor || "var(--primary)" 
          : targetTemplate.connectionColor || "var(--border)";

        lines.push(
          <line
            key={`${sourceNode.id}-${targetNode.id}-${index}`} // Added index for more unique key
            x1={sourceNode.position.x + (parseInt(sourceTemplate.defaultWidth || "250") / 2)}
            y1={sourceNode.position.y + 50} 
            x2={targetNode.position.x + (parseInt(targetTemplate.defaultWidth || "250") / 2)}
            y2={targetNode.position.y + 50} 
            stroke={strokeColor}
            strokeWidth="2"
          />
        );
      }
    });
  });

  return (
    <svg className="absolute inset-0 pointer-events-none z-0">
      <defs>
        <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {lines}
    </svg>
  );
}

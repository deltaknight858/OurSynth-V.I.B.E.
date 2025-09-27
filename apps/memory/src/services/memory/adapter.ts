// Memory to Visual adapter for D3MindMap integration

import { MemoryNode, MemoryEdge, VisualNode, VisualEdge } from "./types";
import { MindMapNode, MindMapEdge } from "@/services/mindMapService";

/**
 * Converts memory nodes and edges to visual format compatible with D3MindMap
 */
export function toVisual(nodes: MemoryNode[], edges: MemoryEdge[]): {
  visualNodes: MindMapNode[];
  visualEdges: MindMapEdge[];
} {
  // Convert memory nodes to MindMapNode format
  const visualNodes: MindMapNode[] = nodes.map((node) => ({
    id: node.id,
    mindMapId: "memory-graph", // Using a fixed ID for the memory graph context
    noteId: null, // Memory nodes don't directly link to notes
    title: node.title,
    label: node.title,
    content: node.content || null,
    type: node.type,
    position: { x: 0, y: 0 }, // D3 will calculate positions
    linkedNotes: [], // Could be enhanced later
    connections: [], // Will be populated from edges
    createdAt: node.createdAt,
    lastModified: node.updatedAt,
  }));

  // Convert memory edges to MindMapEdge format
  const visualEdges: MindMapEdge[] = edges.map((edge) => ({
    id: edge.id,
    mindMapId: "memory-graph",
    sourceNodeId: edge.sourceId,
    targetNodeId: edge.targetId,
    label: edge.type === "relates_to" ? null : edge.type, // Show label for non-default relationships
  }));

  return { visualNodes, visualEdges };
}

/**
 * Creates a lightweight visual representation for simple rendering
 */
export function toSimpleVisual(nodes: MemoryNode[], edges: MemoryEdge[]): {
  nodes: VisualNode[];
  edges: VisualEdge[];
} {
  const visualNodes: VisualNode[] = nodes.map((node) => ({
    id: node.id,
    title: node.title,
    type: node.type,
    content: node.content,
    template: getNodeTemplate(node.type), // Get appropriate template based on type
  }));

  const visualEdges: VisualEdge[] = edges.map((edge) => ({
    id: edge.id,
    sourceNodeId: edge.sourceId,
    targetNodeId: edge.targetId,
    label: edge.type === "relates_to" ? undefined : edge.type,
  }));

  return { nodes: visualNodes, edges: visualEdges };
}

/**
 * Get appropriate visual template based on memory node type
 */
function getNodeTemplate(nodeType: string) {
  // Basic template configuration for different memory types
  const templates: Record<string, any> = {
    note: {
      color: "#3b82f6", // blue
      shape: "rect",
      icon: "📝",
    },
    conversation: {
      color: "#10b981", // green
      shape: "circle",
      icon: "💬",
    },
    insight: {
      color: "#f59e0b", // yellow
      shape: "diamond",
      icon: "💡",
    },
    task: {
      color: "#ef4444", // red
      shape: "rect",
      icon: "✅",
    },
    default: {
      color: "#6b7280", // gray
      shape: "circle",
      icon: "🔗",
    },
  };

  return templates[nodeType] || templates.default;
}
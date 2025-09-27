import React, { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

import { D3MindMap } from "./D3MindMap";
import { IntelligentInput } from "./IntelligentInput";
import { MindMapSearch } from "./MindMapSearch";
import { LayoutAlgorithms } from "./LayoutAlgorithms";
import { CollaborativeMindMap } from "./CollaborativeMindMap";
import { MaximizeWrapper } from "./MaximizeWrapper";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Share2, Eye, EyeOff, Users, Minimize, Maximize, Trash2, Link2, Unlink2, Network, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

interface MindMapNode {
  id: string;
  mindMapId: string;
  title: string;
  content?: string;
  type?: string;
  position: { x: number; y: number };
  createdAt: Date;
  lastModified: Date;
}

interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

interface MindMapProps {
  initialNodes?: MindMapNode[];
  initialEdges?: MindMapEdge[];
  noteId: string;
  onClose?: () => void;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
  collaborationId?: string;
}

function NodeListPanel({ open, onClose, nodes, onNodeSelect, onNodeEdit, onNodeDelete }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nodes</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">✕</Button>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {nodes.length === 0 && <div className="text-sm text-muted-foreground">No nodes yet.</div>}
          {nodes.map(node => (
            <div key={node.id} className="border rounded p-2 flex items-center justify-between">
              <span className="font-mono text-xs truncate max-w-[120px]" title={node.title || node.id}>
                {node.title || node.id.slice(0, 6)}
              </span>
              <div className="flex gap-1">
                <Button onClick={() => onNodeSelect(node.id)} size="xs" variant="outline">Focus</Button>
                <Button onClick={() => onNodeEdit(node)} size="xs" variant="outline">Edit</Button>
                <Button onClick={() => onNodeDelete(node.id)} size="xs" variant="destructive">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MindMap({
  initialNodes: initialNodesFromProps = [],
  initialEdges: initialEdgesFromProps = [],
  noteId,
  onClose,
  isMaximized,
  onToggleMaximize,
  collaborationId,
}: MindMapProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [nodes, setNodes] = useState<MindMapNode[]>(initialNodesFromProps);
  const [edges, setEdges] = useState<MindMapEdge[]>(initialEdgesFromProps);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<MindMapNode | null>(null);
  const [linkingState, setLinkingState] = useState<{ sourceNodeId: string } | null>(null);
  const [showNodeIds, setShowNodeIds] = useState(false);
  const [isLayoutAlgorithmPanelOpen, setLayoutAlgorithmPanelOpen] = useState(false);
  const [isNodePanelOpen, setNodePanelOpen] = useState(false);

  const mindMapRef = useRef<HTMLDivElement>(null);

  const openNewNodeForm = () => {
    setEditingNode({
      id: `temp-${Date.now()}`,
      mindMapId: noteId,
      title: "",
      content: "",
      type: "default",
      position: { x: 0, y: 0 },
      createdAt: new Date(),
      lastModified: new Date()
    });
  };

  const closeLayoutAlgorithmPanel = () => setLayoutAlgorithmPanelOpen(false);
  const toggleLayoutAlgorithmPanel = () => setLayoutAlgorithmPanelOpen(val => !val);

  const handleNodeClick = (nodeId: string) => setSelectedNodeId(nodeId);
  const handleNodeDrag = (nodeId: string, position: { x: number; y: number }) => {
    setNodes(nodes =>
      nodes.map(node =>
        node.id === nodeId ? { ...node, position } : node
      )
    );
  };

  const handleSaveNode = (node: MindMapNode) => {
    setNodes(nodes =>
      nodes.some(n => n.id === node.id)
        ? nodes.map(n => (n.id === node.id ? node : n))
        : [...nodes, node]
    );
    setEditingNode(null);
  };

  const handleCancelLinking = () => setLinkingState(null);

  const handleExportMindMap = () => {
    // Implement export logic here
    toast({ title: "Export", description: "Export not yet implemented." });
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes => nodes.filter(node => node.id !== nodeId));
    setEdges(edges => edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNodeId(null);
  };

  const handleStartLinking = (nodeId: string) => setLinkingState({ sourceNodeId: nodeId });

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  // Dummy layout algorithm state/handler for demonstration
  const currentLayout = "default";
  const handleApplyLayout = () => {
    // Implement layout logic here
    toast({ title: "Layout", description: "Layout algorithm not yet implemented." });
  };

  return (
    <>
      <NodeListPanel
        open={isNodePanelOpen}
        onClose={() => setNodePanelOpen(false)}
        nodes={nodes}
        onNodeSelect={setSelectedNodeId}
        onNodeEdit={setEditingNode}
        onNodeDelete={handleDeleteNode}
      />
      <MaximizeWrapper isMaximized={isMaximized === true} onToggleMaximize={onToggleMaximize}>
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              {collaborationId && (
                <Badge variant="outline" className="border-green-500 text-green-500">
                  <Users className="h-3 w-3 mr-1" />Live Collab
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={onToggleMaximize}>
                {isMaximized ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              {onClose && !isMaximized && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ✕
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 flex-grow flex flex-col md:flex-row overflow-hidden">
            {/* Controls Panel */}
            <div className="w-full md:w-64 p-3 border-b md:border-b-0 md:border-r bg-muted/40 overflow-y-auto space-y-3">
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">CONTROLS</h3>
              <Button onClick={openNewNodeForm} size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" /> Add Node
              </Button>
              <Button onClick={() => setNodePanelOpen(true)} size="sm" className="w-full justify-start">
                <List className="h-4 w-4 mr-2" /> Node List
              </Button>
              <Button onClick={toggleLayoutAlgorithmPanel} size="sm" className="w-full justify-start">
                <Network className="h-4 w-4 mr-2" /> Apply Layout
              </Button>
              <Button onClick={() => setShowNodeIds(!showNodeIds)} size="sm" className="w-full justify-start">
                {showNodeIds ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />} Toggle IDs
              </Button>
              <MindMapSearch onNodeSelect={handleNodeClick} />
              <h3 className="text-sm font-semibold pt-2 mt-2 border-t text-muted-foreground">ACTIONS</h3>
              <Button onClick={handleExportMindMap} size="sm" variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" /> Export JSON
              </Button>
              {selectedNode && (
                <>
                  <Button onClick={() => setEditingNode(selectedNode)} size="sm" variant="outline" className="w-full justify-start">
                    Edit Node
                  </Button>
                  <Button onClick={() => handleDeleteNode(selectedNode.id)} size="sm" variant="destructive" className="w-full justify-start">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Node
                  </Button>
                  <Button onClick={() => handleStartLinking(selectedNode.id)} size="sm" variant="outline" className="w-full justify-start" disabled={!!linkingState}>
                    <Link2 className="h-4 w-4 mr-2" /> Create Link
                  </Button>
                  {linkingState && (
                    <Button onClick={handleCancelLinking} size="sm" variant="outline" className="w-full justify-start">
                      <Unlink2 className="h-4 w-4 mr-2" /> Cancel Link
                    </Button>
                  )}
                </>
              )}
              <Button onClick={() => navigator.clipboard.writeText(collaborationId || "")} size="sm" className="w-full justify-start" disabled={!collaborationId}>
                <Share2 className="h-4 w-4 mr-2" /> Copy Collab ID
              </Button>
            </div>

            {/* Mind Map Area */}
            <div ref={mindMapRef} className="flex-grow relative bg-background overflow-hidden">
              {collaborationId && user ? (
                <CollaborativeMindMap
                  collaborationId={collaborationId}
                  userId={user.id}
                  initialNodes={nodes}
                  initialEdges={edges}
                  onNodeClick={handleNodeClick}
                  onNodeDrag={handleNodeDrag}
                  selectedNodeId={selectedNodeId}
                />
              ) : (
                <D3MindMap
                  nodes={nodes}
                  edges={edges}
                  onNodeClick={handleNodeClick}
                  onNodeDrag={handleNodeDrag}
                  selectedNodeId={selectedNodeId}
                  showNodeIds={showNodeIds}
                />
              )}

              {/* Show node IDs overlay */}
              {showNodeIds && (
                <div className="absolute top-0 right-0 p-2 bg-background/80 rounded">
                  {nodes.map(node => (
                    <div key={node.id} className="text-xs text-muted-foreground">
                      {node.id.substring(0, 6)}
                    </div>
                  ))}
                </div>
              )}

              {/* Node edit form */}
              {editingNode && (
                <IntelligentInput
                  onClose={() => setEditingNode(null)}
                  onSave={handleSaveNode}
                  nodeData={editingNode}
                  existingNodes={nodes.map(n => ({
                    id: n.id,
                    title: n.title,
                    content: n.content || "",
                    type: n.type || "default"
                  }))}
                />
              )}

              <LayoutAlgorithms
                nodes={nodes}
                onApplyLayout={handleApplyLayout}
                currentLayout={currentLayout}
                isOpen={isLayoutAlgorithmPanelOpen}
                onClose={closeLayoutAlgorithmPanel}
              />
            </div>
          </CardContent>
        </Card>
      </MaximizeWrapper>
    </>
  );
}
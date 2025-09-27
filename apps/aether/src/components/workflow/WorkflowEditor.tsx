
import { useState, useCallback, DragEvent } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  addEdge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, ZoomIn, ZoomOut, Undo, Redo } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import type { WorkflowNode, WorkflowConnection } from "@/types/database";
import { v4 as uuidv4 } from "uuid";
import { NodeConfigPanel } from "./NodeConfigPanel";

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowEditorProps {
  workflowId?: string;
  initialNodes?: WorkflowNode[];
  initialConnections?: WorkflowConnection[];
  onSave?: (nodes: WorkflowNode[], connections: WorkflowConnection[]) => Promise<void>;
}

export function WorkflowEditor({
  workflowId = crypto.randomUUID(),
  initialNodes = [],
  initialConnections = [],
  onSave
}: WorkflowEditorProps) {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<Node[]>(initialNodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data
  })));
  const [edges, setEdges] = useState<Edge[]>(initialConnections.map(conn => ({
    id: conn.id,
    source: conn.sourceNodeId,
    target: conn.targetNodeId,
    sourceHandle: conn.sourceHandle,
    targetHandle: conn.targetHandle,
    label: conn.label || undefined
  })));
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [history, setHistory] = useState<WorkflowState[]>([{ nodes, edges }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { zoomIn: flowZoomIn, zoomOut: flowZoomOut, fitView } = useReactFlow();

  const handleZoomIn = () => {
    flowZoomIn();
  };

  const handleZoomOut = () => {
    flowZoomOut();
  };

  const addToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, { nodes: newNodes, edges: newEdges }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { nodes: prevNodes, edges: prevEdges } = history[newIndex];
      setNodes(prevNodes);
      setEdges(prevEdges);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { nodes: nextNodes, edges: nextEdges } = history[newIndex];
      setNodes(nextNodes);
      setEdges(nextEdges);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      try {
        const newNodes = applyNodeChanges(changes, nodes);
        setNodes(newNodes);
        addToHistory(newNodes, edges);
      } catch (error) {
        setError("Failed to update nodes");
        console.error("Node change error:", error);
      }
    },
    [nodes, edges, addToHistory]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      try {
        const newEdges = applyEdgeChanges(changes, edges);
        setEdges(newEdges);
        addToHistory(nodes, newEdges);
      } catch (error) {
        setError("Failed to update connections");
        console.error("Edge change error:", error);
      }
    },
    [nodes, edges, addToHistory]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      try {
        const newEdges = addEdge({ ...params, animated: true }, edges);
        setEdges(newEdges);
        addToHistory(nodes, newEdges);
      } catch (error) {
        setError("Failed to connect nodes");
        console.error("Connection error:", error);
      }
    },
    [nodes, edges, addToHistory]
  );

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      try {
        const nodeType = event.dataTransfer.getData("application/reactflow");
        if (!nodeType) return;

        const type = JSON.parse(nodeType);
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY
        });

        const newNode: Node = {
          id: uuidv4(),
          type: type.type,
          position,
          data: {
            label: type.label,
            description: type.description,
            configuration: {}
          }
        };

        const newNodes = [...nodes, newNode];
        setNodes(newNodes);
        addToHistory(newNodes, edges);
      } catch (error) {
        setError("Failed to add new node");
        console.error("Drop error:", error);
      }
    },
    [reactFlowInstance, nodes, edges, addToHistory]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleConfigChange = useCallback((nodeId: string, config: Record<string, any>) => {
    try {
      setNodes(nds => {
        const newNodes = nds.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                configuration: config
              }
            };
          }
          return node;
        });
        addToHistory(newNodes, edges);
        return newNodes;
      });
    } catch (error) {
      setError("Failed to update node configuration");
      console.error("Config change error:", error);
    }
  }, [edges, addToHistory]);

  const handleSave = async () => {
    if (!onSave) return;

    try {
      setSaving(true);
      setError(null);

      const workflowNodes: WorkflowNode[] = nodes.map(node => ({
        id: node.id,
        type: node.type as WorkflowNode["type"],
        position: node.position,
        data: node.data,
        inputs: {},
        outputs: {}
      }));

      const workflowConnections: WorkflowConnection[] = edges.map(edge => ({
        id: edge.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        sourceHandle: edge.sourceHandle || "",
        targetHandle: edge.targetHandle || "",
        label: edge.label?.toString()
      }));

      await onSave(workflowNodes, workflowConnections);
      toast({
        title: "Success",
        description: "Workflow saved successfully",
      });
    } catch (error) {
      setError("Failed to save workflow");
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={undo}
            disabled={historyIndex === 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={redo}
            disabled={historyIndex === history.length - 1}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mx-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="flex-1">
        <Tabs defaultValue="editor" className="h-full">
          <TabsList className="px-4 pt-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={handleNodeClick}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </TabsContent>
          <TabsContent value="preview">
            <div className="p-4">
              <p>Workflow preview coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      <NodeConfigPanel 
        selectedNode={selectedNode}
        onConfigChange={handleConfigChange}
        workflowId={workflowId}
      />
    </div>
  );
}

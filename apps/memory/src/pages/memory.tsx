import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { D3MindMap } from "@/components/MindMap/D3MindMap";
import { toVisual } from "@/services/memory/adapter";
import { MemoryGraphResponse } from "@/services/memory/types";
import { Loader2, Brain, RefreshCw } from "lucide-react";

export default function MemoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [memoryData, setMemoryData] = useState<MemoryGraphResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemoryGraph = async () => {
    try {
      setError(null);
      const response = await fetch("/api/memory/graph");
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth");
          return;
        }
        throw new Error("Failed to fetch memory graph");
      }
      
      const data: MemoryGraphResponse = await response.json();
      setMemoryData(data);
    } catch (err) {
      console.error("Error fetching memory graph:", err);
      setError("Failed to load your memory graph. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchMemoryGraph();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const handleRefresh = () => {
    setLoading(true);
    fetchMemoryGraph();
  };

  const handleNodeClick = (nodeId: string) => {
    console.log("Memory node clicked:", nodeId);
    // Could navigate to node details or expand node info
  };

  const handleNodeDrag = (nodeId: string, position: { x: number; y: number }) => {
    // For now, just log the drag - could save position to preferences later
    console.log("Memory node dragged:", nodeId, position);
  };

  // Show loading spinner during initial auth check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Memory Graph</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Sign in to view and explore your personal memory graph, where your notes, 
              conversations, and insights are connected in meaningful ways.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => router.push("/auth")}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Continue Exploring
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Convert memory data to visual format for D3MindMap
  const visualData = memoryData ? toVisual(memoryData.nodes, memoryData.edges) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Memory Graph
          </h1>
          <p className="text-muted-foreground mt-1">
            Your personal knowledge network
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="h-[600px]">
        <CardContent className="p-0 h-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading your memory graph...</p>
              </div>
            </div>
          ) : !memoryData || memoryData.nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No memories yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your memory graph is empty. Start by creating notes, having conversations, 
                  or importing your existing content to see connections form.
                </p>
                <Button onClick={() => router.push("/")}>
                  Start Creating
                </Button>
              </div>
            </div>
          ) : visualData ? (
            <div className="h-full">
              <D3MindMap
                nodes={visualData.visualNodes}
                edges={visualData.visualEdges}
                onNodeClick={handleNodeClick}
                onNodeDrag={handleNodeDrag}
                selectedNodeId={null}
                width={800}
                height={600}
                layoutType="force"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
      
      {memoryData && memoryData.nodes.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          {memoryData.nodes.length} memory nodes • {memoryData.edges.length} connections
        </div>
      )}
    </div>
  );
}
import { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { MemoryNode, MemoryEdge, MemoryGraphResponse } from "@/services/memory/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => req.cookies[name],
          set: () => {},
          remove: () => {},
        },
      }
    );

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get query parameters for optional filtering
    const { type, conversationId } = req.query;

    // Build nodes query
    let nodesQuery = supabase
      .from("memory_nodes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Add filters if provided
    if (type && typeof type === "string") {
      nodesQuery = nodesQuery.eq("type", type);
    }

    if (conversationId && typeof conversationId === "string") {
      nodesQuery = nodesQuery.eq("conversation_id", conversationId);
    }

    // Fetch nodes
    const { data: nodesData, error: nodesError } = await nodesQuery;

    if (nodesError) {
      console.error("Error fetching memory nodes:", nodesError);
      return res.status(500).json({ error: "Failed to fetch memory nodes" });
    }

    // Convert nodes to MemoryNode format
    const memoryNodes: MemoryNode[] = nodesData.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      type: row.type,
      sourceApp: row.source_app,
      conversationId: row.conversation_id,
      messageId: row.message_id,
      importance: row.importance,
      metadata: row.metadata || {},
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    // If no nodes, return early with empty edges
    if (memoryNodes.length === 0) {
      return res.status(200).json({ nodes: [], edges: [] } as MemoryGraphResponse);
    }

    // Fetch edges for these nodes
    const nodeIds = memoryNodes.map((node) => node.id);
    const { data: edgesData, error: edgesError } = await supabase
      .from("memory_edges")
      .select("*")
      .in("source_id", nodeIds)
      .in("target_id", nodeIds)
      .order("created_at", { ascending: false });

    if (edgesError) {
      console.error("Error fetching memory edges:", edgesError);
      return res.status(500).json({ error: "Failed to fetch memory edges" });
    }

    // Convert edges to MemoryEdge format
    const memoryEdges: MemoryEdge[] = edgesData.map((row) => ({
      id: row.id,
      sourceId: row.source_id,
      targetId: row.target_id,
      type: row.type,
      weight: row.weight,
      metadata: row.metadata || {},
      createdAt: new Date(row.created_at),
    }));

    const response: MemoryGraphResponse = {
      nodes: memoryNodes,
      edges: memoryEdges,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Graph API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
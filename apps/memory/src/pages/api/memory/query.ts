import { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { QueryMemoryRequest, MemoryNode } from "@/services/memory/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
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

    const { q, type, conversationId, limit = 20 }: QueryMemoryRequest = req.body;

    // Build query
    let query = supabase
      .from("memory_nodes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(Math.min(100, Math.max(1, limit))); // Clamp limit between 1-100

    // Add filters
    if (type) {
      query = query.eq("type", type);
    }

    if (conversationId) {
      query = query.eq("conversation_id", conversationId);
    }

    // Add text search if query provided
    if (q && q.trim()) {
      // Use full-text search on title and content
      const searchTerm = q.trim().replace(/'/g, "''"); // Escape single quotes
      query = query.or(
        `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error querying memory nodes:", error);
      return res.status(500).json({ error: "Failed to query memory nodes" });
    }

    // Convert database format to MemoryNode format
    const memoryNodes: MemoryNode[] = data.map((row) => ({
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

    return res.status(200).json({ nodes: memoryNodes });
  } catch (error) {
    console.error("Query API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
import { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { LinkMemoryRequest } from "@/services/memory/types";

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

    const {
      sourceId,
      targetId,
      type = "relates_to",
      weight = 1.0,
      metadata = {},
    }: LinkMemoryRequest = req.body;

    // Validate required fields
    if (!sourceId || !targetId) {
      return res.status(400).json({ error: "sourceId and targetId are required" });
    }

    if (sourceId === targetId) {
      return res.status(400).json({ error: "Cannot create self-referencing edge" });
    }

    // Verify both nodes belong to the user (RLS will also enforce this)
    const { data: sourceNode, error: sourceError } = await supabase
      .from("memory_nodes")
      .select("id")
      .eq("id", sourceId)
      .eq("user_id", user.id)
      .single();

    if (sourceError || !sourceNode) {
      return res.status(404).json({ error: "Source node not found" });
    }

    const { data: targetNode, error: targetError } = await supabase
      .from("memory_nodes")
      .select("id")
      .eq("id", targetId)
      .eq("user_id", user.id)
      .single();

    if (targetError || !targetNode) {
      return res.status(404).json({ error: "Target node not found" });
    }

    // Create the edge
    const { data, error } = await supabase
      .from("memory_edges")
      .insert({
        source_id: sourceId,
        target_id: targetId,
        type,
        weight: Math.max(0, Math.min(1, weight)), // Clamp between 0-1
        metadata,
      })
      .select("id")
      .single();

    if (error) {
      // Check if it's a duplicate edge error
      if (error.code === "23505") {
        return res.status(409).json({ error: "Edge already exists" });
      }
      console.error("Error creating memory edge:", error);
      return res.status(500).json({ error: "Failed to create memory edge" });
    }

    return res.status(201).json({ id: data.id });
  } catch (error) {
    console.error("Link API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
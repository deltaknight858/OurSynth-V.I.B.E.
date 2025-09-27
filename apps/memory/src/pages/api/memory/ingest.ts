import { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";
import { IngestMemoryRequest } from "@/services/memory/types";

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
          set: () => {}, // Not used in API routes
          remove: () => {}, // Not used in API routes
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

    // Validate request body
    const {
      title,
      content,
      type = "note",
      sourceApp,
      conversationId,
      messageId,
      importance = 1,
      metadata = {},
    }: IngestMemoryRequest = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required" });
    }

    // Insert memory node
    const { data, error } = await supabase
      .from("memory_nodes")
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content?.trim() || null,
        type,
        source_app: sourceApp || null,
        conversation_id: conversationId || null,
        message_id: messageId || null,
        importance: Math.max(1, Math.min(10, importance)), // Clamp between 1-10
        metadata,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error inserting memory node:", error);
      return res.status(500).json({ error: "Failed to create memory node" });
    }

    return res.status(201).json({ id: data.id });
  } catch (error) {
    console.error("Ingest API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
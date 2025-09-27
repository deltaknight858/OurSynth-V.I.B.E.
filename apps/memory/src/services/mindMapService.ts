
import { supabase } from "@/lib/supabase/client";

export interface MindMap {
  id: string;
  userId: string;
  notebookId?: string | null;
  title: string;
  createdAt: Date;
  lastModified: Date;
}

export interface MindMapConnection {
  from: string;
  to: string;
  type?: string;
  label?: string;
}

export interface MindMapNode {
  id: string;
  mindMapId: string;
  noteId?: string | null;
  title: string;
  label?: string;
  content?: string | null;
  type?: string;
  position: { x: number; y: number };
  linkedNotes?: string[];
  connections?: MindMapConnection[];
  createdAt: Date;
  lastModified: Date;
}

export interface MindMapEdge {
  id: string;
  mindMapId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string | null;
}

function handleError(context: string, error: any) {
  console.error(`[mindMapService] ${context}`, error);
  throw new Error(typeof error === "string" ? error : error?.message || "Unknown error occurred");
}

export const mindMapService = {
  async createMindMap(mindMapData: Omit<MindMap, "id" | "createdAt" | "lastModified">): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("mind_maps")
        .insert({
          ...mindMapData,
          created_at: new Date().toISOString(),
          last_modified: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error) handleError("createMindMap failed", error);
      if (!data?.id) throw new Error("No mind map ID returned from database");
      return data.id;
    } catch (err: any) {
      handleError("createMindMap exception", err);
      throw err;
    }
  },

  async getMindMap(mindMapId: string): Promise<MindMap | null> {
    try {
      const { data, error } = await supabase
        .from("mind_maps")
        .select("*")
        .eq("id", mindMapId)
        .single();
      if (error) handleError("getMindMap failed", error);
      if (!data) return null;
      return {
        id: data.id,
        userId: data.user_id,
        notebookId: data.notebook_id,
        title: data.title,
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        lastModified: data.last_modified ? new Date(data.last_modified) : new Date(),
      };
    } catch (err: any) {
      handleError("getMindMap exception", err);
      return null;
    }
  },

  async getMindMapByNotebook(notebookId: string): Promise<MindMap | null> {
    try {
      const { data, error } = await supabase
        .from("mind_maps")
        .select("*")
        .eq("notebook_id", notebookId)
        .single();
      if (error) handleError("getMindMapByNotebook failed", error);
      if (!data) return null;
      return {
        id: data.id,
        userId: data.user_id,
        notebookId: data.notebook_id,
        title: data.title,
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        lastModified: data.last_modified ? new Date(data.last_modified) : new Date(),
      };
    } catch (err: any) {
      handleError("getMindMapByNotebook exception", err);
      return null;
    }
  },

  async createNode(nodeData: Omit<MindMapNode, "id" | "createdAt" | "lastModified">): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("mind_map_nodes")
        .insert({
          ...nodeData,
          created_at: new Date().toISOString(),
          last_modified: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error) handleError("createNode failed", error);
      if (!data?.id) throw new Error("No node ID returned from database");
      return data.id;
    } catch (err: any) {
      handleError("createNode exception", err);
      throw err;
    }
  },

  async getNodes(mindMapId: string): Promise<MindMapNode[]> {
    try {
      const { data, error } = await supabase
        .from("mind_map_nodes")
        .select("*")
        .eq("mind_map_id", mindMapId);
      if (error) handleError("getNodes failed", error);
      return (
        data?.map((n) => ({
          id: n.id,
          mindMapId: n.mind_map_id,
          noteId: n.note_id,
          title: n.title,
          label: n.label,
          content: n.content,
          type: n.type,
          position: n.position,
          linkedNotes: n.linked_notes,
          connections: n.connections,
          createdAt: n.created_at ? new Date(n.created_at) : new Date(),
          lastModified: n.last_modified ? new Date(n.last_modified) : new Date(),
        })) || []
      );
    } catch (err: any) {
      handleError("getNodes exception", err);
      return [];
    }
  },

  async updateNodePosition(nodeId: string, position: { x: number; y: number }): Promise<void> {
    try {
      const { error } = await supabase
        .from("mind_map_nodes")
        .update({
          position,
          last_modified: new Date().toISOString(),
        })
        .eq("id", nodeId);
      if (error) handleError("updateNodePosition failed", error);
    } catch (err: any) {
      handleError("updateNodePosition exception", err);
    }
  },

  async exportAsImageFromElement(element: HTMLElement): Promise<string> {
    try {
      // This is a placeholder implementation
      // In a real app, you'd use html2canvas or similar library
      return "data:image/png;base64,placeholder";
    } catch (err: any) {
      handleError("exportAsImageFromElement exception", err);
      return "";
    }
  },

  async createEdge(edgeData: Omit<MindMapEdge, "id">): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("mind_map_edges")
        .insert(edgeData)
        .select("id")
        .single();
      if (error) handleError("createEdge failed", error);
      if (!data?.id) throw new Error("No edge ID returned from database");
      return data.id;
    } catch (err: any) {
      handleError("createEdge exception", err);
      throw err;
    }
  },

  async getEdges(mindMapId: string): Promise<MindMapEdge[]> {
    try {
      const { data, error } = await supabase
        .from("mind_map_edges")
        .select("*")
        .eq("mind_map_id", mindMapId);
      if (error) handleError("getEdges failed", error);
      return (
        data?.map((e) => ({
          id: e.id,
          mindMapId: e.mind_map_id,
          sourceNodeId: e.source_node_id,
          targetNodeId: e.target_node_id,
          label: e.label,
        })) || []
      );
    } catch (err: any) {
      handleError("getEdges exception", err);
      return [];
    }
  },
};

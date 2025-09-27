import { supabase } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

// Define the structure for a MindMap (the container for nodes and edges)
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

export interface CollaborationSession {
  id: string;
  // noteId: string; // Assuming mindMapId is used for collaboration sessions
  mindMapId: string; // Changed from noteId to mindMapId
  userId: string;
  userName?: string;
  isActive: boolean;
  lastActivity: Date;
  cursor?: { x: number; y: number }; // Changed cursor type
}

// Define ChatMessage interface if not already defined (it's used in CollaborativeMindMap.tsx)
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: "message" | "system" | "node_reference";
  nodeId?: string;
}

// Define UserData for onUserJoined callback
export interface UserData {
  userId: string;
  userName: string;
  avatar?: string;
}

// Define Callbacks interface for subscribeToUpdates
interface CollaborationCallbacks {
  onUserJoined: (userData: UserData) => void;
  onUserLeft: (userId: string) => void;
  onCursorMove: (userId: string, position: { x: number; y: number }) => void;
  onNodeEdit: (userId: string, nodeId: string) => void;
  onChatMessage: (message: ChatMessage) => void;
}

// Utility for error handling/logging
function handleError(context: string, error: any) {
  console.error(`[collaborationService] ${context}`, error);
  throw new Error(typeof error === "string" ? error : error?.message || "Unknown error occurred");
}

export const collaborationService = {
  // == Collaboration Operations ==
  async createSession(sessionData: Omit<CollaborationSession, "id" | "lastActivity">): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("collaboration_sessions")
        .insert({
          ...sessionData,
          last_activity: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error) handleError("createSession failed", error);
      if (!data?.id) throw new Error("No session ID returned from database");
      return data.id;
    } catch (err: any) {
      handleError("createSession exception", err);
      throw err;
    }
  },

  async getActiveSessions(mindMapId: string): Promise<CollaborationSession[]> { // Changed noteId to mindMapId
    try {
      const { data, error } = await supabase
        .from("collaboration_sessions")
        .select("*")
        .eq("mind_map_id", mindMapId) // Changed from note_id
        .eq("is_active", true);
      if (error) handleError("getActiveSessions failed", error);
      return (
        data?.map((session) => ({
          id: session.id,
          mindMapId: session.mind_map_id, // Changed from note_id
          userId: session.user_id,
          isActive: session.is_active,
          lastActivity: session.last_activity ? new Date(session.last_activity) : new Date(),
          cursor: session.cursor,
        })) || []
      );
    } catch (err: any) {
      handleError("getActiveSessions exception", err);
      return [];
    }
  },

  async joinSession(mindMapId: string, userDetails: { userId: string; userName: string; avatar?: string; }): Promise<void> {
    try {
      // Placeholder: In a real app, this would update or create a session record
      // and potentially use Supabase Realtime to announce the user joining.
      console.log(`User ${userDetails.userName} joining session for mind map ${mindMapId}`);
      // Example: Upsert session
      const { error } = await supabase
        .from("collaboration_sessions")
        .upsert({
          mind_map_id: mindMapId,
          user_id: userDetails.userId,
          user_name: userDetails.userName,
          avatar_url: userDetails.avatar,
          is_active: true,
          last_activity: new Date().toISOString(),
        }, { onConflict: "mind_map_id, user_id" });

      if (error) handleError("joinSession failed", error);
    } catch (err: any) {
      handleError("joinSession exception", err);
    }
  },

  async subscribeToUpdates(mindMapId: string, callbacks: CollaborationCallbacks): Promise<() => void> {
    try {
      // Placeholder: This would set up Supabase Realtime subscriptions.
      console.log(`Subscribing to updates for mind map ${mindMapId}`);
      const channel: RealtimeChannel = supabase.channel(`mindmap-${mindMapId}`);
      
      channel
        .on("presence", { event: "join" }, ({ newPresences }) => {
          newPresences.forEach(presence => {
            if (presence.user_id && presence.user_name) {
              callbacks.onUserJoined({ userId: presence.user_id, userName: presence.user_name, avatar: presence.avatar_url });
            }
          });
        })
        .on("presence", { event: "leave" }, ({ leftPresences }) => {
          leftPresences.forEach(presence => {
            if (presence.user_id) {
              callbacks.onUserLeft(presence.user_id);
            }
          });
        })
        .on("broadcast", { event: "cursor_move" }, ({ payload }) => {
          callbacks.onCursorMove(payload.userId, payload.position);
        })
        .on("broadcast", { event: "node_edit_start" }, ({ payload }) => {
          callbacks.onNodeEdit(payload.userId, payload.nodeId);
        })
        .on("broadcast", { event: "node_edit_stop" }, ({ payload }) => {
          callbacks.onNodeEdit(payload.userId, ""); // Empty nodeId to signify stop
        })
        .on("broadcast", { event: "chat_message" }, ({ payload }) => {
          callbacks.onChatMessage(payload.message);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            // await channel.track({ user_id: "current_user_id", user_name: "Current User" }); // Track current user
          }
        });

      return async () => {
        console.log(`Unsubscribing from updates for mind map ${mindMapId}`);
        await supabase.removeChannel(channel);
      };
    } catch (err: any) {
      handleError("subscribeToUpdates exception", err);
      return () => {}; // Return an empty unsubscribe function on error
    }
  },

  async leaveSession(mindMapId: string, userId: string): Promise<void> {
    try {
      // Placeholder: Update session to inactive or remove it.
      console.log(`User ${userId} leaving session for mind map ${mindMapId}`);
      const { error } = await supabase
        .from("collaboration_sessions")
        .update({ is_active: false, last_activity: new Date().toISOString() })
        .eq("mind_map_id", mindMapId)
        .eq("user_id", userId);
      if (error) handleError("leaveSession failed", error);
    } catch (err: any) {
      handleError("leaveSession exception", err);
    }
  },

  async sendChatMessage(mindMapId: string, message: Omit<ChatMessage, "id" | "timestamp"> & { timestamp?: Date }): Promise<void> {
    try {
      // Placeholder: Save chat message to DB and broadcast via Realtime.
      const fullMessage: ChatMessage = {
        ...message,
        id: crypto.randomUUID(), // Generate an ID
        timestamp: message.timestamp || new Date(),
      };
      console.log(`Sending chat message for mind map ${mindMapId}:`, fullMessage);
      // Example: Insert into a chat_messages table and broadcast
      const { error: dbError } = await supabase.from("chat_messages").insert({
        mind_map_id: mindMapId,
        user_id: fullMessage.userId,
        user_name: fullMessage.userName,
        content: fullMessage.content,
        type: fullMessage.type,
        node_id: fullMessage.nodeId,
        timestamp: fullMessage.timestamp.toISOString(),
      });
      if (dbError) handleError("sendChatMessage DB insert failed", dbError);

      const channel = supabase.channel(`mindmap-${mindMapId}`);
      await channel.send({
        type: "broadcast",
        event: "chat_message",
        payload: { message: fullMessage },
      });

    } catch (err: any) {
      handleError("sendChatMessage exception", err);
    }
  },

  async shareMindMap(mindMapId: string, email: string, role: string): Promise<void> {
    try {
      // Placeholder: Add user to mind map permissions.
      console.log(`Sharing mind map ${mindMapId} with ${email} as ${role}`);
      // Example: Insert into a mind_map_shares table
      // This would require knowing the userId for the given email.
      // For simplicity, we'll assume this logic is handled elsewhere or this is a conceptual share.
    } catch (err: any) {
      handleError("shareMindMap exception", err);
    }
  },

  async updateCursor(mindMapId: string, userId: string, position: { x: number; y: number }): Promise<void> {
    try {
      // Placeholder: Broadcast cursor update via Realtime.
      // console.log(`Updating cursor for user ${userId} in mind map ${mindMapId} to`, position);
      const channel = supabase.channel(`mindmap-${mindMapId}`);
      await channel.send({
        type: "broadcast",
        event: "cursor_move",
        payload: { userId, position },
      });
    } catch (err: any) {
      handleError("updateCursor exception", err);
    }
  },

  // == MindMap Operations ==
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

  // == MindMapNode Operations ==
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

  // == MindMapEdge Operations ==
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

// Export the service as both named export and default
export default collaborationService;

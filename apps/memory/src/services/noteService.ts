import { supabase } from "@/lib/supabase/client";

export interface Attachment {
  id?: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize?: number;
  createdAt?: Date;
}

export interface Note {
  id?: string;
  title: string;
  content: string;
  userId: string;
  notebookId: string;
  isPinned?: boolean;
  tags?: string[];
  category?: string;
  attachments?: Attachment[];
  createdAt?: Date;
  lastModified?: Date;
  archivedAt?: Date | null;
}

// Utility for error handling/logging
function handleError(context: string, error: any) {
  console.error(`[noteService] ${context}`, error);
  throw new Error(typeof error === "string" ? error : error?.message || "Unknown error occurred");
}

export const noteService = {
  createNote: async (
    note: Omit<Note, "id" | "createdAt" | "lastModified">
  ): Promise<string> => {
    try {
      const noteData = {
        user_id: note.userId,
        notebook_id: note.notebookId,
        title: note.title || "Untitled Note",
        content: note.content || "",
        is_pinned: note.isPinned || false,
        category: note.category || null,
        tags: note.tags || [],
        attachments: note.attachments || [],
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        archived_at: null,
      };

      const { data, error } = await supabase
        .from("notes")
        .insert(noteData)
        .select("id")
        .single();

      if (error) handleError("createNote failed", error);

      if (!data?.id) throw new Error("No note ID returned from database");

      return data.id;
    } catch (err: any) {
      handleError("createNote exception", err);
      throw err;
    }
  },

  updateNote: async (
    noteId: string,
    updates: Partial<Omit<Note, "id" | "createdAt" | "lastModified">>
  ): Promise<void> => {
    try {
      const updateData: any = {
        last_modified: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.isPinned !== undefined) updateData.is_pinned = updates.isPinned;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.attachments !== undefined) updateData.attachments = updates.attachments;
      if (updates.archivedAt !== undefined) updateData.archived_at = updates.archivedAt;

      const { error } = await supabase
        .from("notes")
        .update(updateData)
        .eq("id", noteId);

      if (error) handleError("updateNote failed", error);
    } catch (err: any) {
      handleError("updateNote exception", err);
    }
  },

  deleteNote: async (noteId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId);

      if (error) handleError("deleteNote failed", error);
    } catch (err: any) {
      handleError("deleteNote exception", err);
    }
  },

  getNote: async (noteId: string): Promise<Note | null> => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (error) handleError("getNote failed", error);

      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        userId: data.user_id,
        notebookId: data.notebook_id,
        isPinned: data.is_pinned,
        tags: data.tags,
        category: data.category,
        attachments: data.attachments,
        createdAt: data.created_at ? new Date(data.created_at) : undefined,
        lastModified: data.last_modified ? new Date(data.last_modified) : undefined,
        archivedAt: data.archived_at ? new Date(data.archived_at) : null,
      };
    } catch (err: any) {
      handleError("getNote exception", err);
      return null;
    }
  },

  getNotesByNotebook: async (notebookId: string): Promise<Note[]> => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("notebook_id", notebookId);

      if (error) handleError("getNotesByNotebook failed", error);

      return (
        data?.map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          userId: note.user_id,
          notebookId: note.notebook_id,
          isPinned: note.is_pinned,
          tags: note.tags,
          category: note.category,
          attachments: note.attachments,
          createdAt: note.created_at ? new Date(note.created_at) : undefined,
          lastModified: note.last_modified ? new Date(note.last_modified) : undefined,
          archivedAt: note.archived_at ? new Date(note.archived_at) : null,
        })) || []
      );
    } catch (err: any) {
      handleError("getNotesByNotebook exception", err);
      return [];
    }
  },

  toggleNotePin: async (noteId: string): Promise<void> => {
    try {
      // First get the current pin status
      const { data: currentNote, error: fetchError } = await supabase
        .from("notes")
        .select("is_pinned")
        .eq("id", noteId)
        .single();

      if (fetchError) handleError("toggleNotePin fetch failed", fetchError);

      // Toggle the pin status
      const { error } = await supabase
        .from("notes")
        .update({
          is_pinned: !currentNote?.is_pinned,
          last_modified: new Date().toISOString(),
        })
        .eq("id", noteId);

      if (error) handleError("toggleNotePin update failed", error);
    } catch (err: any) {
      handleError("toggleNotePin exception", err);
    }
  },

  getUserNotes: async (userId: string): Promise<Note[]> => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) handleError("getUserNotes failed", error);

      return (
        data?.map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          userId: note.user_id,
          notebookId: note.notebook_id,
          isPinned: note.is_pinned,
          tags: note.tags,
          category: note.category,
          attachments: note.attachments,
          createdAt: note.created_at ? new Date(note.created_at) : undefined,
          lastModified: note.last_modified ? new Date(note.last_modified) : undefined,
          archivedAt: note.archived_at ? new Date(note.archived_at) : null,
        })) || []
      );
    } catch (err: any) {
      handleError("getUserNotes exception", err);
      return [];
    }
  },
};

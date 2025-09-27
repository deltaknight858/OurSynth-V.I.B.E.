import { supabase } from "@/lib/supabase/client";

export interface Notebook {
  id?: string;
  title: string;
  description?: string;
  userId: string;
  color?: string;
  createdAt?: Date;
  lastModified?: Date;
}

// Utility for error handling/logging
function handleError(context: string, error: any) {
  console.error(`[notebookService] ${context}`, error);
  throw new Error(typeof error === "string" ? error : error?.message || "Unknown error occurred");
}

export const notebookService = {
  createNotebook: async (
    notebook: Omit<Notebook, "id" | "createdAt" | "lastModified">
  ): Promise<string> => {
    try {
      const notebookData = {
        user_id: notebook.userId,
        title: notebook.title,
        description: notebook.description || null,
        color: notebook.color || "#14B8A6",
        is_quick_notes_notebook: notebook.title === "Quick Notes",
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("notebooks")
        .insert(notebookData)
        .select("id")
        .single();

      if (error) handleError("createNotebook failed", error);

      if (!data?.id) throw new Error("No notebook ID returned from database");

      return data.id;
    } catch (err: any) {
      handleError("createNotebook exception", err);
      throw err;
    }
  },

  updateNotebook: async (
    notebookId: string,
    updates: Partial<Omit<Notebook, "id" | "createdAt" | "lastModified">>
  ): Promise<void> => {
    try {
      const updateData: any = {
        last_modified: new Date().toISOString(),
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.color) updateData.color = updates.color;

      const { error } = await supabase
        .from("notebooks")
        .update(updateData)
        .eq("id", notebookId);

      if (error) handleError("updateNotebook failed", error);
    } catch (err: any) {
      handleError("updateNotebook exception", err);
    }
  },

  deleteNotebook: async (notebookId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("notebooks")
        .delete()
        .eq("id", notebookId);

      if (error) handleError("deleteNotebook failed", error);
    } catch (err: any) {
      handleError("deleteNotebook exception", err);
    }
  },

  getNotebook: async (notebookId: string): Promise<Notebook | null> => {
    try {
      const { data, error } = await supabase
        .from("notebooks")
        .select("*")
        .eq("id", notebookId)
        .single();

      if (error) handleError("getNotebook failed", error);

      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        userId: data.user_id,
        color: data.color,
        createdAt: data.created_at ? new Date(data.created_at) : undefined,
        lastModified: data.last_modified ? new Date(data.last_modified) : undefined,
      };
    } catch (err: any) {
      handleError("getNotebook exception", err);
      return null;
    }
  },

  getUserNotebooks: async (userId: string): Promise<Notebook[]> => {
    try {
      const { data, error } = await supabase
        .from("notebooks")
        .select("*")
        .eq("user_id", userId);

      if (error) handleError("getUserNotebooks failed", error);

      return (
        data?.map((notebook) => ({
          id: notebook.id,
          title: notebook.title,
          description: notebook.description,
          userId: notebook.user_id,
          color: notebook.color,
          createdAt: notebook.created_at ? new Date(notebook.created_at) : undefined,
          lastModified: notebook.last_modified ? new Date(notebook.last_modified) : undefined,
        })) || []
      );
    } catch (err: any) {
      handleError("getUserNotebooks exception", err);
      return [];
    }
  },

  // Alias for getUserNotebooks to match expected method name
  getNotebooksByUser: async (userId: string): Promise<Notebook[]> => {
    return notebookService.getUserNotebooks(userId);
  },
};

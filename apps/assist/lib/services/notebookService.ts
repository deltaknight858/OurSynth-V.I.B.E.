// Notebook Service for OurSynth-Eco noteflow
// Handles CRUD operations for notebooks with wizard context tracking

import { Notebook, Note, ServiceResponse, ItemId, UserId, WizardMeta } from '../types/core';
import { noteService } from './noteService';

class NotebookService {
  private notebooks: Map<ItemId, Notebook> = new Map();

  // Create a new notebook
  async create(notebookData: Omit<Notebook, 'id' | 'createdAt' | 'updatedAt' | 'notes'> & { 
    initialNotes?: Note[];
    wizardMeta?: WizardMeta;
  }): Promise<ServiceResponse<Notebook>> {
    try {
      const now = new Date();
      const notebook: Notebook = {
        ...notebookData,
        id: this.generateId(),
        createdAt: now,
        updatedAt: now,
        notes: notebookData.initialNotes || [],
      };

      this.notebooks.set(notebook.id, notebook);

      return {
        success: true,
        data: notebook,
        message: 'Notebook created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create notebook'
      };
    }
  }

  // Get a notebook by ID
  async get(id: ItemId): Promise<ServiceResponse<Notebook>> {
    try {
      const notebook = this.notebooks.get(id);
      
      if (!notebook) {
        return {
          success: false,
          error: 'Notebook not found'
        };
      }

      return {
        success: true,
        data: notebook
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get notebook'
      };
    }
  }

  // Update a notebook
  async update(id: ItemId, updates: Partial<Omit<Notebook, 'id' | 'createdAt'>>): Promise<ServiceResponse<Notebook>> {
    try {
      const existingNotebook = this.notebooks.get(id);
      
      if (!existingNotebook) {
        return {
          success: false,
          error: 'Notebook not found'
        };
      }

      const updatedNotebook: Notebook = {
        ...existingNotebook,
        ...updates,
        id, // Ensure ID doesn't change
        createdAt: existingNotebook.createdAt, // Preserve creation date
        updatedAt: new Date()
      };

      this.notebooks.set(id, updatedNotebook);

      return {
        success: true,
        data: updatedNotebook,
        message: 'Notebook updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update notebook'
      };
    }
  }

  // Delete a notebook
  async delete(id: ItemId): Promise<ServiceResponse<boolean>> {
    try {
      const deleted = this.notebooks.delete(id);
      
      if (!deleted) {
        return {
          success: false,
          error: 'Notebook not found'
        };
      }

      return {
        success: true,
        data: true,
        message: 'Notebook deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete notebook'
      };
    }
  }

  // List all notebooks with optional filtering
  async list(options?: {
    userId?: UserId;
    tags?: string[];
    wizardGenerated?: boolean;
    includeShared?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResponse<Notebook[]>> {
    try {
      let notebooks = Array.from(this.notebooks.values());

      // Apply filters
      if (options?.userId) {
        notebooks = notebooks.filter(notebook => {
          const isOwner = notebook.userId === options.userId;
          const isCollaborator = options.includeShared && 
            notebook.collaborators?.includes(options.userId!);
          return isOwner || isCollaborator;
        });
      }

      if (options?.tags && options.tags.length > 0) {
        notebooks = notebooks.filter(notebook => 
          notebook.tags && notebook.tags.some(tag => options.tags!.includes(tag))
        );
      }

      if (options?.wizardGenerated !== undefined) {
        notebooks = notebooks.filter(notebook => 
          !!notebook.wizardMeta?.isWizardGenerated === options.wizardGenerated
        );
      }

      // Sort by updatedAt (most recently updated first)
      notebooks.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      // Apply pagination
      if (options?.offset) {
        notebooks = notebooks.slice(options.offset);
      }
      if (options?.limit) {
        notebooks = notebooks.slice(0, options.limit);
      }

      return {
        success: true,
        data: notebooks
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list notebooks'
      };
    }
  }

  // Add a note to a notebook
  async addNote(notebookId: ItemId, note: Note): Promise<ServiceResponse<Notebook>> {
    try {
      const notebook = this.notebooks.get(notebookId);
      
      if (!notebook) {
        return {
          success: false,
          error: 'Notebook not found'
        };
      }

      const updatedNotebook: Notebook = {
        ...notebook,
        notes: [...notebook.notes, note],
        updatedAt: new Date()
      };

      this.notebooks.set(notebookId, updatedNotebook);

      return {
        success: true,
        data: updatedNotebook,
        message: 'Note added to notebook'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add note to notebook'
      };
    }
  }

  // Remove a note from a notebook
  async removeNote(notebookId: ItemId, noteId: ItemId): Promise<ServiceResponse<Notebook>> {
    try {
      const notebook = this.notebooks.get(notebookId);
      
      if (!notebook) {
        return {
          success: false,
          error: 'Notebook not found'
        };
      }

      const updatedNotebook: Notebook = {
        ...notebook,
        notes: notebook.notes.filter(note => note.id !== noteId),
        updatedAt: new Date()
      };

      this.notebooks.set(notebookId, updatedNotebook);

      return {
        success: true,
        data: updatedNotebook,
        message: 'Note removed from notebook'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove note from notebook'
      };
    }
  }

  // Get all notes in a notebook
  async getNotes(notebookId: ItemId): Promise<ServiceResponse<Note[]>> {
    try {
      const notebook = this.notebooks.get(notebookId);
      
      if (!notebook) {
        return {
          success: false,
          error: 'Notebook not found'
        };
      }

      return {
        success: true,
        data: notebook.notes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get notebook notes'
      };
    }
  }

  // Share a notebook with users
  async shareNotebook(notebookId: ItemId, userIds: UserId[]): Promise<ServiceResponse<Notebook>> {
    try {
      const notebook = this.notebooks.get(notebookId);
      
      if (!notebook) {
        return {
          success: false,
          error: 'Notebook not found'
        };
      }

      const existingCollaborators = notebook.collaborators || [];
      const newCollaborators = [...new Set([...existingCollaborators, ...userIds])];

      const updatedNotebook: Notebook = {
        ...notebook,
        collaborators: newCollaborators,
        isShared: newCollaborators.length > 0,
        updatedAt: new Date()
      };

      this.notebooks.set(notebookId, updatedNotebook);

      return {
        success: true,
        data: updatedNotebook,
        message: 'Notebook shared successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to share notebook'
      };
    }
  }

  // Unshare a notebook with users
  async unshareNotebook(notebookId: ItemId, userIds: UserId[]): Promise<ServiceResponse<Notebook>> {
    try {
      const notebook = this.notebooks.get(notebookId);
      
      if (!notebook) {
        return {
          success: false,
          error: 'Notebook not found'
        };
      }

      const updatedCollaborators = (notebook.collaborators || [])
        .filter(userId => !userIds.includes(userId));

      const updatedNotebook: Notebook = {
        ...notebook,
        collaborators: updatedCollaborators,
        isShared: updatedCollaborators.length > 0,
        updatedAt: new Date()
      };

      this.notebooks.set(notebookId, updatedNotebook);

      return {
        success: true,
        data: updatedNotebook,
        message: 'Notebook unshared successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unshare notebook'
      };
    }
  }

  // Search within notebook contents
  async search(query: string, options?: {
    notebookId?: ItemId;
    userId?: UserId;
    tags?: string[];
  }): Promise<ServiceResponse<{ notebook: Notebook; matchingNotes: Note[] }[]>> {
    try {
      let notebooks = Array.from(this.notebooks.values());

      // Filter by user access
      if (options?.userId) {
        notebooks = notebooks.filter(notebook => {
          const isOwner = notebook.userId === options.userId;
          const isCollaborator = notebook.collaborators?.includes(options.userId!);
          return isOwner || isCollaborator;
        });
      }

      // Filter by specific notebook
      if (options?.notebookId) {
        notebooks = notebooks.filter(notebook => notebook.id === options.notebookId);
      }

      const results: { notebook: Notebook; matchingNotes: Note[] }[] = [];
      const queryLower = query.toLowerCase();

      for (const notebook of notebooks) {
        const matchingNotes = notebook.notes.filter(note =>
          note.content.toLowerCase().includes(queryLower) ||
          note.title?.toLowerCase().includes(queryLower) ||
          note.tags?.some(tag => tag.toLowerCase().includes(queryLower))
        );

        if (matchingNotes.length > 0 || notebook.title.toLowerCase().includes(queryLower)) {
          results.push({ notebook, matchingNotes });
        }
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search notebooks'
      };
    }
  }

  // Get notebooks created by wizard
  async getWizardGenerated(userId?: UserId): Promise<ServiceResponse<Notebook[]>> {
    return this.list({ userId, wizardGenerated: true });
  }

  // Check if a notebook is wizard-generated
  isWizardGenerated(id: ItemId): boolean {
    const notebook = this.notebooks.get(id);
    return !!notebook?.wizardMeta?.isWizardGenerated;
  }

  // Get wizard context for a notebook
  getWizardContext(id: ItemId): WizardMeta | undefined {
    const notebook = this.notebooks.get(id);
    return notebook?.wizardMeta;
  }

  // Private helper methods
  private generateId(): string {
    return `notebook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize with existing data
  async loadNotebooks(notebooks: Notebook[]): Promise<ServiceResponse<boolean>> {
    try {
      notebooks.forEach(notebook => {
        this.notebooks.set(notebook.id, notebook);
      });

      return {
        success: true,
        data: true,
        message: `Loaded ${notebooks.length} notebooks`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load notebooks'
      };
    }
  }
}

// Export singleton instance
export const notebookService = new NotebookService();
export default notebookService;
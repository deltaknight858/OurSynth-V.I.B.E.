// Note Service for OurSynth-Eco noteflow
// Handles CRUD operations for notes with wizard context tracking

import { Note, ServiceResponse, SearchOptions, ItemId, UserId, WizardMeta } from '../types/core';

class NoteService {
  private notes: Map<ItemId, Note> = new Map();

  // Create a new note
  async create(noteData: Omit<Note, 'id' | 'timestamp'> & { wizardMeta?: WizardMeta }): Promise<ServiceResponse<Note>> {
    try {
      const note: Note = {
        ...noteData,
        id: this.generateId(),
        timestamp: new Date(),
      };

      this.notes.set(note.id, note);

      return {
        success: true,
        data: note,
        message: 'Note created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create note'
      };
    }
  }

  // Get a note by ID
  async get(id: ItemId): Promise<ServiceResponse<Note>> {
    try {
      const note = this.notes.get(id);
      
      if (!note) {
        return {
          success: false,
          error: 'Note not found'
        };
      }

      return {
        success: true,
        data: note
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get note'
      };
    }
  }

  // Update a note
  async update(id: ItemId, updates: Partial<Note>): Promise<ServiceResponse<Note>> {
    try {
      const existingNote = this.notes.get(id);
      
      if (!existingNote) {
        return {
          success: false,
          error: 'Note not found'
        };
      }

      const updatedNote: Note = {
        ...existingNote,
        ...updates,
        id, // Ensure ID doesn't change
        timestamp: existingNote.timestamp // Preserve original timestamp
      };

      this.notes.set(id, updatedNote);

      return {
        success: true,
        data: updatedNote,
        message: 'Note updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update note'
      };
    }
  }

  // Delete a note
  async delete(id: ItemId): Promise<ServiceResponse<boolean>> {
    try {
      const deleted = this.notes.delete(id);
      
      if (!deleted) {
        return {
          success: false,
          error: 'Note not found'
        };
      }

      return {
        success: true,
        data: true,
        message: 'Note deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete note'
      };
    }
  }

  // List all notes with optional filtering
  async list(options?: {
    userId?: UserId;
    tags?: string[];
    noteType?: 'standard' | 'taskflow';
    wizardGenerated?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResponse<Note[]>> {
    try {
      let notes = Array.from(this.notes.values());

      // Apply filters
      if (options?.userId) {
        notes = notes.filter(note => note.userId === options.userId);
      }

      if (options?.tags && options.tags.length > 0) {
        notes = notes.filter(note => 
          note.tags && note.tags.some(tag => options.tags!.includes(tag))
        );
      }

      if (options?.noteType) {
        notes = notes.filter(note => note.noteType === options.noteType);
      }

      if (options?.wizardGenerated !== undefined) {
        notes = notes.filter(note => 
          !!note.wizardMeta?.isWizardGenerated === options.wizardGenerated
        );
      }

      // Sort by timestamp (newest first)
      notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Apply pagination
      if (options?.offset) {
        notes = notes.slice(options.offset);
      }
      if (options?.limit) {
        notes = notes.slice(0, options.limit);
      }

      return {
        success: true,
        data: notes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list notes'
      };
    }
  }

  // Search notes
  async search(searchOptions: SearchOptions): Promise<ServiceResponse<Note[]>> {
    try {
      let notes = Array.from(this.notes.values());

      // Filter by user if specified
      if (searchOptions.userId) {
        notes = notes.filter(note => note.userId === searchOptions.userId);
      }

      // Text search in content and title
      if (searchOptions.query) {
        const query = searchOptions.query.toLowerCase();
        notes = notes.filter(note => 
          note.content.toLowerCase().includes(query) ||
          note.title?.toLowerCase().includes(query) ||
          note.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Filter by tags
      if (searchOptions.tags && searchOptions.tags.length > 0) {
        notes = notes.filter(note =>
          note.tags && note.tags.some(tag => searchOptions.tags!.includes(tag))
        );
      }

      // Filter by date range
      if (searchOptions.dateRange) {
        const { start, end } = searchOptions.dateRange;
        notes = notes.filter(note => {
          const noteTime = note.timestamp.getTime();
          return (!start || noteTime >= start.getTime()) &&
                 (!end || noteTime <= end.getTime());
        });
      }

      // Filter by wizard generated status
      if (searchOptions.includeWizardGenerated !== undefined) {
        notes = notes.filter(note =>
          !!note.wizardMeta?.isWizardGenerated === searchOptions.includeWizardGenerated
        );
      }

      // Sort by relevance (timestamp for now, could be enhanced with scoring)
      notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return {
        success: true,
        data: notes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search notes'
      };
    }
  }

  // Get notes created by wizard
  async getWizardGenerated(userId?: UserId): Promise<ServiceResponse<Note[]>> {
    return this.list({ userId, wizardGenerated: true });
  }

  // Check if a note is wizard-generated
  isWizardGenerated(id: ItemId): boolean {
    const note = this.notes.get(id);
    return !!note?.wizardMeta?.isWizardGenerated;
  }

  // Get wizard context for a note
  getWizardContext(id: ItemId): WizardMeta | undefined {
    const note = this.notes.get(id);
    return note?.wizardMeta;
  }

  // Private helper methods
  private generateId(): string {
    return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize with existing data (for migration or data loading)
  async loadNotes(notes: Note[]): Promise<ServiceResponse<boolean>> {
    try {
      notes.forEach(note => {
        this.notes.set(note.id, note);
      });

      return {
        success: true,
        data: true,
        message: `Loaded ${notes.length} notes`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load notes'
      };
    }
  }
}

// Export singleton instance
export const noteService = new NoteService();
export default noteService;
// Service Registry for OurSynth-Eco noteflow
// Centralizes service access and provides context-aware service management

import { noteService } from './noteService';
import { notebookService } from './notebookService';
import { mindMapService } from './mindMapService';
import { exportService } from './exportService';
import { collaborationService } from './collaborationService';
import { userService } from './userService';
import { authService } from './authService';
import { voiceCommandService } from './voiceCommandService';
import { wizardContextRegistry } from './wizardContextRegistry';

import { ViewContext, ServiceResponse, ItemId, UserId } from '../types/core';

class ServiceRegistry {
  // Service instances
  public readonly noteService = noteService;
  public readonly notebookService = notebookService;
  public readonly mindMapService = mindMapService;
  public readonly exportService = exportService;
  public readonly collaborationService = collaborationService;
  public readonly userService = userService;
  public readonly authService = authService;
  public readonly voiceCommandService = voiceCommandService;
  public readonly wizardContextRegistry = wizardContextRegistry;

  private viewContext: ViewContext = {
    activeView: 'notes'
  };

  // Initialize all services
  async initialize(): Promise<ServiceResponse<boolean>> {
    try {
      // Create a default demo user if none exists
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser.success) {
        const demoUserResult = await this.userService.create({
          email: 'demo@oursynth.com',
          name: 'Demo User',
          preferences: {
            theme: 'light',
            defaultView: 'notes',
            ui: {
              showWizardItems: true,
              defaultNoteType: 'standard'
            }
          }
        });

        if (demoUserResult.success && demoUserResult.data) {
          this.authService.setCurrentSession(demoUserResult.data.id);
        }
      }

      // Load demo data
      await this.loadDemoData();

      return {
        success: true,
        data: true,
        message: 'Services initialized successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize services'
      };
    }
  }

  // Get current view context
  getViewContext(): ViewContext {
    return { ...this.viewContext };
  }

  // Set current view context
  setViewContext(context: Partial<ViewContext>): void {
    this.viewContext = {
      ...this.viewContext,
      ...context
    };
  }

  // Context-aware operations

  // Get items for current view with wizard context
  async getCurrentViewItems(): Promise<ServiceResponse<any[]>> {
    try {
      const currentUserId = this.authService.getCurrentUserId();
      if (!currentUserId) {
        return {
          success: false,
          error: 'No authenticated user'
        };
      }

      switch (this.viewContext.activeView) {
        case 'notes':
          return await this.noteService.list({ userId: currentUserId });
        case 'notebooks':
          return await this.notebookService.list({ userId: currentUserId });
        case 'mindmap':
          return await this.mindMapService.list({ userId: currentUserId });
        default:
          return {
            success: false,
            error: 'Unknown view type'
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current view items'
      };
    }
  }

  // Get wizard-generated items for current view
  async getCurrentViewWizardItems(): Promise<ServiceResponse<any[]>> {
    try {
      const currentUserId = this.authService.getCurrentUserId();
      if (!currentUserId) {
        return {
          success: false,
          error: 'No authenticated user'
        };
      }

      switch (this.viewContext.activeView) {
        case 'notes':
          return await this.noteService.list({ 
            userId: currentUserId, 
            wizardGenerated: true 
          });
        case 'notebooks':
          return await this.notebookService.list({ 
            userId: currentUserId, 
            wizardGenerated: true 
          });
        case 'mindmap':
          return await this.mindMapService.list({ 
            userId: currentUserId, 
            wizardGenerated: true 
          });
        default:
          return {
            success: false,
            error: 'Unknown view type'
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get wizard items'
      };
    }
  }

  // Create item with wizard context
  async createItemWithWizardContext(itemData: any, itemType: 'note' | 'notebook' | 'mindmap'): Promise<ServiceResponse<any>> {
    try {
      const currentUserId = this.authService.getCurrentUserId();
      if (!currentUserId) {
        return {
          success: false,
          error: 'No authenticated user'
        };
      }

      // Get wizard context if available
      const wizardContext = this.wizardContextRegistry.getCurrentContext();
      const wizardMeta = wizardContext.currentProject ? 
        this.wizardContextRegistry.getWizardMeta(itemData.id) : undefined;

      // Add user ID and wizard meta to item data
      const enhancedItemData = {
        ...itemData,
        userId: currentUserId,
        wizardMeta
      };

      let result: ServiceResponse<any>;

      // Create item based on type
      switch (itemType) {
        case 'note':
          result = await this.noteService.create(enhancedItemData);
          break;
        case 'notebook':
          result = await this.notebookService.create(enhancedItemData);
          break;
        case 'mindmap':
          result = await this.mindMapService.create(enhancedItemData);
          break;
        default:
          return {
            success: false,
            error: 'Unknown item type'
          };
      }

      // If successful and has wizard context, register the item
      if (result.success && result.data && wizardContext.currentProject) {
        await this.wizardContextRegistry.registerWizardItem({
          id: result.data.id,
          type: itemType,
          title: result.data.title || result.data.content?.substring(0, 50) || 'Untitled',
          projectId: wizardContext.currentProject.id
        });
      }

      // Update user stats
      if (result.success) {
        const isWizardGenerated = !!wizardMeta?.isWizardGenerated;
        switch (itemType) {
          case 'note':
            await this.userService.incrementNotesCount(currentUserId, isWizardGenerated);
            break;
          case 'notebook':
            await this.userService.incrementNotebooksCount(currentUserId, isWizardGenerated);
            break;
          case 'mindmap':
            await this.userService.incrementMindMapsCount(currentUserId, isWizardGenerated);
            break;
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create item with wizard context'
      };
    }
  }

  // Switch view and maintain context
  async switchView(newView: 'notes' | 'notebooks' | 'mindmap'): Promise<ServiceResponse<any[]>> {
    try {
      this.viewContext.activeView = newView;
      
      // Clear current selection when switching views
      this.viewContext.currentItem = undefined;
      this.viewContext.selectedItems = [];

      // Load items for new view
      return await this.getCurrentViewItems();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to switch view'
      };
    }
  }

  // Search across all services with wizard context
  async globalSearch(query: string, options?: {
    includeWizardGenerated?: boolean;
    itemTypes?: ('note' | 'notebook' | 'mindmap')[];
  }): Promise<ServiceResponse<{
    notes: any[];
    notebooks: any[];
    mindmaps: any[];
    wizardItems?: any[];
  }>> {
    try {
      const currentUserId = this.authService.getCurrentUserId();
      if (!currentUserId) {
        return {
          success: false,
          error: 'No authenticated user'
        };
      }

      const searchOptions = {
        query,
        userId: currentUserId,
        includeWizardGenerated: options?.includeWizardGenerated
      };

      const results = {
        notes: [] as any[],
        notebooks: [] as any[],
        mindmaps: [] as any[],
        wizardItems: [] as any[]
      };

      const itemTypes = options?.itemTypes || ['note', 'notebook', 'mindmap'];

      // Search each service type if requested
      if (itemTypes.includes('note')) {
        const noteResults = await this.noteService.search(searchOptions);
        if (noteResults.success && noteResults.data) {
          results.notes = noteResults.data;
        }
      }

      if (itemTypes.includes('notebook')) {
        const notebookResults = await this.notebookService.search(query, { userId: currentUserId });
        if (notebookResults.success && notebookResults.data) {
          results.notebooks = notebookResults.data.map(item => item.notebook);
        }
      }

      if (itemTypes.includes('mindmap')) {
        const mindmapResults = await this.mindMapService.search(query, { 
          userId: currentUserId,
          wizardGenerated: options?.includeWizardGenerated 
        });
        if (mindmapResults.success && mindmapResults.data) {
          results.mindmaps = mindmapResults.data;
        }
      }

      // Search wizard items if requested
      if (options?.includeWizardGenerated) {
        const wizardResults = await this.wizardContextRegistry.searchWizardItems(query);
        if (wizardResults.success && wizardResults.data) {
          results.wizardItems = wizardResults.data;
        }
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to perform global search'
      };
    }
  }

  // Synchronize item across views (when edited)
  async synchronizeItem(itemId: ItemId, itemType: 'note' | 'notebook' | 'mindmap'): Promise<ServiceResponse<boolean>> {
    try {
      // Update wizard context if this is a wizard item
      if (this.wizardContextRegistry.isWizardGenerated(itemId)) {
        await this.wizardContextRegistry.updateItemAccess(itemId);
      }

      // Update user last active
      const currentUserId = this.authService.getCurrentUserId();
      if (currentUserId) {
        await this.userService.updateLastActive(currentUserId);
      }

      return {
        success: true,
        data: true,
        message: 'Item synchronized across views'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to synchronize item'
      };
    }
  }

  // Private helper to load demo data
  private async loadDemoData(): Promise<void> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) return;

    // Create demo wizard project
    const wizardProjectResult = await this.wizardContextRegistry.createProject({
      name: 'OurSynth Platform Development',
      type: 'fullapp',
      template: 'react-dashboard',
      framework: 'nextjs',
      features: ['auth', 'database', 'api']
    });

    if (wizardProjectResult.success && wizardProjectResult.data) {
      // Create demo notes with wizard context
      const demoNotes = [
        {
          content: '# OurSynth Platform Development\n\nKey development tasks for the OurSynth ecosystem integration.\n\n## Tasks\n- [ ] Integrate TaskFlow with NoteFlow\n- [ ] Update shell navigation\n- [ ] Add pathways wizard support',
          tags: ['taskflow', 'development', 'integration'],
          noteType: 'taskflow' as const,
          taskInfo: {
            title: 'OurSynth Platform Development',
            status: 'in-progress' as const,
            assignedAgent: 'AI Development Agent',
            priority: 'high' as const,
            subtasks: [
              { id: '1_1', title: 'Integrate TaskFlow with NoteFlow', completed: true },
              { id: '1_2', title: 'Update shell navigation', completed: true },
              { id: '1_3', title: 'Add pathways wizard support', completed: false }
            ]
          }
        },
        {
          content: 'Exploring Google Cloud AI integration patterns for workflow automation. Key insight: Vertex AI provides excellent semantic embedding capabilities for memory systems.',
          tags: ['google-cloud', 'vertex-ai', 'workflows'],
          noteType: 'standard' as const
        }
      ];

      for (const noteData of demoNotes) {
        await this.createItemWithWizardContext(noteData, 'note');
      }
    }
  }

  // Cleanup method for periodic maintenance
  async performMaintenance(): Promise<ServiceResponse<{
    expiredSessions: number;
    inactiveSessions: number;
  }>> {
    try {
      const authCleanup = await this.authService.cleanupExpiredSessions();
      const collaborationCleanup = await this.collaborationService.cleanupInactiveSessions();

      return {
        success: true,
        data: {
          expiredSessions: authCleanup.success ? authCleanup.data || 0 : 0,
          inactiveSessions: collaborationCleanup.success ? collaborationCleanup.data || 0 : 0
        },
        message: 'Maintenance completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to perform maintenance'
      };
    }
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceRegistry();
export default serviceRegistry;
// Wizard Context Registry for OurSynth-Eco
// Tracks items created by the Pathways wizard and maintains context across shell views

import { WizardMeta, ItemId, ServiceResponse } from '../types/core';

interface WizardProject {
  id: string;
  name: string;
  type: 'component' | 'page' | 'feature' | 'fullapp' | 'taskflow';
  template?: string;
  framework?: string;
  features?: string[];
  createdAt: Date;
  generatedItems: WizardGeneratedItem[];
  isActive: boolean;
}

interface WizardGeneratedItem {
  id: ItemId;
  type: 'note' | 'notebook' | 'mindmap';
  title: string;
  projectId: string;
  createdAt: Date;
  lastAccessed?: Date;
}

interface WizardContext {
  currentProject?: WizardProject;
  activeItems: WizardGeneratedItem[];
  recentProjects: WizardProject[];
}

class WizardContextRegistry {
  private projects: Map<string, WizardProject> = new Map();
  private itemToProject: Map<ItemId, string> = new Map(); // itemId -> projectId
  private currentContext: WizardContext = {
    activeItems: [],
    recentProjects: []
  };

  // Create a new wizard project
  async createProject(projectData: {
    name: string;
    type: 'component' | 'page' | 'feature' | 'fullapp' | 'taskflow';
    template?: string;
    framework?: string;
    features?: string[];
  }): Promise<ServiceResponse<WizardProject>> {
    try {
      const project: WizardProject = {
        id: this.generateProjectId(),
        ...projectData,
        createdAt: new Date(),
        generatedItems: [],
        isActive: true
      };

      this.projects.set(project.id, project);
      this.currentContext.currentProject = project;
      
      // Add to recent projects
      this.addToRecentProjects(project);

      return {
        success: true,
        data: project,
        message: 'Wizard project created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create wizard project'
      };
    }
  }

  // Register an item as wizard-generated
  async registerWizardItem(itemData: {
    id: ItemId;
    type: 'note' | 'notebook' | 'mindmap';
    title: string;
    projectId?: string;
  }): Promise<ServiceResponse<WizardGeneratedItem>> {
    try {
      const projectId = itemData.projectId || this.currentContext.currentProject?.id;
      
      if (!projectId) {
        return {
          success: false,
          error: 'No active wizard project to associate item with'
        };
      }

      const project = this.projects.get(projectId);
      if (!project) {
        return {
          success: false,
          error: 'Wizard project not found'
        };
      }

      const wizardItem: WizardGeneratedItem = {
        id: itemData.id,
        type: itemData.type,
        title: itemData.title,
        projectId,
        createdAt: new Date()
      };

      // Add to project's generated items
      project.generatedItems.push(wizardItem);
      
      // Map item to project
      this.itemToProject.set(itemData.id, projectId);
      
      // Add to active items
      this.currentContext.activeItems.push(wizardItem);

      return {
        success: true,
        data: wizardItem,
        message: 'Item registered as wizard-generated'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register wizard item'
      };
    }
  }

  // Check if an item is wizard-generated
  isWizardGenerated(itemId: ItemId): boolean {
    return this.itemToProject.has(itemId);
  }

  // Get wizard metadata for an item
  getWizardMeta(itemId: ItemId): WizardMeta | undefined {
    const projectId = this.itemToProject.get(itemId);
    if (!projectId) return undefined;

    const project = this.projects.get(projectId);
    if (!project) return undefined;

    return {
      isWizardGenerated: true,
      wizardId: projectId,
      projectType: project.type,
      pathwaysContext: {
        template: project.template,
        framework: project.framework,
        features: project.features
      },
      createdAt: project.createdAt
    };
  }

  // Get the wizard project for an item
  getWizardProject(itemId: ItemId): WizardProject | undefined {
    const projectId = this.itemToProject.get(itemId);
    if (!projectId) return undefined;
    return this.projects.get(projectId);
  }

  // Get all wizard-generated items for a project
  getProjectItems(projectId: string): WizardGeneratedItem[] {
    const project = this.projects.get(projectId);
    return project?.generatedItems || [];
  }

  // Get all wizard projects
  getAllProjects(): WizardProject[] {
    return Array.from(this.projects.values());
  }

  // Get active wizard projects
  getActiveProjects(): WizardProject[] {
    return Array.from(this.projects.values()).filter(p => p.isActive);
  }

  // Get current wizard context
  getCurrentContext(): WizardContext {
    // Update recent projects list
    this.updateRecentProjects();
    return { ...this.currentContext };
  }

  // Set current active project
  async setCurrentProject(projectId: string): Promise<ServiceResponse<WizardProject>> {
    try {
      const project = this.projects.get(projectId);
      
      if (!project) {
        return {
          success: false,
          error: 'Wizard project not found'
        };
      }

      this.currentContext.currentProject = project;
      
      // Update active items to those from this project
      this.currentContext.activeItems = project.generatedItems.map(item => ({
        ...item,
        lastAccessed: new Date()
      }));

      // Add to recent projects
      this.addToRecentProjects(project);

      return {
        success: true,
        data: project,
        message: 'Current wizard project set'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to set current project'
      };
    }
  }

  // Complete a wizard project (mark as inactive)
  async completeProject(projectId: string): Promise<ServiceResponse<WizardProject>> {
    try {
      const project = this.projects.get(projectId);
      
      if (!project) {
        return {
          success: false,
          error: 'Wizard project not found'
        };
      }

      project.isActive = false;

      // If this was the current project, clear it
      if (this.currentContext.currentProject?.id === projectId) {
        this.currentContext.currentProject = undefined;
        this.currentContext.activeItems = [];
      }

      return {
        success: true,
        data: project,
        message: 'Wizard project completed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to complete project'
      };
    }
  }

  // Update item last accessed time
  async updateItemAccess(itemId: ItemId): Promise<ServiceResponse<boolean>> {
    try {
      const projectId = this.itemToProject.get(itemId);
      if (!projectId) return { success: true, data: true }; // Not a wizard item

      const project = this.projects.get(projectId);
      if (!project) return { success: false, error: 'Project not found' };

      // Update in project's generated items
      const itemIndex = project.generatedItems.findIndex(item => item.id === itemId);
      if (itemIndex >= 0) {
        project.generatedItems[itemIndex].lastAccessed = new Date();
      }

      // Update in active items
      const activeIndex = this.currentContext.activeItems.findIndex(item => item.id === itemId);
      if (activeIndex >= 0) {
        this.currentContext.activeItems[activeIndex].lastAccessed = new Date();
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update item access'
      };
    }
  }

  // Remove an item from wizard tracking (when deleted)
  async removeWizardItem(itemId: ItemId): Promise<ServiceResponse<boolean>> {
    try {
      const projectId = this.itemToProject.get(itemId);
      if (!projectId) return { success: true, data: true }; // Not a wizard item

      const project = this.projects.get(projectId);
      if (project) {
        project.generatedItems = project.generatedItems.filter(item => item.id !== itemId);
      }

      // Remove from mapping
      this.itemToProject.delete(itemId);

      // Remove from active items
      this.currentContext.activeItems = this.currentContext.activeItems
        .filter(item => item.id !== itemId);

      return {
        success: true,
        data: true,
        message: 'Item removed from wizard tracking'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove wizard item'
      };
    }
  }

  // Search wizard items
  async searchWizardItems(query: string): Promise<ServiceResponse<WizardGeneratedItem[]>> {
    try {
      const queryLower = query.toLowerCase();
      const allItems = Array.from(this.projects.values())
        .flatMap(project => project.generatedItems);

      const matchingItems = allItems.filter(item =>
        item.title.toLowerCase().includes(queryLower) ||
        item.type.toLowerCase().includes(queryLower)
      );

      // Sort by most recently accessed
      matchingItems.sort((a, b) => {
        const aTime = a.lastAccessed?.getTime() || a.createdAt.getTime();
        const bTime = b.lastAccessed?.getTime() || b.createdAt.getTime();
        return bTime - aTime;
      });

      return {
        success: true,
        data: matchingItems
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search wizard items'
      };
    }
  }

  // Get wizard items by type
  getWizardItemsByType(type: 'note' | 'notebook' | 'mindmap'): WizardGeneratedItem[] {
    return Array.from(this.projects.values())
      .flatMap(project => project.generatedItems)
      .filter(item => item.type === type);
  }

  // Clear all wizard context (reset)
  async clearContext(): Promise<ServiceResponse<boolean>> {
    try {
      this.projects.clear();
      this.itemToProject.clear();
      this.currentContext = {
        activeItems: [],
        recentProjects: []
      };

      return {
        success: true,
        data: true,
        message: 'Wizard context cleared'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear wizard context'
      };
    }
  }

  // Private helper methods
  private generateProjectId(): string {
    return `wizard_project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private addToRecentProjects(project: WizardProject): void {
    // Remove if already in recent projects
    this.currentContext.recentProjects = this.currentContext.recentProjects
      .filter(p => p.id !== project.id);

    // Add to beginning
    this.currentContext.recentProjects.unshift(project);

    // Keep only last 10 recent projects
    this.currentContext.recentProjects = this.currentContext.recentProjects.slice(0, 10);
  }

  private updateRecentProjects(): void {
    // Sort by most recently created/accessed
    const allProjects = Array.from(this.projects.values());
    this.currentContext.recentProjects = allProjects
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }

  // Initialize with existing data
  async loadWizardData(data: {
    projects: WizardProject[];
    itemMappings: [ItemId, string][];
  }): Promise<ServiceResponse<boolean>> {
    try {
      // Load projects
      data.projects.forEach(project => {
        this.projects.set(project.id, project);
      });

      // Load item mappings
      data.itemMappings.forEach(([itemId, projectId]) => {
        this.itemToProject.set(itemId, projectId);
      });

      // Update context
      this.updateRecentProjects();

      // Set current project to most recent active one
      const activeProject = this.getActiveProjects()[0];
      if (activeProject) {
        this.currentContext.currentProject = activeProject;
        this.currentContext.activeItems = activeProject.generatedItems;
      }

      return {
        success: true,
        data: true,
        message: `Loaded ${data.projects.length} wizard projects`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load wizard data'
      };
    }
  }
}

// Export singleton instance
export const wizardContextRegistry = new WizardContextRegistry();
export default wizardContextRegistry;
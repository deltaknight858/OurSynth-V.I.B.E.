// Mind Map Service for OurSynth-Eco noteflow
// Handles CRUD operations for mind maps with wizard context tracking

import { MindMap, MindMapNode, MindMapEdge, ServiceResponse, ItemId, UserId, WizardMeta } from '../types/core';

class MindMapService {
  private mindMaps: Map<ItemId, MindMap> = new Map();

  // Create a new mind map
  async create(mindMapData: Omit<MindMap, 'id' | 'createdAt' | 'updatedAt'> & { 
    wizardMeta?: WizardMeta;
  }): Promise<ServiceResponse<MindMap>> {
    try {
      const now = new Date();
      const mindMap: MindMap = {
        ...mindMapData,
        id: this.generateId(),
        createdAt: now,
        updatedAt: now,
      };

      this.mindMaps.set(mindMap.id, mindMap);

      return {
        success: true,
        data: mindMap,
        message: 'Mind map created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create mind map'
      };
    }
  }

  // Get a mind map by ID
  async get(id: ItemId): Promise<ServiceResponse<MindMap>> {
    try {
      const mindMap = this.mindMaps.get(id);
      
      if (!mindMap) {
        return {
          success: false,
          error: 'Mind map not found'
        };
      }

      return {
        success: true,
        data: mindMap
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get mind map'
      };
    }
  }

  // Update a mind map
  async update(id: ItemId, updates: Partial<Omit<MindMap, 'id' | 'createdAt'>>): Promise<ServiceResponse<MindMap>> {
    try {
      const existingMindMap = this.mindMaps.get(id);
      
      if (!existingMindMap) {
        return {
          success: false,
          error: 'Mind map not found'
        };
      }

      const updatedMindMap: MindMap = {
        ...existingMindMap,
        ...updates,
        id, // Ensure ID doesn't change
        createdAt: existingMindMap.createdAt, // Preserve creation date
        updatedAt: new Date()
      };

      this.mindMaps.set(id, updatedMindMap);

      return {
        success: true,
        data: updatedMindMap,
        message: 'Mind map updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update mind map'
      };
    }
  }

  // Delete a mind map
  async delete(id: ItemId): Promise<ServiceResponse<boolean>> {
    try {
      const deleted = this.mindMaps.delete(id);
      
      if (!deleted) {
        return {
          success: false,
          error: 'Mind map not found'
        };
      }

      return {
        success: true,
        data: true,
        message: 'Mind map deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete mind map'
      };
    }
  }

  // List all mind maps with optional filtering
  async list(options?: {
    userId?: UserId;
    wizardGenerated?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResponse<MindMap[]>> {
    try {
      let mindMaps = Array.from(this.mindMaps.values());

      // Apply filters
      if (options?.userId) {
        mindMaps = mindMaps.filter(mindMap => mindMap.userId === options.userId);
      }

      if (options?.wizardGenerated !== undefined) {
        mindMaps = mindMaps.filter(mindMap => 
          !!mindMap.wizardMeta?.isWizardGenerated === options.wizardGenerated
        );
      }

      // Sort by updatedAt (most recently updated first)
      mindMaps.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      // Apply pagination
      if (options?.offset) {
        mindMaps = mindMaps.slice(options.offset);
      }
      if (options?.limit) {
        mindMaps = mindMaps.slice(0, options.limit);
      }

      return {
        success: true,
        data: mindMaps
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list mind maps'
      };
    }
  }

  // Add a node to a mind map
  async addNode(mindMapId: ItemId, nodeData: Omit<MindMapNode, 'id' | 'createdAt'>): Promise<ServiceResponse<MindMap>> {
    try {
      const mindMap = this.mindMaps.get(mindMapId);
      
      if (!mindMap) {
        return {
          success: false,
          error: 'Mind map not found'
        };
      }

      const newNode: MindMapNode = {
        ...nodeData,
        id: this.generateNodeId(),
        createdAt: new Date()
      };

      const updatedMindMap: MindMap = {
        ...mindMap,
        nodes: [...mindMap.nodes, newNode],
        updatedAt: new Date()
      };

      this.mindMaps.set(mindMapId, updatedMindMap);

      return {
        success: true,
        data: updatedMindMap,
        message: 'Node added to mind map'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add node to mind map'
      };
    }
  }

  // Update a node in a mind map
  async updateNode(mindMapId: ItemId, nodeId: string, updates: Partial<MindMapNode>): Promise<ServiceResponse<MindMap>> {
    try {
      const mindMap = this.mindMaps.get(mindMapId);
      
      if (!mindMap) {
        return {
          success: false,
          error: 'Mind map not found'
        };
      }

      const nodeIndex = mindMap.nodes.findIndex(node => node.id === nodeId);
      if (nodeIndex === -1) {
        return {
          success: false,
          error: 'Node not found'
        };
      }

      const updatedNodes = [...mindMap.nodes];
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        ...updates,
        id: nodeId, // Ensure ID doesn't change
      };

      const updatedMindMap: MindMap = {
        ...mindMap,
        nodes: updatedNodes,
        updatedAt: new Date()
      };

      this.mindMaps.set(mindMapId, updatedMindMap);

      return {
        success: true,
        data: updatedMindMap,
        message: 'Node updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update node'
      };
    }
  }

  // Remove a node from a mind map
  async removeNode(mindMapId: ItemId, nodeId: string): Promise<ServiceResponse<MindMap>> {
    try {
      const mindMap = this.mindMaps.get(mindMapId);
      
      if (!mindMap) {
        return {
          success: false,
          error: 'Mind map not found'
        };
      }

      // Remove the node and any edges connected to it
      const updatedNodes = mindMap.nodes.filter(node => node.id !== nodeId);
      const updatedEdges = mindMap.edges.filter(edge => 
        edge.sourceId !== nodeId && edge.targetId !== nodeId
      );

      const updatedMindMap: MindMap = {
        ...mindMap,
        nodes: updatedNodes,
        edges: updatedEdges,
        updatedAt: new Date()
      };

      this.mindMaps.set(mindMapId, updatedMindMap);

      return {
        success: true,
        data: updatedMindMap,
        message: 'Node removed from mind map'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove node from mind map'
      };
    }
  }

  // Add an edge to a mind map
  async addEdge(mindMapId: ItemId, edgeData: Omit<MindMapEdge, 'id'>): Promise<ServiceResponse<MindMap>> {
    try {
      const mindMap = this.mindMaps.get(mindMapId);
      
      if (!mindMap) {
        return {
          success: false,
          error: 'Mind map not found'
        };
      }

      // Check if source and target nodes exist
      const sourceExists = mindMap.nodes.some(node => node.id === edgeData.sourceId);
      const targetExists = mindMap.nodes.some(node => node.id === edgeData.targetId);

      if (!sourceExists || !targetExists) {
        return {
          success: false,
          error: 'Source or target node not found'
        };
      }

      const newEdge: MindMapEdge = {
        ...edgeData,
        id: this.generateEdgeId()
      };

      const updatedMindMap: MindMap = {
        ...mindMap,
        edges: [...mindMap.edges, newEdge],
        updatedAt: new Date()
      };

      this.mindMaps.set(mindMapId, updatedMindMap);

      return {
        success: true,
        data: updatedMindMap,
        message: 'Edge added to mind map'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add edge to mind map'
      };
    }
  }

  // Remove an edge from a mind map
  async removeEdge(mindMapId: ItemId, edgeId: string): Promise<ServiceResponse<MindMap>> {
    try {
      const mindMap = this.mindMaps.get(mindMapId);
      
      if (!mindMap) {
        return {
          success: false,
          error: 'Mind map not found'
        };
      }

      const updatedMindMap: MindMap = {
        ...mindMap,
        edges: mindMap.edges.filter(edge => edge.id !== edgeId),
        updatedAt: new Date()
      };

      this.mindMaps.set(mindMapId, updatedMindMap);

      return {
        success: true,
        data: updatedMindMap,
        message: 'Edge removed from mind map'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove edge from mind map'
      };
    }
  }

  // Search mind maps
  async search(query: string, options?: {
    userId?: UserId;
    wizardGenerated?: boolean;
  }): Promise<ServiceResponse<MindMap[]>> {
    try {
      let mindMaps = Array.from(this.mindMaps.values());

      // Filter by user
      if (options?.userId) {
        mindMaps = mindMaps.filter(mindMap => mindMap.userId === options.userId);
      }

      // Filter by wizard generated status
      if (options?.wizardGenerated !== undefined) {
        mindMaps = mindMaps.filter(mindMap =>
          !!mindMap.wizardMeta?.isWizardGenerated === options.wizardGenerated
        );
      }

      // Search in title, description, and node content
      const queryLower = query.toLowerCase();
      const matchingMindMaps = mindMaps.filter(mindMap =>
        mindMap.title.toLowerCase().includes(queryLower) ||
        mindMap.description?.toLowerCase().includes(queryLower) ||
        mindMap.nodes.some(node =>
          node.title.toLowerCase().includes(queryLower) ||
          node.content?.toLowerCase().includes(queryLower) ||
          node.tags?.some(tag => tag.toLowerCase().includes(queryLower))
        )
      );

      // Sort by relevance (updated date for now)
      matchingMindMaps.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      return {
        success: true,
        data: matchingMindMaps
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search mind maps'
      };
    }
  }

  // Get connected nodes (neighbors) of a specific node
  async getConnectedNodes(mindMapId: ItemId, nodeId: string): Promise<ServiceResponse<MindMapNode[]>> {
    try {
      const mindMap = this.mindMaps.get(mindMapId);
      
      if (!mindMap) {
        return {
          success: false,
          error: 'Mind map not found'
        };
      }

      const connectedNodeIds = new Set<string>();
      
      // Find all edges connected to this node
      mindMap.edges.forEach(edge => {
        if (edge.sourceId === nodeId) {
          connectedNodeIds.add(edge.targetId);
        }
        if (edge.targetId === nodeId) {
          connectedNodeIds.add(edge.sourceId);
        }
      });

      // Get the actual node objects
      const connectedNodes = mindMap.nodes.filter(node => 
        connectedNodeIds.has(node.id)
      );

      return {
        success: true,
        data: connectedNodes
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get connected nodes'
      };
    }
  }

  // Get mind maps created by wizard
  async getWizardGenerated(userId?: UserId): Promise<ServiceResponse<MindMap[]>> {
    return this.list({ userId, wizardGenerated: true });
  }

  // Check if a mind map is wizard-generated
  isWizardGenerated(id: ItemId): boolean {
    const mindMap = this.mindMaps.get(id);
    return !!mindMap?.wizardMeta?.isWizardGenerated;
  }

  // Get wizard context for a mind map
  getWizardContext(id: ItemId): WizardMeta | undefined {
    const mindMap = this.mindMaps.get(id);
    return mindMap?.wizardMeta;
  }

  // Private helper methods
  private generateId(): string {
    return `mindmap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateNodeId(): string {
    return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEdgeId(): string {
    return `edge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize with existing data
  async loadMindMaps(mindMaps: MindMap[]): Promise<ServiceResponse<boolean>> {
    try {
      mindMaps.forEach(mindMap => {
        this.mindMaps.set(mindMap.id, mindMap);
      });

      return {
        success: true,
        data: true,
        message: `Loaded ${mindMaps.length} mind maps`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load mind maps'
      };
    }
  }
}

// Export singleton instance
export const mindMapService = new MindMapService();
export default mindMapService;
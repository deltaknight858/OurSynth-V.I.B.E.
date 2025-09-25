// Collaboration Service for OurSynth-Eco noteflow
// Handles sharing, permissions, and collaboration features

import { Note, Notebook, MindMap, User, Permission, ServiceResponse, ItemId, UserId } from '../types/core';

interface ShareRequest {
  itemId: ItemId;
  itemType: 'note' | 'notebook' | 'mindmap';
  userIds: UserId[];
  permission: Permission;
  message?: string;
}

interface CollaborationSession {
  id: string;
  itemId: ItemId;
  itemType: 'note' | 'notebook' | 'mindmap';
  participants: UserId[];
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

interface ActivityLog {
  id: string;
  userId: UserId;
  itemId: ItemId;
  itemType: 'note' | 'notebook' | 'mindmap';
  action: 'create' | 'edit' | 'delete' | 'share' | 'unshare' | 'comment';
  timestamp: Date;
  details?: string;
}

class CollaborationService {
  private sharePermissions: Map<string, Map<UserId, Permission>> = new Map(); // itemId -> userId -> permission
  private activeSessions: Map<string, CollaborationSession> = new Map();
  private activityLog: ActivityLog[] = [];

  // Share an item with users
  async shareItem(shareRequest: ShareRequest): Promise<ServiceResponse<boolean>> {
    try {
      const { itemId, userIds, permission } = shareRequest;
      
      // Get or create permissions map for this item
      if (!this.sharePermissions.has(itemId)) {
        this.sharePermissions.set(itemId, new Map());
      }
      
      const itemPermissions = this.sharePermissions.get(itemId)!;
      
      // Add permissions for each user
      for (const userId of userIds) {
        itemPermissions.set(userId, permission);
      }

      // Log the sharing activity
      await this.logActivity({
        id: this.generateId(),
        userId: shareRequest.userIds[0], // Assuming first user is the sharer
        itemId,
        itemType: shareRequest.itemType,
        action: 'share',
        timestamp: new Date(),
        details: `Shared with ${userIds.length} user(s) with ${permission} permission`
      });

      return {
        success: true,
        data: true,
        message: `Item shared with ${userIds.length} user(s)`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to share item'
      };
    }
  }

  // Remove sharing permissions
  async unshareItem(itemId: ItemId, userIds: UserId[], requestingUserId: UserId): Promise<ServiceResponse<boolean>> {
    try {
      const itemPermissions = this.sharePermissions.get(itemId);
      
      if (!itemPermissions) {
        return {
          success: false,
          error: 'Item not found or not shared'
        };
      }

      // Remove permissions for specified users
      for (const userId of userIds) {
        itemPermissions.delete(userId);
      }

      // Log the unsharing activity
      await this.logActivity({
        id: this.generateId(),
        userId: requestingUserId,
        itemId,
        itemType: 'note', // Would need to be passed or determined
        action: 'unshare',
        timestamp: new Date(),
        details: `Unshared with ${userIds.length} user(s)`
      });

      return {
        success: true,
        data: true,
        message: `Sharing removed for ${userIds.length} user(s)`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unshare item'
      };
    }
  }

  // Check user permission for an item
  async checkPermission(itemId: ItemId, userId: UserId): Promise<ServiceResponse<Permission | null>> {
    try {
      const itemPermissions = this.sharePermissions.get(itemId);
      
      if (!itemPermissions) {
        return {
          success: true,
          data: null // No permissions set
        };
      }

      const permission = itemPermissions.get(userId) || null;

      return {
        success: true,
        data: permission
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check permission'
      };
    }
  }

  // Get all users who have access to an item
  async getItemCollaborators(itemId: ItemId): Promise<ServiceResponse<{ userId: UserId; permission: Permission }[]>> {
    try {
      const itemPermissions = this.sharePermissions.get(itemId);
      
      if (!itemPermissions) {
        return {
          success: true,
          data: []
        };
      }

      const collaborators = Array.from(itemPermissions.entries()).map(([userId, permission]) => ({
        userId,
        permission
      }));

      return {
        success: true,
        data: collaborators
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get collaborators'
      };
    }
  }

  // Get all items shared with a user
  async getSharedItems(userId: UserId): Promise<ServiceResponse<{ itemId: ItemId; permission: Permission }[]>> {
    try {
      const sharedItems: { itemId: ItemId; permission: Permission }[] = [];

      for (const [itemId, permissions] of this.sharePermissions.entries()) {
        const permission = permissions.get(userId);
        if (permission) {
          sharedItems.push({ itemId, permission });
        }
      }

      return {
        success: true,
        data: sharedItems
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get shared items'
      };
    }
  }

  // Start a real-time collaboration session
  async startCollaborationSession(itemId: ItemId, itemType: 'note' | 'notebook' | 'mindmap', initiatorId: UserId): Promise<ServiceResponse<CollaborationSession>> {
    try {
      const session: CollaborationSession = {
        id: this.generateSessionId(),
        itemId,
        itemType,
        participants: [initiatorId],
        createdAt: new Date(),
        lastActivity: new Date(),
        isActive: true
      };

      this.activeSessions.set(session.id, session);

      return {
        success: true,
        data: session,
        message: 'Collaboration session started'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start collaboration session'
      };
    }
  }

  // Join a collaboration session
  async joinCollaborationSession(sessionId: string, userId: UserId): Promise<ServiceResponse<CollaborationSession>> {
    try {
      const session = this.activeSessions.get(sessionId);
      
      if (!session) {
        return {
          success: false,
          error: 'Collaboration session not found'
        };
      }

      if (!session.isActive) {
        return {
          success: false,
          error: 'Collaboration session is not active'
        };
      }

      // Check if user has permission to access the item
      const permissionResult = await this.checkPermission(session.itemId, userId);
      if (!permissionResult.success || !permissionResult.data) {
        return {
          success: false,
          error: 'No permission to access this item'
        };
      }

      // Add user to participants if not already present
      if (!session.participants.includes(userId)) {
        session.participants.push(userId);
        session.lastActivity = new Date();
      }

      return {
        success: true,
        data: session,
        message: 'Joined collaboration session'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join collaboration session'
      };
    }
  }

  // Leave a collaboration session
  async leaveCollaborationSession(sessionId: string, userId: UserId): Promise<ServiceResponse<boolean>> {
    try {
      const session = this.activeSessions.get(sessionId);
      
      if (!session) {
        return {
          success: false,
          error: 'Collaboration session not found'
        };
      }

      // Remove user from participants
      session.participants = session.participants.filter(id => id !== userId);
      session.lastActivity = new Date();

      // End session if no participants left
      if (session.participants.length === 0) {
        session.isActive = false;
      }

      return {
        success: true,
        data: true,
        message: 'Left collaboration session'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to leave collaboration session'
      };
    }
  }

  // Get active collaboration sessions for an item
  async getActiveSessionsForItem(itemId: ItemId): Promise<ServiceResponse<CollaborationSession[]>> {
    try {
      const sessions = Array.from(this.activeSessions.values())
        .filter(session => session.itemId === itemId && session.isActive);

      return {
        success: true,
        data: sessions
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get active sessions'
      };
    }
  }

  // Get activity log for an item
  async getActivityLog(itemId: ItemId, limit?: number): Promise<ServiceResponse<ActivityLog[]>> {
    try {
      let activities = this.activityLog
        .filter(activity => activity.itemId === itemId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      if (limit) {
        activities = activities.slice(0, limit);
      }

      return {
        success: true,
        data: activities
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get activity log'
      };
    }
  }

  // Get activity log for a user (items they have access to)
  async getUserActivityLog(userId: UserId, limit?: number): Promise<ServiceResponse<ActivityLog[]>> {
    try {
      // Get all items the user has access to
      const sharedItemsResult = await this.getSharedItems(userId);
      if (!sharedItemsResult.success || !sharedItemsResult.data) {
        return {
          success: true,
          data: []
        };
      }

      const accessibleItemIds = new Set(sharedItemsResult.data.map(item => item.itemId));

      let activities = this.activityLog
        .filter(activity => 
          activity.userId === userId || 
          accessibleItemIds.has(activity.itemId)
        )
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      if (limit) {
        activities = activities.slice(0, limit);
      }

      return {
        success: true,
        data: activities
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user activity log'
      };
    }
  }

  // Update user permission for an item
  async updatePermission(itemId: ItemId, userId: UserId, newPermission: Permission): Promise<ServiceResponse<boolean>> {
    try {
      const itemPermissions = this.sharePermissions.get(itemId);
      
      if (!itemPermissions) {
        return {
          success: false,
          error: 'Item not found or not shared'
        };
      }

      if (!itemPermissions.has(userId)) {
        return {
          success: false,
          error: 'User does not have access to this item'
        };
      }

      itemPermissions.set(userId, newPermission);

      return {
        success: true,
        data: true,
        message: 'Permission updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update permission'
      };
    }
  }

  // Private helper methods
  private async logActivity(activity: ActivityLog): Promise<void> {
    this.activityLog.push(activity);
    
    // Keep only the last 1000 activities to prevent memory issues
    if (this.activityLog.length > 1000) {
      this.activityLog.splice(0, this.activityLog.length - 1000);
    }
  }

  private generateId(): string {
    return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods for checking permissions
  canRead(permission: Permission | null): boolean {
    return permission !== null;
  }

  canWrite(permission: Permission | null): boolean {
    return permission === 'write' || permission === 'admin';
  }

  canAdmin(permission: Permission | null): boolean {
    return permission === 'admin';
  }

  // Clean up inactive sessions (should be called periodically)
  async cleanupInactiveSessions(maxInactiveMinutes: number = 30): Promise<ServiceResponse<number>> {
    try {
      const cutoff = new Date(Date.now() - maxInactiveMinutes * 60 * 1000);
      let cleaned = 0;

      for (const [sessionId, session] of this.activeSessions.entries()) {
        if (session.lastActivity < cutoff && session.isActive) {
          session.isActive = false;
          cleaned++;
        }
      }

      return {
        success: true,
        data: cleaned,
        message: `Cleaned up ${cleaned} inactive sessions`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cleanup sessions'
      };
    }
  }
}

// Export singleton instance
export const collaborationService = new CollaborationService();
export default collaborationService;
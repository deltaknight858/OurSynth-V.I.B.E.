// User Service for OurSynth-Eco noteflow
// Handles user management, preferences, and profile data

import { User, ServiceResponse, UserId } from '../types/core';

interface UserPreferences {
  theme?: 'light' | 'dark';
  defaultView?: 'notes' | 'notebooks' | 'mindmap';
  autoSave?: boolean;
  autoSaveInterval?: number; // in seconds
  notifications?: {
    email?: boolean;
    browser?: boolean;
    collaboration?: boolean;
    exports?: boolean;
  };
  privacy?: {
    allowAnalytics?: boolean;
    shareUsageData?: boolean;
  };
  ui?: {
    sidebarCollapsed?: boolean;
    defaultNoteType?: 'standard' | 'taskflow';
    showWizardItems?: boolean;
  };
}

interface UserStats {
  totalNotes: number;
  totalNotebooks: number;
  totalMindMaps: number;
  wizardGeneratedItems: number;
  collaborationsCount: number;
  lastActiveDate: Date;
  joinedDate: Date;
}

class UserService {
  private users: Map<UserId, User> = new Map();
  private userStats: Map<UserId, UserStats> = new Map();

  // Create a new user
  async create(userData: Omit<User, 'id'> & { id?: UserId }): Promise<ServiceResponse<User>> {
    try {
      const userId = userData.id || this.generateId();
      
      // Check if user already exists
      if (this.users.has(userId)) {
        return {
          success: false,
          error: 'User already exists'
        };
      }

      const user: User = {
        ...userData,
        id: userId,
        preferences: {
          theme: 'light',
          defaultView: 'notes',
          ...userData.preferences
        }
      };

      this.users.set(userId, user);

      // Initialize user stats
      const stats: UserStats = {
        totalNotes: 0,
        totalNotebooks: 0,
        totalMindMaps: 0,
        wizardGeneratedItems: 0,
        collaborationsCount: 0,
        lastActiveDate: new Date(),
        joinedDate: new Date()
      };

      this.userStats.set(userId, stats);

      return {
        success: true,
        data: user,
        message: 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      };
    }
  }

  // Get a user by ID
  async get(userId: UserId): Promise<ServiceResponse<User>> {
    try {
      const user = this.users.get(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user'
      };
    }
  }

  // Update a user
  async update(userId: UserId, updates: Partial<Omit<User, 'id'>>): Promise<ServiceResponse<User>> {
    try {
      const existingUser = this.users.get(userId);
      
      if (!existingUser) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const updatedUser: User = {
        ...existingUser,
        ...updates,
        id: userId, // Ensure ID doesn't change
        preferences: {
          ...existingUser.preferences,
          ...updates.preferences
        }
      };

      this.users.set(userId, updatedUser);

      // Update last active date
      await this.updateLastActive(userId);

      return {
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      };
    }
  }

  // Delete a user
  async delete(userId: UserId): Promise<ServiceResponse<boolean>> {
    try {
      const userDeleted = this.users.delete(userId);
      const statsDeleted = this.userStats.delete(userId);
      
      if (!userDeleted) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      };
    }
  }

  // Search users by email or name
  async search(query: string): Promise<ServiceResponse<User[]>> {
    try {
      const queryLower = query.toLowerCase();
      const users = Array.from(this.users.values())
        .filter(user =>
          user.email.toLowerCase().includes(queryLower) ||
          user.name?.toLowerCase().includes(queryLower)
        );

      return {
        success: true,
        data: users
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search users'
      };
    }
  }

  // Get user preferences
  async getPreferences(userId: UserId): Promise<ServiceResponse<UserPreferences>> {
    try {
      const user = this.users.get(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user.preferences || {}
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user preferences'
      };
    }
  }

  // Update user preferences
  async updatePreferences(userId: UserId, preferences: Partial<UserPreferences>): Promise<ServiceResponse<UserPreferences>> {
    try {
      const user = this.users.get(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const updatedPreferences = {
        ...user.preferences,
        ...preferences,
        notifications: {
          ...user.preferences?.notifications,
          ...preferences.notifications
        },
        privacy: {
          ...user.preferences?.privacy,
          ...preferences.privacy
        },
        ui: {
          ...user.preferences?.ui,
          ...preferences.ui
        }
      };

      user.preferences = updatedPreferences;
      this.users.set(userId, user);

      await this.updateLastActive(userId);

      return {
        success: true,
        data: updatedPreferences,
        message: 'Preferences updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update preferences'
      };
    }
  }

  // Get user statistics
  async getStats(userId: UserId): Promise<ServiceResponse<UserStats>> {
    try {
      const stats = this.userStats.get(userId);
      
      if (!stats) {
        return {
          success: false,
          error: 'User stats not found'
        };
      }

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user stats'
      };
    }
  }

  // Update user statistics
  async updateStats(userId: UserId, updates: Partial<UserStats>): Promise<ServiceResponse<UserStats>> {
    try {
      const existingStats = this.userStats.get(userId);
      
      if (!existingStats) {
        return {
          success: false,
          error: 'User stats not found'
        };
      }

      const updatedStats = {
        ...existingStats,
        ...updates,
        lastActiveDate: new Date()
      };

      this.userStats.set(userId, updatedStats);

      return {
        success: true,
        data: updatedStats,
        message: 'User stats updated'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user stats'
      };
    }
  }

  // Increment stat counters
  async incrementNotesCount(userId: UserId, isWizardGenerated = false): Promise<ServiceResponse<boolean>> {
    try {
      const stats = this.userStats.get(userId);
      if (!stats) return { success: false, error: 'User stats not found' };

      stats.totalNotes++;
      if (isWizardGenerated) {
        stats.wizardGeneratedItems++;
      }
      stats.lastActiveDate = new Date();

      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to increment notes count'
      };
    }
  }

  async incrementNotebooksCount(userId: UserId, isWizardGenerated = false): Promise<ServiceResponse<boolean>> {
    try {
      const stats = this.userStats.get(userId);
      if (!stats) return { success: false, error: 'User stats not found' };

      stats.totalNotebooks++;
      if (isWizardGenerated) {
        stats.wizardGeneratedItems++;
      }
      stats.lastActiveDate = new Date();

      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to increment notebooks count'
      };
    }
  }

  async incrementMindMapsCount(userId: UserId, isWizardGenerated = false): Promise<ServiceResponse<boolean>> {
    try {
      const stats = this.userStats.get(userId);
      if (!stats) return { success: false, error: 'User stats not found' };

      stats.totalMindMaps++;
      if (isWizardGenerated) {
        stats.wizardGeneratedItems++;
      }
      stats.lastActiveDate = new Date();

      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to increment mind maps count'
      };
    }
  }

  async incrementCollaborationsCount(userId: UserId): Promise<ServiceResponse<boolean>> {
    try {
      const stats = this.userStats.get(userId);
      if (!stats) return { success: false, error: 'User stats not found' };

      stats.collaborationsCount++;
      stats.lastActiveDate = new Date();

      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to increment collaborations count'
      };
    }
  }

  // Update last active date
  async updateLastActive(userId: UserId): Promise<ServiceResponse<boolean>> {
    try {
      const stats = this.userStats.get(userId);
      if (!stats) return { success: false, error: 'User stats not found' };

      stats.lastActiveDate = new Date();
      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update last active date'
      };
    }
  }

  // Check if user exists
  async exists(userId: UserId): Promise<boolean> {
    return this.users.has(userId);
  }

  // Get all users (admin function)
  async list(options?: {
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'email' | 'joinedDate' | 'lastActive';
    sortOrder?: 'asc' | 'desc';
  }): Promise<ServiceResponse<User[]>> {
    try {
      let users = Array.from(this.users.values());

      // Sort users
      if (options?.sortBy) {
        users.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (options.sortBy) {
            case 'name':
              aValue = a.name || '';
              bValue = b.name || '';
              break;
            case 'email':
              aValue = a.email;
              bValue = b.email;
              break;
            case 'joinedDate':
              aValue = this.userStats.get(a.id)?.joinedDate || new Date();
              bValue = this.userStats.get(b.id)?.joinedDate || new Date();
              break;
            case 'lastActive':
              aValue = this.userStats.get(a.id)?.lastActiveDate || new Date();
              bValue = this.userStats.get(b.id)?.lastActiveDate || new Date();
              break;
            default:
              aValue = a.id;
              bValue = b.id;
          }

          const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          return options.sortOrder === 'desc' ? -comparison : comparison;
        });
      }

      // Apply pagination
      if (options?.offset) {
        users = users.slice(options.offset);
      }
      if (options?.limit) {
        users = users.slice(0, options.limit);
      }

      return {
        success: true,
        data: users
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list users'
      };
    }
  }

  // Get user by email
  async getByEmail(email: string): Promise<ServiceResponse<User>> {
    try {
      const user = Array.from(this.users.values())
        .find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user by email'
      };
    }
  }

  // Private helper methods
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize with existing data
  async loadUsers(users: User[]): Promise<ServiceResponse<boolean>> {
    try {
      users.forEach(user => {
        this.users.set(user.id, user);
        
        // Initialize stats if not exists
        if (!this.userStats.has(user.id)) {
          this.userStats.set(user.id, {
            totalNotes: 0,
            totalNotebooks: 0,
            totalMindMaps: 0,
            wizardGeneratedItems: 0,
            collaborationsCount: 0,
            lastActiveDate: new Date(),
            joinedDate: new Date()
          });
        }
      });

      return {
        success: true,
        data: true,
        message: `Loaded ${users.length} users`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load users'
      };
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
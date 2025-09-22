

// Base interface for all database entities
export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
}

// User profile data
export interface UserProfile extends BaseEntity {
  userId: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  bio?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: boolean;
  autoTranslate: boolean;
}

// Project entity
export interface Project extends BaseEntity {
  name: string;
  description: string;
  ownerId: string;
  collaborators: string[]; // Array of user IDs
  isPublic: boolean;
  tags: string[];
}

// Document entity
export interface Document extends BaseEntity {
  projectId: string;
  title: string;
  content: string;
  ownerId: string;
  lastEditedBy: string;
  version: number;
}

// Comment entity
export interface Comment extends BaseEntity {
  documentId: string;
  userId: string;
  content: string;
  parentId?: string; // For nested comments
}

// Activity log entity
export interface ActivityLog extends BaseEntity {
  entityId: string; // ID of the entity this activity relates to
  entityType: "project" | "document" | "comment";
  action: "create" | "update" | "delete" | "share";
  userId: string;
  details?: Record<string, any>;
}

// Notification entity
export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  relatedEntityId?: string;
  relatedEntityType?: "project" | "document" | "comment";
}

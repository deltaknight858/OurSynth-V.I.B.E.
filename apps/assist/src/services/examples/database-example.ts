
import { 
  RealtimeDatabaseService, 
  FirestoreService, 
  createDatabaseService 
} from "@/services/database";
import { 
  UserProfile, 
  Project, 
  Document, 
  Comment, 
  ActivityLog, 
  Notification 
} from "@/types/database";

// Example of creating database services for different entity types
const userProfileService = createDatabaseService<UserProfile>("firestore", "userProfiles");
const projectService = createDatabaseService<Project>("firestore", "projects");
const documentService = createDatabaseService<Document>("firestore", "documents");
const commentService = createDatabaseService<Comment>("realtime", "comments");
const activityLogService = createDatabaseService<ActivityLog>("realtime", "activityLogs");
const notificationService = createDatabaseService<Notification>("realtime", "notifications");

// Example: Create a new user profile
export async function createUserProfile(userId: string, email: string, displayName?: string): Promise<UserProfile> {
  try {
    const userProfileData: Omit<UserProfile, "id" | "createdAt" | "updatedAt"> = {
      userId,
      email,
      displayName,
      preferences: {
        theme: "system",
        language: "en",
        notifications: true,
        autoTranslate: false
      }
    };
    
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  return await (userProfileService as FirestoreService<UserProfile>).create(id, userProfileData);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Failed to create user profile");
  }
}

// Example: Create a new project
export async function createProject(
  name: string, 
  description: string, 
  ownerId: string, 
  isPublic: boolean = false,
  tags: string[] = []
): Promise<Project> {
  try {
    const projectData: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
      name,
      description,
      ownerId,
      collaborators: [],
      isPublic,
      tags
    };
    
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  return await (projectService as FirestoreService<Project>).create(id, projectData);
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Failed to create project");
  }
}

// Example: Add a collaborator to a project
export async function addCollaborator(projectId: string, collaboratorId: string): Promise<Project> {
  try {
    // Get the current project
    const project = await (projectService as FirestoreService<Project>).getById(projectId);
    
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    // Check if the collaborator is already added
    if (project.collaborators.includes(collaboratorId)) {
      return project;
    }
    
    // Add the collaborator
    const updatedCollaborators = [...project.collaborators, collaboratorId];
    
    // Update the project
    return await (projectService as FirestoreService<Project>).update(projectId, {
      collaborators: updatedCollaborators
    });
  } catch (error) {
    console.error("Error adding collaborator:", error);
    throw new Error("Failed to add collaborator to project");
  }
}

// Example: Create a document in a project
export async function createDocument(
  projectId: string,
  title: string,
  content: string,
  ownerId: string
): Promise<Document> {
  try {
    const documentData: Omit<Document, "id" | "createdAt" | "updatedAt"> = {
      projectId,
      title,
      content,
      ownerId,
      lastEditedBy: ownerId,
      version: 1
    };
    
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  return await (documentService as FirestoreService<Document>).create(id, documentData);
  } catch (error) {
    console.error("Error creating document:", error);
    throw new Error("Failed to create document");
  }
}

// Example: Update a document
export async function updateDocument(
  documentId: string,
  content: string,
  userId: string
): Promise<Document> {
  try {
    // Get the current document
    const document = await (documentService as FirestoreService<Document>).getById(documentId);
    
    if (!document) {
      throw new Error(`Document with ID ${documentId} not found`);
    }
    
    // Update the document
    return await (documentService as FirestoreService<Document>).update(documentId, {
      content,
      lastEditedBy: userId,
      version: document.version + 1
    });
  } catch (error) {
    console.error("Error updating document:", error);
    throw new Error("Failed to update document");
  }
}

// Example: Add a comment to a document
export async function addComment(
  documentId: string,
  userId: string,
  content: string,
  parentId?: string
): Promise<Comment> {
  try {
    const commentData: Omit<Comment, "id" | "createdAt" | "updatedAt"> = {
      documentId,
      userId,
      content,
      parentId
    };
    
  return await (commentService as RealtimeDatabaseService<Comment>).create(commentData);
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
}

// Example: Log an activity
export async function logActivity(
  entityId: string,
  entityType: "project" | "document" | "comment",
  action: "create" | "update" | "delete" | "share",
  userId: string,
  details?: Record<string, any>
): Promise<ActivityLog> {
  try {
    const activityData: Omit<ActivityLog, "id" | "createdAt" | "updatedAt"> = {
      entityId,
      entityType,
      action,
      userId,
      details
    };
    
  return await (activityLogService as RealtimeDatabaseService<ActivityLog>).create(activityData);
  } catch (error) {
    console.error("Error logging activity:", error);
    throw new Error("Failed to log activity");
  }
}

// Example: Create a notification
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error",
  relatedEntityId?: string,
  relatedEntityType?: "project" | "document" | "comment"
): Promise<Notification> {
  try {
    const notificationData: Omit<Notification, "id" | "createdAt" | "updatedAt"> = {
      userId,
      title,
      message,
      type,
      isRead: false,
      relatedEntityId,
      relatedEntityType
    };
    
  return await (notificationService as RealtimeDatabaseService<Notification>).create(notificationData);
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Failed to create notification");
  }
}

// Example: Mark a notification as read
export async function markNotificationAsRead(notificationId: string): Promise<Notification> {
  try {
    return await (notificationService as RealtimeDatabaseService<Notification>).update(notificationId, {
      isRead: true
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Failed to mark notification as read");
  }
}

// Example: Subscribe to a user's notifications
export function subscribeToUserNotifications(
  userId: string, 
  callback: (notifications: Notification[]) => void
): () => void {
  try {
    return (notificationService as RealtimeDatabaseService<Notification>).subscribeToQuery("userId", userId, callback);
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    throw new Error("Failed to subscribe to notifications");
  }
}

// Example: Get all documents for a project
export async function getProjectDocuments(projectId: string): Promise<Document[]> {
  try {
    return await (documentService as FirestoreService<Document>).queryByField("projectId", projectId);
  } catch (error) {
    console.error("Error getting project documents:", error);
    throw new Error("Failed to get project documents");
  }
}

// Example: Subscribe to project documents
export function subscribeToProjectDocuments(
  projectId: string, 
  callback: (documents: Document[]) => void
): () => void {
  try {
    return (documentService as FirestoreService<Document>).subscribeToQuery("projectId", projectId, callback);
  } catch (error) {
    console.error("Error subscribing to project documents:", error);
    throw new Error("Failed to subscribe to project documents");
  }
}

// Example: Get all comments for a document
export async function getDocumentComments(documentId: string): Promise<Comment[]> {
  try {
    return await (commentService as RealtimeDatabaseService<Comment>).queryByField("documentId", documentId);
  } catch (error) {
    console.error("Error getting document comments:", error);
    throw new Error("Failed to get document comments");
  }
}

// Example: Subscribe to document comments
export function subscribeToDocumentComments(
  documentId: string, 
  callback: (comments: Comment[]) => void
): () => void {
  try {
    return (commentService as RealtimeDatabaseService<Comment>).subscribeToQuery("documentId", documentId, callback);
  } catch (error) {
    console.error("Error subscribing to document comments:", error);
    throw new Error("Failed to subscribe to document comments");
  }
}

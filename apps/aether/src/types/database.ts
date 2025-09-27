
import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: {
    theme: "light" | "dark";
    notifications: boolean;
  };
  role: "user" | "admin";
}

export interface WorkflowNode {
  id: string;
  type: "file" | "logic" | "integration" | "trigger" | "action";
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    description?: string;
    configuration: Record<string, any>;
  };
  inputs: {
    [key: string]: {
      type: string;
      required: boolean;
    };
  };
  outputs: {
    [key: string]: {
      type: string;
    };
  };
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle: string;
  targetHandle: string;
  label?: string;
}

export interface WorkflowVersion {
  version: number;
  createdAt: Timestamp;
  createdBy: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  metadata: {
    description: string;
    tags: string[];
  };
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "draft" | "active" | "archived";
  collaborators: Array<{
    userId: string;
    role: "viewer" | "editor" | "owner";
    addedAt: Timestamp;
  }>;
  isPublic: boolean;
  currentVersion: number;
  versions: WorkflowVersion[];
  templateId?: string;
  tags: string[];
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  previewImage?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  tags: string[];
  isPublic: boolean;
  usageCount: number;
}

export interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  workflowId: string;
  uploadedBy: string;
  uploadedAt: Timestamp;
  lastModified: Timestamp;
  isDeleted: boolean;
}

export type DocumentSnapshot<T> = {
  id: string;
  data: () => T;
  exists: () => boolean;
}

// Core types for the OurSynth-Eco noteflow service layer
// Unified type definitions for consistent data flow across shell views

export type ItemId = string;
export type UserId = string;
export type CapsuleId = string;

// Wizard context tracking
export interface WizardMeta {
  isWizardGenerated: boolean;
  wizardId?: string;
  projectType?: 'component' | 'page' | 'feature' | 'fullapp' | 'taskflow';
  pathwaysContext?: {
    template?: string;
    framework?: string;
    features?: string[];
  };
  createdAt?: Date;
}

// Media attachments
export interface MediaAttachment {
  id: string;
  kind: 'image' | 'audio' | 'video' | 'file';
  url: string;
  mime?: string;
  meta?: Record<string, unknown>;
}

// Task information for TaskFlow notes
export interface TaskInfo {
  title: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  assignedAgent?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

// Core Note interface with wizard tracking
export interface Note {
  id: ItemId;
  content: string;
  title?: string;
  tags?: string[];
  timestamp: Date;
  userId?: UserId;
  attachments?: MediaAttachment[];
  taskInfo?: TaskInfo; // For TaskFlow enhancement
  noteType?: 'standard' | 'taskflow';
  wizardMeta?: WizardMeta; // Track wizard-generated items
}

// Notebook interface with wizard tracking
export interface Notebook {
  id: ItemId;
  title: string;
  description?: string;
  notes: Note[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: UserId;
  isShared?: boolean;
  collaborators?: UserId[];
  wizardMeta?: WizardMeta; // Track wizard-generated items
}

// Mind map node interface
export interface MindMapNode {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  tags?: string[];
  x?: number;
  y?: number;
  connections?: string[];
  userId?: UserId;
  createdAt: Date;
  wizardMeta?: WizardMeta;
}

// Mind map edge interface
export interface MindMapEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  type?: string;
  weight?: number;
}

// Mind map interface
export interface MindMap {
  id: ItemId;
  title: string;
  description?: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  createdAt: Date;
  updatedAt: Date;
  userId?: UserId;
  wizardMeta?: WizardMeta;
}

// User interface
export interface User {
  id: UserId;
  email: string;
  name?: string;
  avatar?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    defaultView?: 'notes' | 'notebooks' | 'mindmap';
  };
}

// Export formats
export type ExportFormat = 'pdf' | 'html' | 'markdown' | 'json' | 'csv';

// Collaboration permissions
export type Permission = 'read' | 'write' | 'admin';

// Search options
export interface SearchOptions {
  query: string;
  tags?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  includeWizardGenerated?: boolean;
  userId?: UserId;
}

// Service response interfaces
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Context interfaces for cross-view synchronization
export interface ViewContext {
  activeView: 'notes' | 'notebooks' | 'mindmap';
  currentItem?: Note | Notebook | MindMap;
  selectedItems?: ItemId[];
  filters?: {
    tags?: string[];
    wizardGenerated?: boolean;
  };
}
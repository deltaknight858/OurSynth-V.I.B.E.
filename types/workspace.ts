// workspace.ts
// Shared types for notes, notebooks, and workspace entities in OurSynth-V.I.B.E

export interface Note {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  userId: string;
  isPinned?: boolean;
  tags?: string[];
  attachments?: Attachment[];
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export interface Notebook {
  id: string;
  title: string;
  description?: string;
  userId: string;
  notes?: Note[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Attachment {
  id?: string;
  fileName: string;
  fileType: string;
  url?: string;
  size?: number;
  uploadedAt?: string;
}

export interface Workspace {
  id: string;
  title: string;
  ownerId: string;
  notebooks: Notebook[];
  members?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Utility types
export type NoteTag = string;
export type UserId = string;

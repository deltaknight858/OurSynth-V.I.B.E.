/**
 * Capsule Schema Definitions
 * 
 * Capsules are modular units of knowledge/workflow within the VIBE system.
 * They store contextual information, enable intelligent recall, and build
 * relationships over time.
 */

export interface CapsuleMetadata {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  category: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastAccessedAt?: Date;
  accessCount: number;
}

export interface CapsuleContent {
  type: 'text' | 'code' | 'image' | 'link' | 'workflow' | 'structured';
  data: any;
  format?: string; // mime type or format identifier
  encoding?: string;
  checksum?: string;
}

export interface CapsuleRelationship {
  targetCapsuleId: string;
  relationship: 
    | 'references' 
    | 'depends-on' 
    | 'related-to' 
    | 'supersedes' 
    | 'derived-from'
    | 'implements'
    | 'contains'
    | 'part-of';
  strength: number; // 0.0 to 1.0
  metadata?: Record<string, any>;
}

export interface CapsuleProvenance {
  action: string;
  timestamp: Date;
  actor: string; // user or agent ID
  description: string;
  context?: Record<string, any>;
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
}

export interface CapsuleAnalytics {
  views: number;
  edits: number;
  shares: number;
  likes: number;
  lastViewed: Date;
  viewDuration: number; // average in seconds
  searchRank?: number;
  relevanceScore?: number;
}

/**
 * Core Capsule Interface
 */
export interface ICapsule {
  metadata: CapsuleMetadata;
  content: CapsuleContent[];
  relationships: CapsuleRelationship[];
  provenance: CapsuleProvenance[];
  analytics: CapsuleAnalytics;
}

/**
 * Capsule Query Interface
 */
export interface CapsuleQuery {
  // Text search
  search?: string;
  
  // Metadata filters
  tags?: string[];
  category?: string;
  createdBy?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  
  // Content filters
  contentType?: string[];
  hasRelationships?: boolean;
  
  // Sorting
  sortBy?: 'created' | 'updated' | 'accessed' | 'views' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  
  // Pagination
  limit?: number;
  offset?: number;
}

export interface CapsuleSearchResult {
  capsule: ICapsule;
  score: number;
  highlights?: Array<{
    field: string;
    fragments: string[];
  }>;
  explanation?: string;
}

/**
 * Capsule Repository Interface
 */
export interface ICapsuleRepository {
  /**
   * Create a new capsule
   */
  create(capsule: Omit<ICapsule, 'metadata'> & {
    metadata: Omit<CapsuleMetadata, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'accessCount'>
  }): Promise<ICapsule>;

  /**
   * Get capsule by ID
   */
  getById(id: string): Promise<ICapsule | null>;

  /**
   * Update an existing capsule
   */
  update(id: string, updates: Partial<ICapsule>): Promise<ICapsule>;

  /**
   * Delete a capsule
   */
  delete(id: string): Promise<boolean>;

  /**
   * Search and query capsules
   */
  search(query: CapsuleQuery): Promise<{
    results: CapsuleSearchResult[];
    total: number;
    facets?: Record<string, Array<{ value: string; count: number }>>;
  }>;

  /**
   * Get related capsules
   */
  getRelated(id: string, relationship?: string, limit?: number): Promise<ICapsule[]>;

  /**
   * Add relationship between capsules
   */
  addRelationship(
    sourceId: string, 
    relationship: CapsuleRelationship
  ): Promise<void>;

  /**
   * Remove relationship
   */
  removeRelationship(
    sourceId: string, 
    targetId: string, 
    relationship: string
  ): Promise<void>;

  /**
   * Record provenance event
   */
  recordProvenance(id: string, event: Omit<CapsuleProvenance, 'timestamp'>): Promise<void>;

  /**
   * Update analytics
   */
  updateAnalytics(id: string, analytics: Partial<CapsuleAnalytics>): Promise<void>;
}

/**
 * Memory Interface - Higher-level knowledge management
 */
export interface IMemory {
  /**
   * Store knowledge in a capsule
   */
  remember(
    title: string, 
    content: any, 
    context?: Record<string, any>
  ): Promise<ICapsule>;

  /**
   * Retrieve knowledge by query
   */
  recall(query: string, context?: Record<string, any>): Promise<CapsuleSearchResult[]>;

  /**
   * Update existing knowledge
   */
  update(
    capsuleId: string, 
    content: any, 
    context?: Record<string, any>
  ): Promise<ICapsule>;

  /**
   * Forget (delete) knowledge
   */
  forget(capsuleId: string, reason?: string): Promise<boolean>;

  /**
   * Build knowledge graph connections
   */
  connect(
    sourceId: string, 
    targetId: string, 
    relationship: string, 
    strength?: number
  ): Promise<void>;

  /**
   * Get knowledge timeline for a user
   */
  getTimeline(
    userId: string, 
    limit?: number
  ): Promise<Array<{
    capsule: ICapsule;
    event: CapsuleProvenance;
  }>>;

  /**
   * Get knowledge insights and analytics
   */
  getInsights(userId: string): Promise<{
    totalCapsules: number;
    categoriesUsed: string[];
    mostActiveDay: string;
    knowledgeGraph: {
      nodes: number;
      edges: number;
      clusters: number;
    };
    recommendations: ICapsule[];
  }>;
}

// Pre-defined capsule types
export namespace CapsuleTypes {
  export interface TextCapsule extends ICapsule {
    content: Array<CapsuleContent & { 
      type: 'text'; 
      data: string; 
      format?: 'markdown' | 'plain' | 'html';
    }>;
  }

  export interface CodeCapsule extends ICapsule {
    content: Array<CapsuleContent & { 
      type: 'code'; 
      data: string; 
      format: string; // language identifier
    }>;
  }

  export interface WorkflowCapsule extends ICapsule {
    content: Array<CapsuleContent & { 
      type: 'workflow'; 
      data: {
        steps: Array<{
          id: string;
          name: string;
          description: string;
          agent?: string;
          input?: any;
          output?: any;
        }>;
        connections: Array<{
          from: string;
          to: string;
          condition?: string;
        }>;
      };
    }>;
  }

  export interface LinkCapsule extends ICapsule {
    content: Array<CapsuleContent & { 
      type: 'link'; 
      data: {
        url: string;
        title?: string;
        description?: string;
        favicon?: string;
      };
    }>;
  }
}
// TypeScript interfaces for OurSynth Projects & Nodes
// Matches the Supabase schema for type safety

export interface Project {
  id: number;
  name: string;
  user_id: string;
  description?: string;
  thumbnail_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  project_data?: any;
}

export interface ProjectWithStats extends Project {
  node_count: number;
  last_node_update?: string;
}

export interface UserProject extends Project {
  template_id?: string;
  nodes: Node[];
  components?: any[]; // Component instances
  settings?: {
    theme?: string;
    layout?: string;
    customStyles?: Record<string, any>;
  };
}

// Base node interface
export interface Node {
  id: number;
  project_id: number;
  type: string;
  props: Record<string, any>; // JSONB field - flexible props based on component type
  x: number;
  y: number;
  width?: number;
  height?: number;
  z_index: number;
  parent_id?: number;
  locked: boolean;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface NodeWithDepth extends Node {
  depth: number;
  path: number[];
}

// Specific node type interfaces for better type safety
export interface ButtonNode extends Node {
  type: 'Button';
  props: {
    text: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    onClick?: string; // Function name or handler
    disabled?: boolean;
    style?: React.CSSProperties;
  };
}

export interface CardNode extends Node {
  type: 'Card';
  props: {
    title?: string;
    content?: string;
    imageUrl?: string;
    elevation?: number;
    variant?: 'filled' | 'outlined' | 'elevated';
    style?: React.CSSProperties;
  };
}

export interface InputNode extends Node {
  type: 'Input';
  props: {
    label?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    validation?: {
      pattern?: string;
      message?: string;
      min?: number;
      max?: number;
    };
    style?: React.CSSProperties;
  };
}

export interface TextNode extends Node {
  type: 'Text';
  props: {
    content: string;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
    color?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    style?: React.CSSProperties;
  };
}

export interface ImageNode extends Node {
  type: 'Image';
  props: {
    src: string;
    alt?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    borderRadius?: number;
    style?: React.CSSProperties;
  };
}

// Union type for all node types
export type TypedNode = ButtonNode | CardNode | InputNode | TextNode | ImageNode | Node;

// Canvas position and size types
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds extends Position, Size {}

// Database operation types
export interface CreateProjectInput {
  name: string;
  description?: string;
  thumbnail_url?: string;
  is_public?: boolean;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  thumbnail_url?: string;
  is_public?: boolean;
}

export interface CreateNodeInput {
  project_id: number;
  type: string;
  props: Record<string, any>;
  x: number;
  y: number;
  width?: number;
  height?: number;
  z_index?: number;
  parent_id?: number;
  locked?: boolean;
  visible?: boolean;
}

export interface UpdateNodeInput {
  type?: string;
  props?: Record<string, any>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  z_index?: number;
  parent_id?: number;
  locked?: boolean;
  visible?: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Canvas/Editor state types
export interface CanvasState {
  selectedNodes: number[];
  draggedNode?: number;
  zoom: number;
  pan: Position;
  gridSize: number;
  snapToGrid: boolean;
}

export interface EditorAction {
  type: 'CREATE_NODE' | 'UPDATE_NODE' | 'DELETE_NODE' | 'MOVE_NODE' | 'RESIZE_NODE' | 'SELECT_NODE' | 'DESELECT_ALL';
  payload: any;
}

// Component registry type for dynamic rendering
export interface ComponentDefinition {
  type: string;
  name: string;
  category: 'Layout' | 'Input' | 'Display' | 'Navigation' | 'Feedback';
  icon: React.ComponentType;
  defaultProps: Record<string, any>;
  defaultSize: Size;
  configSchema: Record<string, any>; // JSON Schema for props validation
}

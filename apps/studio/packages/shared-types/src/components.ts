// Component-related types
export interface ComponentStyle {
  width?: number | string;
  height?: number | string;
  color?: string;
  backgroundColor?: string;
  padding?: string | number;
  margin?: string | number;
  border?: string;
  borderRadius?: string | number;
  [key: string]: unknown;
}

export interface ComponentDefinition {
  id: string;
  type: string;
  name: string;
  displayName?: string;
  icon: any; // Can be IconType from react-icons or React.ComponentType
  color: string;
  category: string;
  description?: string;
  keywords?: string[];
  defaultProps: Record<string, unknown>;
  width?: number;
  height?: number;
  style?: ComponentStyle;
  configSchema?: Record<string, any>; // JSON Schema for props validation
}

export interface DraggableComponentProps {
  component: ComponentDefinition;
  categoryColor: string;
  isFavorite?: boolean;
  onToggleFavorite?: (componentType: string) => void;
  onAddComponent?: (component: ComponentDefinition) => void;
}

export interface ComponentInstance extends ComponentDefinition {
  instanceId: string;
  props: Record<string, unknown>;
  children?: ComponentInstance[];
}

export interface ComponentCategory {
  name: string;
  color: string;
  icon: any;
  description?: string;
}
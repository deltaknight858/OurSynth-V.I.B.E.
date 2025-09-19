-- OurSynth Projects & Nodes Schema
-- This schema supports a visual canvas-based project system where users can create projects
-- and add draggable/configurable nodes (components) to them

-- Enable RLS (Row Level Security) for multi-tenant support
-- Run this in Supabase SQL Editor or as a migration

-- 1. Projects Table
-- Stores user projects with metadata
CREATE TABLE IF NOT EXISTS projects (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text,
  thumbnail_url text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Nodes Table 
-- Stores individual components/elements within projects
CREATE TABLE IF NOT EXISTS nodes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id bigint NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,           -- Component type: "Button", "Card", "Input", etc.
  props jsonb NOT NULL,         -- Serialized React props/configuration
  x integer NOT NULL,           -- Canvas X coordinate
  y integer NOT NULL,           -- Canvas Y coordinate  
  width integer DEFAULT 100,    -- Component width (optional)
  height integer DEFAULT 50,    -- Component height (optional)
  z_index integer DEFAULT 0,    -- Layer ordering
  parent_id bigint REFERENCES nodes(id) ON DELETE CASCADE, -- For nested components
  locked boolean DEFAULT false, -- Prevent accidental editing
  visible boolean DEFAULT true, -- Show/hide on canvas
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nodes_project_id ON nodes(project_id);
CREATE INDEX IF NOT EXISTS idx_nodes_parent_id ON nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_nodes_type ON nodes(type);

-- 4. Row Level Security (RLS) Policies
-- Enable RLS on both tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;

-- Projects: Users can only see/edit their own projects or public ones
CREATE POLICY "Users can view own projects and public projects" ON projects
  FOR SELECT 
  USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE 
  USING (user_id = auth.uid());

-- Nodes: Users can only access nodes in projects they own
CREATE POLICY "Users can view nodes in accessible projects" ON nodes
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = nodes.project_id 
      AND (projects.user_id = auth.uid() OR projects.is_public = true)
    )
  );

CREATE POLICY "Users can insert nodes in own projects" ON nodes
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = nodes.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update nodes in own projects" ON nodes
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = nodes.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete nodes in own projects" ON nodes
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = nodes.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- 5. Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nodes_updated_at 
  BEFORE UPDATE ON nodes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Example Data Types for Node Props
-- The props jsonb column can store different schemas based on node type:
--
-- Button node example:
-- {
--   "text": "Click Me",
--   "variant": "primary",
--   "size": "medium", 
--   "onClick": "handleClick",
--   "disabled": false,
--   "style": {
--     "backgroundColor": "#007bff",
--     "color": "white"
--   }
-- }
--
-- Card node example:  
-- {
--   "title": "Card Title",
--   "content": "Card description text",
--   "imageUrl": "https://example.com/image.jpg",
--   "elevation": 2,
--   "variant": "outlined"
-- }
--
-- Input node example:
-- {
--   "label": "Email Address", 
--   "type": "email",
--   "placeholder": "Enter your email",
--   "required": true,
--   "validation": {
--     "pattern": "^[^@]+@[^@]+\.[^@]+$",
--     "message": "Please enter a valid email"
--   }
-- }

-- 7. Useful Views (Optional)
-- View for projects with node counts
CREATE OR REPLACE VIEW projects_with_stats AS
SELECT 
  p.*,
  COUNT(n.id) as node_count,
  MAX(n.updated_at) as last_node_update
FROM projects p
LEFT JOIN nodes n ON p.id = n.project_id
GROUP BY p.id;

-- View for flattened node hierarchy (for nested components)
CREATE OR REPLACE VIEW nodes_with_depth AS
WITH RECURSIVE node_hierarchy AS (
  -- Base case: root nodes (no parent)
  SELECT 
    id, project_id, type, props, x, y, width, height, z_index,
    parent_id, locked, visible, created_at, updated_at,
    0 as depth,
    ARRAY[id] as path
  FROM nodes 
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case: child nodes
  SELECT 
    n.id, n.project_id, n.type, n.props, n.x, n.y, n.width, n.height, n.z_index,
    n.parent_id, n.locked, n.visible, n.created_at, n.updated_at,
    nh.depth + 1,
    nh.path || n.id
  FROM nodes n
  JOIN node_hierarchy nh ON n.parent_id = nh.id
)
SELECT * FROM node_hierarchy;

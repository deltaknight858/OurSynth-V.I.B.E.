
-- Memory Phase 1 Schema
-- Run this in your Supabase SQL Editor to create memory tables

-- Create memory_nodes table
CREATE TABLE IF NOT EXISTS public.memory_nodes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    content text,
    type text DEFAULT 'default',
    metadata jsonb DEFAULT '{}',
    tags text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_modified timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create memory_edges table
CREATE TABLE IF NOT EXISTS public.memory_edges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    source_node_id uuid REFERENCES memory_nodes ON DELETE CASCADE NOT NULL,
    target_node_id uuid REFERENCES memory_nodes ON DELETE CASCADE NOT NULL,
    label text,
    type text DEFAULT 'default',
    weight real DEFAULT 1.0,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_modified timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(source_node_id, target_node_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memory_nodes_user_id ON memory_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_created_at ON memory_nodes(created_at);
CREATE INDEX IF NOT EXISTS idx_memory_edges_user_id ON memory_edges(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_edges_source_node ON memory_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_memory_edges_target_node ON memory_edges(target_node_id);

-- Create triggers for automatic last_modified updates
CREATE TRIGGER update_memory_nodes_last_modified
    BEFORE UPDATE ON memory_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified_column();

CREATE TRIGGER update_memory_edges_last_modified
    BEFORE UPDATE ON memory_edges
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified_column();

-- Success message
SELECT 'Memory schema created successfully!' as message;
=======
-- Memory System Phase 1 Schema
-- Run this SQL in the Supabase SQL editor to create the memory tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create memory_nodes table
CREATE TABLE IF NOT EXISTS memory_nodes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT NOT NULL DEFAULT 'note', -- 'note', 'conversation', 'insight', 'task', etc.
    source_app TEXT, -- 'synthnote', 'chat', 'voice', etc.
    conversation_id UUID, -- Link to conversation if applicable
    message_id UUID, -- Link to specific message if applicable
    importance INTEGER DEFAULT 1 CHECK (importance >= 1 AND importance <= 10),
    metadata JSONB DEFAULT '{}', -- Flexible storage for additional data
    -- embedding VECTOR(1536), -- Uncomment when you have OpenAI embeddings set up
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create memory_edges table for relationships between memory nodes
CREATE TABLE IF NOT EXISTS memory_edges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source_id UUID NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'relates_to', -- 'relates_to', 'follows_from', 'contradicts', etc.
    weight FLOAT DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1), -- Strength of relationship
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure we don't create self-loops or duplicate edges
    CONSTRAINT no_self_loops CHECK (source_id != target_id),
    CONSTRAINT unique_edges UNIQUE (source_id, target_id, type)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_memory_nodes_user_id ON memory_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_type ON memory_nodes(type);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_conversation_id ON memory_nodes(conversation_id) WHERE conversation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_memory_nodes_created_at ON memory_nodes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_updated_at ON memory_nodes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_nodes_importance ON memory_nodes(importance DESC);

CREATE INDEX IF NOT EXISTS idx_memory_edges_source_id ON memory_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_memory_edges_target_id ON memory_edges(target_id);
CREATE INDEX IF NOT EXISTS idx_memory_edges_type ON memory_edges(type);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_memory_nodes_title_search ON memory_nodes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_memory_nodes_content_search ON memory_nodes USING gin(to_tsvector('english', content)) WHERE content IS NOT NULL;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_memory_nodes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_memory_nodes_updated_at_trigger ON memory_nodes;
CREATE TRIGGER update_memory_nodes_updated_at_trigger
    BEFORE UPDATE ON memory_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_memory_nodes_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE memory_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_edges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to ensure users can only access their own memory data
CREATE POLICY "Users can view their own memory nodes" ON memory_nodes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memory nodes" ON memory_nodes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory nodes" ON memory_nodes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory nodes" ON memory_nodes
    FOR DELETE USING (auth.uid() = user_id);

-- Memory edges policies (check both source and target nodes belong to user)
CREATE POLICY "Users can view edges between their own nodes" ON memory_edges
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM memory_nodes WHERE id = source_id AND user_id = auth.uid()) 
        AND 
        EXISTS (SELECT 1 FROM memory_nodes WHERE id = target_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can create edges between their own nodes" ON memory_edges
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM memory_nodes WHERE id = source_id AND user_id = auth.uid()) 
        AND 
        EXISTS (SELECT 1 FROM memory_nodes WHERE id = target_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can delete edges between their own nodes" ON memory_edges
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM memory_nodes WHERE id = source_id AND user_id = auth.uid()) 
        AND 
        EXISTS (SELECT 1 FROM memory_nodes WHERE id = target_id AND user_id = auth.uid())
    );


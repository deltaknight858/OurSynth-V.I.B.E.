-- Memory Phase 1 RLS Policies
-- Run this in your Supabase SQL Editor after running memory_schema.sql
-- This file adds Row Level Security policies to restrict access to memory data by user

-- Enable RLS on memory_nodes table
ALTER TABLE public.memory_nodes ENABLE ROW LEVEL SECURITY;

-- Memory Nodes Policies - Users can only access their own memory nodes
CREATE POLICY "Users can view their own memory nodes"
    ON memory_nodes FOR SELECT
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can create their own memory nodes"
    ON memory_nodes FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own memory nodes"
    ON memory_nodes FOR UPDATE
    USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own memory nodes"
    ON memory_nodes FOR DELETE
    USING ( auth.uid() = user_id );

-- Enable RLS on memory_edges table
ALTER TABLE public.memory_edges ENABLE ROW LEVEL SECURITY;

-- Memory Edges Policies - Users can only access edges where both source and target nodes belong to them
CREATE POLICY "Users can view their own memory edges"
    ON memory_edges FOR SELECT
    USING ( 
        auth.uid() = user_id 
        AND EXISTS (
            SELECT 1 FROM memory_nodes 
            WHERE memory_nodes.id = memory_edges.source_node_id 
            AND memory_nodes.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM memory_nodes 
            WHERE memory_nodes.id = memory_edges.target_node_id 
            AND memory_nodes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create memory edges between their own nodes"
    ON memory_edges FOR INSERT
    WITH CHECK ( 
        auth.uid() = user_id 
        AND EXISTS (
            SELECT 1 FROM memory_nodes 
            WHERE memory_nodes.id = memory_edges.source_node_id 
            AND memory_nodes.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM memory_nodes 
            WHERE memory_nodes.id = memory_edges.target_node_id 
            AND memory_nodes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own memory edges"
    ON memory_edges FOR UPDATE
    USING ( 
        auth.uid() = user_id 
        AND EXISTS (
            SELECT 1 FROM memory_nodes 
            WHERE memory_nodes.id = memory_edges.source_node_id 
            AND memory_nodes.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM memory_nodes 
            WHERE memory_nodes.id = memory_edges.target_node_id 
            AND memory_nodes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own memory edges"
    ON memory_edges FOR DELETE
    USING ( 
        auth.uid() = user_id 
        AND EXISTS (
            SELECT 1 FROM memory_nodes 
            WHERE memory_nodes.id = memory_edges.source_node_id 
            AND memory_nodes.user_id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM memory_nodes 
            WHERE memory_nodes.id = memory_edges.target_node_id 
            AND memory_nodes.user_id = auth.uid()
        )
    );

-- Success message
SELECT 'Memory RLS policies created successfully! Cross-user access is now blocked.' as message;
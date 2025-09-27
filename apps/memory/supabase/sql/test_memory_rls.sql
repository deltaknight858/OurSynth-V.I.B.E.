-- Test script for Memory RLS policies
-- This script demonstrates that the RLS policies properly isolate user data
-- Run this AFTER setting up memory_schema.sql and memory_policies.sql

-- Note: This is a demonstration script showing expected behavior
-- In actual usage, these operations would be performed by authenticated users through the API

-- Test case 1: Create test data for two hypothetical users
-- (In real usage, auth.uid() would return the actual authenticated user ID)

-- Example of what should work (user can access their own data):
/*
-- User A creates their memory node
INSERT INTO memory_nodes (user_id, title, content) 
VALUES ('user-a-uuid', 'My Memory', 'Personal memory content');

-- User A can query their own nodes
SELECT * FROM memory_nodes WHERE user_id = 'user-a-uuid';
*/

-- Example of what should be blocked (cross-user access):
/*
-- User B tries to access User A's memory node - this should return empty
SELECT * FROM memory_nodes WHERE user_id = 'user-a-uuid' AND auth.uid() = 'user-b-uuid';

-- User B tries to update User A's memory node - this should be blocked
UPDATE memory_nodes SET content = 'Hacked!' WHERE user_id = 'user-a-uuid';
*/

-- Test case 2: Memory edges security
/*
-- User A creates edge between their own nodes - this should work
INSERT INTO memory_edges (user_id, source_node_id, target_node_id, label) 
VALUES ('user-a-uuid', 'node-1-uuid', 'node-2-uuid', 'connection');

-- User B tries to create edge using User A's nodes - this should be blocked
INSERT INTO memory_edges (user_id, source_node_id, target_node_id, label) 
VALUES ('user-b-uuid', 'node-1-uuid', 'node-2-uuid', 'malicious connection');
*/

-- Validation queries to run after setup:
-- 1. Check that RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('memory_nodes', 'memory_edges');

-- 2. List all policies created
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('memory_nodes', 'memory_edges')
ORDER BY tablename, cmd;

SELECT 'Memory RLS test script loaded. Policies should prevent cross-user access.' as message;
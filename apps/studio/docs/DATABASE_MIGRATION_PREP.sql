-- =====================================================
-- OURSYNTH PLATFORM - DATABASE MIGRATION SCRIPT
-- =====================================================
-- This script safely migrates from any existing schema to the new UUID-based schema
-- Run this BEFORE running the main COMPLETE_DATABASE_SCHEMA.sql
-- =====================================================

-- First, let's drop existing foreign key constraints that might cause conflicts
DO $$ 
BEGIN
    -- Drop domain_dns_records foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'domain_dns_records_domain_id_fkey'
        AND table_name = 'domain_dns_records'
    ) THEN
        ALTER TABLE public.domain_dns_records DROP CONSTRAINT domain_dns_records_domain_id_fkey;
    END IF;

    -- Drop nodes foreign key constraints if they exist with wrong types
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'nodes_project_id_fkey'
        AND table_name = 'nodes'
    ) THEN
        ALTER TABLE public.nodes DROP CONSTRAINT nodes_project_id_fkey;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'nodes_parent_id_fkey'
        AND table_name = 'nodes'
    ) THEN
        ALTER TABLE public.nodes DROP CONSTRAINT nodes_parent_id_fkey;
    END IF;

    -- Drop deployments foreign key constraint if it exists with wrong type
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deployments_project_id_fkey'
        AND table_name = 'deployments'
    ) THEN
        ALTER TABLE public.deployments DROP CONSTRAINT deployments_project_id_fkey;
    END IF;

    -- Drop user_projects foreign key constraint if it exists with wrong type
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_projects_template_id_fkey'
        AND table_name = 'user_projects'
    ) THEN
        ALTER TABLE public.user_projects DROP CONSTRAINT user_projects_template_id_fkey;
    END IF;
END $$;

-- Now let's check if tables exist with wrong column types and drop them if necessary
DO $$
BEGIN
    -- Check if projects table exists with BIGINT id (wrong type)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'id' 
        AND data_type = 'bigint'
    ) THEN
        DROP TABLE IF EXISTS public.projects CASCADE;
    END IF;

    -- Check if nodes table exists with BIGINT id (wrong type)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nodes' 
        AND column_name = 'id' 
        AND data_type = 'bigint'
    ) THEN
        DROP TABLE IF EXISTS public.nodes CASCADE;
    END IF;

    -- Check if domains table exists with BIGINT id (wrong type)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'domains' 
        AND column_name = 'id' 
        AND data_type = 'bigint'
    ) THEN
        DROP TABLE IF EXISTS public.domains CASCADE;
    END IF;

    -- Check if domain_dns_records references wrong type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'domain_dns_records' 
        AND column_name = 'domain_id' 
        AND data_type != 'uuid'
    ) THEN
        DROP TABLE IF EXISTS public.domain_dns_records CASCADE;
    END IF;
END $$;

-- Drop any existing views that might reference the old tables
DROP VIEW IF EXISTS projects_with_stats CASCADE;
DROP VIEW IF EXISTS user_dashboard_summary CASCADE;
DROP VIEW IF EXISTS marketplace_components CASCADE;

-- Drop existing triggers that might reference old tables
DROP TRIGGER IF EXISTS set_updated_at_projects ON public.projects;
DROP TRIGGER IF EXISTS set_updated_at_nodes ON public.nodes;
DROP TRIGGER IF EXISTS set_updated_at_domains ON public.domains;

-- Drop existing indexes that might cause conflicts
DROP INDEX IF EXISTS idx_projects_user_id;
DROP INDEX IF EXISTS idx_projects_created_at;
DROP INDEX IF EXISTS idx_projects_is_public;
DROP INDEX IF EXISTS idx_nodes_project_id;
DROP INDEX IF EXISTS idx_nodes_parent_id;
DROP INDEX IF EXISTS idx_nodes_type;
DROP INDEX IF EXISTS idx_domains_user_id;
DROP INDEX IF EXISTS idx_domains_name;
DROP INDEX IF EXISTS idx_domains_expires_at;
DROP INDEX IF EXISTS idx_domains_status;
DROP INDEX IF EXISTS idx_deployments_project_id;

-- Now the main schema can be applied safely
SELECT 'Migration preparation complete. Now run COMPLETE_DATABASE_SCHEMA.sql' as status;

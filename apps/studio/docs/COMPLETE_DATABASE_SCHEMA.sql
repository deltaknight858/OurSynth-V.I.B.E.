-- =====================================================
-- OURSYNTH PLATFORM - COMPLETE DATABASE SCHEMA
-- =====================================================
-- This comprehensive SQL schema covers all apps in the OurSynth Platform:
-- - Studio App: Projects, Nodes, Components, Templates, Marketplace
-- - Pathways App: AI-Generated User Components  
-- - Domains App: Domain Management & Registration
-- - Deploy App: Deployment Tracking & Analytics
-- - Authentication: User Management & Profiles
-- - Analytics: Usage Tracking & Metrics
-- 
-- NOTE: All primary keys use UUID for consistency and scalability
-- =====================================================

-- =====================================================
-- CLEANUP: DROP EXISTING CONFLICTING TABLES
-- =====================================================
-- This ensures a clean slate by removing any existing tables that conflict
-- with our UUID-based schema design

DO $$ 
BEGIN
    -- Drop all views first
    DROP VIEW IF EXISTS projects_with_stats CASCADE;
    DROP VIEW IF EXISTS user_projects_with_stats CASCADE;
    DROP VIEW IF EXISTS user_dashboard_summary CASCADE;
    DROP VIEW IF EXISTS marketplace_components CASCADE;
    
    -- Drop all tables with CASCADE to remove constraints
    DROP TABLE IF EXISTS public.usage_tracking CASCADE;
    DROP TABLE IF EXISTS public.user_subscriptions CASCADE;
    DROP TABLE IF EXISTS public.subscription_plans CASCADE;
    DROP TABLE IF EXISTS public.email_templates CASCADE;
    DROP TABLE IF EXISTS public.notifications CASCADE;
    DROP TABLE IF EXISTS public.system_metrics CASCADE;
    DROP TABLE IF EXISTS public.feature_usage CASCADE;
    DROP TABLE IF EXISTS public.page_views CASCADE;
    DROP TABLE IF EXISTS public.deployment_webhooks CASCADE;
    DROP TABLE IF EXISTS public.deployment_metrics CASCADE;
    DROP TABLE IF EXISTS public.deployments CASCADE;
    DROP TABLE IF EXISTS public.user_domain_preferences CASCADE;
    DROP TABLE IF EXISTS public.domain_dns_records CASCADE;
    DROP TABLE IF EXISTS public.dns_records CASCADE;
    DROP TABLE IF EXISTS public.domains CASCADE;
    DROP TABLE IF EXISTS public.ai_generation_metrics CASCADE;
    DROP TABLE IF EXISTS public.user_components CASCADE;
    DROP TABLE IF EXISTS public.component_downloads CASCADE;
    DROP TABLE IF EXISTS public.component_reviews CASCADE;
    DROP TABLE IF EXISTS public.user_projects CASCADE;
    DROP TABLE IF EXISTS public.components CASCADE;
    DROP TABLE IF EXISTS public.component_generator CASCADE;
    DROP TABLE IF EXISTS public.component_cache CASCADE;
    DROP TABLE IF EXISTS public.nodes CASCADE;
    DROP TABLE IF EXISTS public.projects CASCADE;
    DROP TABLE IF EXISTS public.user_sessions CASCADE;
    DROP TABLE IF EXISTS public.user_profiles CASCADE;
    DROP TABLE IF EXISTS public.posts CASCADE;
    DROP TABLE IF EXISTS public.radio_presets CASCADE;
    DROP TABLE IF EXISTS public.user_usage CASCADE;
    
    -- Drop any custom functions
    DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
    DROP FUNCTION IF EXISTS public.increment_component_downloads() CASCADE;
    DROP FUNCTION IF EXISTS public.update_component_rating() CASCADE;
    
EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignore errors if objects don't exist
END $$;

-- =====================================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- =====================================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    website_url TEXT,
    location VARCHAR(100),
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    total_storage_used BIGINT DEFAULT 0, -- bytes
    max_storage_limit BIGINT DEFAULT 1073741824, -- 1GB default
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- User Sessions & Activity Tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    session_end TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    location_country VARCHAR(100),
    location_city VARCHAR(100)
);

-- =====================================================
-- 2. STUDIO APP - PROJECTS & COMPONENTS SYSTEM
-- =====================================================

-- Projects Table (Visual Canvas Projects)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT false,
    canvas_config JSONB DEFAULT '{}', -- Canvas settings, zoom, grid, etc.
    project_metadata JSONB DEFAULT '{}', -- Custom project settings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Nodes Table (Draggable Components on Canvas)
CREATE TABLE IF NOT EXISTS public.nodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- "Button", "Card", "Input", etc.
    props JSONB NOT NULL, -- React props/configuration
    x INTEGER NOT NULL, -- Canvas X coordinate
    y INTEGER NOT NULL, -- Canvas Y coordinate
    width INTEGER DEFAULT 100,
    height INTEGER DEFAULT 50,
    z_index INTEGER DEFAULT 0,
    parent_id UUID REFERENCES public.nodes(id) ON DELETE CASCADE, -- Nested components
    locked BOOLEAN DEFAULT false,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Components Table (Marketplace & Template Components)
CREATE TABLE IF NOT EXISTS public.components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    rating_count INTEGER DEFAULT 0,
    thumbnail_url TEXT,
    preview_images TEXT[], -- Array of preview image URLs
    category VARCHAR(100),
    subcategory VARCHAR(100),
    download_url TEXT,
    file_size BIGINT,
    downloads_count INTEGER DEFAULT 0,
    author_id UUID REFERENCES auth.users(id),
    tags TEXT[], -- Searchable tags
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    component_data JSONB, -- Component configuration
    framework VARCHAR(50) DEFAULT 'react',
    version VARCHAR(20) DEFAULT '1.0.0',
    license VARCHAR(50) DEFAULT 'MIT',
    demo_url TEXT,
    documentation_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- User Projects (Templates Usage & User Creations)
CREATE TABLE IF NOT EXISTS public.user_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES public.components(id), -- Reference to template
    project_data JSONB, -- Project configuration
    thumbnail_url TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE, -- User can share as template
    fork_count INTEGER DEFAULT 0, -- How many times forked
    star_count INTEGER DEFAULT 0, -- User favorites
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Component Reviews & Ratings
CREATE TABLE IF NOT EXISTS public.component_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    component_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(component_id, user_id) -- One review per user per component
);

-- Component Downloads Tracking
CREATE TABLE IF NOT EXISTS public.component_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    component_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    download_source VARCHAR(100), -- 'marketplace', 'template', 'direct'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- 3. PATHWAYS APP - AI COMPONENT GENERATION
-- =====================================================

-- User Generated Components (AI-Created)
CREATE TABLE IF NOT EXISTS public.user_components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL, -- Original user prompt
    generated_code TEXT NOT NULL, -- AI-generated component code
    preview_image_url TEXT,
    ai_provider VARCHAR(50), -- 'openai', 'vertex-ai', 'claude'
    ai_model VARCHAR(100), -- Specific model used
    generation_time_ms INTEGER, -- Processing time
    token_count INTEGER, -- Tokens used for billing
    framework VARCHAR(50) DEFAULT 'react',
    language VARCHAR(50) DEFAULT 'typescript',
    is_public BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0, -- How many times reused
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- AI Generation Metrics
CREATE TABLE IF NOT EXISTS public.ai_generation_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID, -- Group related generations
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    prompt_text TEXT NOT NULL,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    generation_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    cost_estimate DECIMAL(10,6), -- Estimated cost in USD
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- 4. DOMAINS APP - DOMAIN MANAGEMENT
-- =====================================================

-- First, drop any existing foreign key constraints that might conflict
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'domain_dns_records_domain_id_fkey'
        AND table_name = 'domain_dns_records'
    ) THEN
        ALTER TABLE public.domain_dns_records DROP CONSTRAINT domain_dns_records_domain_id_fkey;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Domains Table
CREATE TABLE IF NOT EXISTS public.domains (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE, -- Domain name (e.g., 'example.com')
    tld VARCHAR(10) NOT NULL, -- Top-level domain (.com, .org, etc.)
    registrar VARCHAR(100), -- Where domain was registered
    purchase_price DECIMAL(10,2),
    renewal_price DECIMAL(10,2),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending', 'suspended')),
    auto_renew BOOLEAN DEFAULT TRUE,
    whois_privacy BOOLEAN DEFAULT FALSE,
    nameservers TEXT[], -- Array of nameserver addresses
    dns_config JSONB DEFAULT '{}', -- DNS records configuration
    ssl_enabled BOOLEAN DEFAULT FALSE,
    ssl_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Domain DNS Records
CREATE TABLE IF NOT EXISTS public.domain_dns_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain_id UUID NOT NULL, -- Will add constraint after ensuring compatibility
    record_type VARCHAR(10) NOT NULL CHECK (record_type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV')),
    name VARCHAR(255) NOT NULL, -- Subdomain or @ for root
    value TEXT NOT NULL, -- IP address, domain, or record value
    ttl INTEGER DEFAULT 3600, -- Time to live in seconds
    priority INTEGER, -- For MX and SRV records
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Add foreign key constraint safely
DO $$ 
BEGIN
    -- Only add the constraint if it doesn't already exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'domain_dns_records_domain_id_fkey'
        AND table_name = 'domain_dns_records'
    ) THEN
        ALTER TABLE public.domain_dns_records 
        ADD CONSTRAINT domain_dns_records_domain_id_fkey 
        FOREIGN KEY (domain_id) REFERENCES public.domains(id) ON DELETE CASCADE;
    END IF;
EXCEPTION
    WHEN OTHERS THEN 
        -- If constraint addition fails, try to fix the column type first
        BEGIN
            -- Check if domain_id column has wrong type
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'domain_dns_records' 
                AND column_name = 'domain_id' 
                AND data_type != 'uuid'
            ) THEN
                -- Drop the table and recreate with correct types
                DROP TABLE IF EXISTS public.domain_dns_records CASCADE;
                
                CREATE TABLE public.domain_dns_records (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    domain_id UUID REFERENCES public.domains(id) ON DELETE CASCADE NOT NULL,
                    record_type VARCHAR(10) NOT NULL CHECK (record_type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV')),
                    name VARCHAR(255) NOT NULL,
                    value TEXT NOT NULL,
                    ttl INTEGER DEFAULT 3600,
                    priority INTEGER,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
                );
            END IF;
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
END $$;

-- User Domain Preferences
CREATE TABLE IF NOT EXISTS public.user_domain_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    domain_order UUID[], -- Preferred ordering of domains
    default_nameservers TEXT[], -- User's preferred nameservers
    auto_renew_default BOOLEAN DEFAULT TRUE,
    privacy_protection_default BOOLEAN DEFAULT TRUE,
    notification_preferences JSONB DEFAULT '{}', -- Email notifications for renewals, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- 5. DEPLOY APP - DEPLOYMENT TRACKING & ANALYTICS
-- =====================================================

-- Deployments Table
CREATE TABLE IF NOT EXISTS public.deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID, -- Will add constraint after ensuring tables exist
    domain_id UUID, -- Will add constraint after ensuring tables exist 
    deployment_name VARCHAR(255) NOT NULL,
    deployment_url TEXT,
    deployment_type VARCHAR(50) DEFAULT 'static' CHECK (deployment_type IN ('static', 'spa', 'ssr', 'api', 'full-stack')),
    platform VARCHAR(50) DEFAULT 'azure' CHECK (platform IN ('azure', 'vercel', 'netlify', 'aws', 'gcp')),
    environment VARCHAR(50) DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'deployed', 'failed', 'cancelled')),
    build_id VARCHAR(255), -- Platform-specific build ID
    commit_hash VARCHAR(40), -- Git commit hash
    branch_name VARCHAR(100) DEFAULT 'main',
    build_logs TEXT, -- Build output logs
    error_logs TEXT, -- Error logs if failed
    build_duration_ms INTEGER, -- Build time in milliseconds
    bundle_size BIGINT, -- Final bundle size in bytes
    performance_score INTEGER, -- Lighthouse or similar score
    deployment_config JSONB DEFAULT '{}', -- Platform-specific config
    environment_variables JSONB DEFAULT '{}', -- Deployed env vars (encrypted)
    custom_domain VARCHAR(255), -- Custom domain if different from domain_id
    ssl_certificate_id VARCHAR(255), -- SSL cert reference
    cdn_enabled BOOLEAN DEFAULT TRUE,
    analytics_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Add foreign key constraints safely after all tables are created
DO $$ 
BEGIN
    -- Add project_id constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deployments_project_id_fkey'
        AND table_name = 'deployments'
    ) THEN
        ALTER TABLE public.deployments 
        ADD CONSTRAINT deployments_project_id_fkey 
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;
    
    -- Add domain_id constraint if it doesn't exist  
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deployments_domain_id_fkey'
        AND table_name = 'deployments'
    ) THEN
        ALTER TABLE public.deployments 
        ADD CONSTRAINT deployments_domain_id_fkey 
        FOREIGN KEY (domain_id) REFERENCES public.domains(id) ON DELETE SET NULL;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignore errors if constraints can't be added
END $$;

-- Deployment Metrics
CREATE TABLE IF NOT EXISTS public.deployment_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deployment_id UUID REFERENCES public.deployments(id) ON DELETE CASCADE NOT NULL,
    metric_date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2), -- Percentage
    avg_session_duration INTEGER, -- Seconds
    page_load_time_ms INTEGER, -- Average page load time
    error_rate DECIMAL(5,2), -- Percentage of requests that error
    uptime_percentage DECIMAL(5,2), -- Uptime for the day
    bandwidth_used BIGINT, -- Bytes transferred
    requests_count INTEGER, -- Total requests
    cache_hit_rate DECIMAL(5,2), -- CDN cache hit rate percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Deployment Webhooks & Integrations
CREATE TABLE IF NOT EXISTS public.deployment_webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    deployment_id UUID REFERENCES public.deployments(id) ON DELETE CASCADE,
    webhook_url TEXT NOT NULL,
    webhook_type VARCHAR(50) CHECK (webhook_type IN ('build-start', 'build-complete', 'deploy-success', 'deploy-failure')),
    is_active BOOLEAN DEFAULT TRUE,
    secret_token VARCHAR(255), -- For webhook verification
    headers JSONB DEFAULT '{}', -- Custom headers to send
    retry_count INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- 6. ANALYTICS & USAGE TRACKING
-- =====================================================

-- Page Views & User Analytics
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deployment_id UUID REFERENCES public.deployments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- If authenticated
    session_id UUID NOT NULL, -- Anonymous session tracking
    page_url TEXT NOT NULL,
    page_title TEXT,
    referrer_url TEXT,
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50), -- 'desktop', 'tablet', 'mobile'
    browser VARCHAR(50),
    os VARCHAR(50),
    screen_resolution VARCHAR(20), -- '1920x1080'
    view_duration_ms INTEGER, -- Time spent on page
    scroll_depth INTEGER, -- Max scroll percentage
    bounce BOOLEAN DEFAULT FALSE, -- True if only page in session
    conversion_event VARCHAR(100), -- If this view led to a conversion
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Feature Usage Analytics
CREATE TABLE IF NOT EXISTS public.feature_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL, -- 'create-project', 'use-template', 'deploy', etc.
    app_name VARCHAR(50) NOT NULL, -- 'studio', 'pathways', 'domains', 'deploy'
    action_type VARCHAR(50) NOT NULL, -- 'click', 'view', 'create', 'edit', 'delete'
    feature_data JSONB DEFAULT '{}', -- Additional context data
    session_id UUID,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    duration_ms INTEGER, -- Time to complete action
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- System Performance Metrics
CREATE TABLE IF NOT EXISTS public.system_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL, -- 'api-response-time', 'db-query-time', 'build-time'
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,6) NOT NULL,
    metric_unit VARCHAR(20) NOT NULL, -- 'ms', 'seconds', 'bytes', 'percentage'
    app_name VARCHAR(50),
    environment VARCHAR(50) DEFAULT 'production',
    additional_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- 7. NOTIFICATIONS & COMMUNICATION
-- =====================================================

-- User Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'deployment', 'domain-expiry', 'component-update', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT, -- Link to relevant page
    action_label VARCHAR(100), -- Button text
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    delivery_method VARCHAR(50) DEFAULT 'in-app' CHECK (delivery_method IN ('in-app', 'email', 'push', 'sms')),
    related_entity_type VARCHAR(50), -- 'deployment', 'domain', 'component'
    related_entity_id UUID, -- ID of the related entity
    scheduled_for TIMESTAMP WITH TIME ZONE, -- For scheduled notifications
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Email Templates & Campaigns
CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_key VARCHAR(100) UNIQUE NOT NULL, -- 'welcome', 'domain-expiry', etc.
    template_name VARCHAR(255) NOT NULL,
    subject_template TEXT NOT NULL, -- With placeholders like {{user_name}}
    html_template TEXT NOT NULL,
    text_template TEXT,
    template_variables JSONB DEFAULT '{}', -- Available variables
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- 8. BILLING & SUBSCRIPTIONS
-- =====================================================

-- Subscription Plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_key VARCHAR(50) UNIQUE NOT NULL, -- 'free', 'pro', 'enterprise'
    plan_name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    max_projects INTEGER,
    max_deployments INTEGER,
    max_storage_gb INTEGER,
    max_domains INTEGER,
    ai_generation_credits INTEGER, -- Monthly AI generation allowance
    priority_support BOOLEAN DEFAULT FALSE,
    custom_branding BOOLEAN DEFAULT FALSE,
    advanced_analytics BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '{}', -- Detailed feature list
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
    stripe_subscription_id VARCHAR(255), -- Stripe subscription ID
    stripe_customer_id VARCHAR(255), -- Stripe customer ID
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid', 'trialing')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    trial_end TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Usage Tracking for Billing
CREATE TABLE IF NOT EXISTS public.usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.user_subscriptions(id),
    usage_type VARCHAR(50) NOT NULL, -- 'storage', 'ai-generations', 'deployments', 'bandwidth'
    usage_amount BIGINT NOT NULL, -- Amount used
    usage_unit VARCHAR(20) NOT NULL, -- 'bytes', 'count', 'requests'
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    overage_amount BIGINT DEFAULT 0, -- Usage beyond plan limits
    overage_cost DECIMAL(10,4) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- =====================================================
-- 9. INDEXES FOR PERFORMANCE
-- =====================================================

-- User Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON public.user_profiles(subscription_tier);

-- Projects Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON public.projects(is_public);

-- Nodes Indexes
CREATE INDEX IF NOT EXISTS idx_nodes_project_id ON public.nodes(project_id);
CREATE INDEX IF NOT EXISTS idx_nodes_parent_id ON public.nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_nodes_type ON public.nodes(type);

-- Components Indexes
CREATE INDEX IF NOT EXISTS idx_components_category ON public.components(category);
CREATE INDEX IF NOT EXISTS idx_components_rating ON public.components(rating DESC);
CREATE INDEX IF NOT EXISTS idx_components_price ON public.components(price);
CREATE INDEX IF NOT EXISTS idx_components_created_at ON public.components(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_components_is_featured ON public.components(is_featured);
CREATE INDEX IF NOT EXISTS idx_components_is_active ON public.components(is_active);
CREATE INDEX IF NOT EXISTS idx_components_framework ON public.components(framework);
CREATE INDEX IF NOT EXISTS idx_components_tags ON public.components USING GIN(tags);

-- User Components Indexes
CREATE INDEX IF NOT EXISTS idx_user_components_user_id ON public.user_components(user_id);
CREATE INDEX IF NOT EXISTS idx_user_components_created_at ON public.user_components(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_components_ai_provider ON public.user_components(ai_provider);

-- Domains Indexes
CREATE INDEX IF NOT EXISTS idx_domains_user_id ON public.domains(user_id);
CREATE INDEX IF NOT EXISTS idx_domains_name ON public.domains(name);
CREATE INDEX IF NOT EXISTS idx_domains_expires_at ON public.domains(expires_at);
CREATE INDEX IF NOT EXISTS idx_domains_status ON public.domains(status);

-- Deployments Indexes
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON public.deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON public.deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON public.deployments(created_at DESC);

-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_page_views_deployment_id ON public.page_views(deployment_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON public.feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature_name ON public.feature_usage(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_created_at ON public.feature_usage(created_at DESC);

-- User Sessions Indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_start ON public.user_sessions(session_start DESC);

-- Notifications Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all user-related tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_domain_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
    -- Drop existing foreign key constraints that might conflict
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deployments_project_id_fkey'
        AND table_name = 'deployments'
    ) THEN
        ALTER TABLE public.deployments DROP CONSTRAINT deployments_project_id_fkey;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'deployments_domain_id_fkey'
        AND table_name = 'deployments'
    ) THEN
        ALTER TABLE public.deployments DROP CONSTRAINT deployments_domain_id_fkey;
    END IF;
    
    -- User Profiles Policies
    DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
    
    -- Projects Policies  
    DROP POLICY IF EXISTS "Users can view own projects and public projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
    
    -- Nodes Policies
    DROP POLICY IF EXISTS "Users can view nodes in accessible projects" ON public.nodes;
    DROP POLICY IF EXISTS "Users can insert nodes in own projects" ON public.nodes;
    DROP POLICY IF EXISTS "Users can update nodes in own projects" ON public.nodes;
    DROP POLICY IF EXISTS "Users can delete nodes in own projects" ON public.nodes;
    
    -- Components Policies
    DROP POLICY IF EXISTS "Allow public read access to active components" ON public.components;
    DROP POLICY IF EXISTS "Allow authenticated users to insert components" ON public.components;
    DROP POLICY IF EXISTS "Allow users to update their own components" ON public.components;
    DROP POLICY IF EXISTS "Allow users to delete their own components" ON public.components;
    
    -- User Projects Policies
    DROP POLICY IF EXISTS "Users can read their own projects" ON public.user_projects;
    DROP POLICY IF EXISTS "Users can insert their own projects" ON public.user_projects;
    DROP POLICY IF EXISTS "Users can update their own projects" ON public.user_projects;
    DROP POLICY IF EXISTS "Users can delete their own projects" ON public.user_projects;
    DROP POLICY IF EXISTS "Public can read public projects" ON public.user_projects;
    
    -- User Components Policies
    DROP POLICY IF EXISTS "Users can only access their own components" ON public.user_components;
    
    -- Domains Policies
    DROP POLICY IF EXISTS "Users can only access their own domains" ON public.domains;
    
    -- Domain DNS Records Policies
    DROP POLICY IF EXISTS "Users can access DNS records for their domains" ON public.domain_dns_records;
    
    -- Deployments Policies
    DROP POLICY IF EXISTS "Users can only access their own deployments" ON public.deployments;
    
    -- Deployment Metrics Policies
    DROP POLICY IF EXISTS "Users can access metrics for their deployments" ON public.deployment_metrics;
    
    -- Notifications Policies
    DROP POLICY IF EXISTS "Users can only access their own notifications" ON public.notifications;
EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignore errors if policies don't exist
END $$;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Projects Policies
CREATE POLICY "Users can view own projects and public projects" ON public.projects
    FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (user_id = auth.uid());

-- Nodes Policies
CREATE POLICY "Users can view nodes in accessible projects" ON public.nodes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = nodes.project_id 
            AND (projects.user_id = auth.uid() OR projects.is_public = true)
        )
    );

CREATE POLICY "Users can insert nodes in own projects" ON public.nodes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = nodes.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update nodes in own projects" ON public.nodes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = nodes.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete nodes in own projects" ON public.nodes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = nodes.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Components Policies (Public Read, Authenticated Insert/Update Own)
CREATE POLICY "Allow public read access to active components" ON public.components
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to insert components" ON public.components
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Allow users to update their own components" ON public.components
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Allow users to delete their own components" ON public.components
    FOR DELETE USING (auth.uid() = author_id);

-- User Projects Policies
CREATE POLICY "Users can read their own projects" ON public.user_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.user_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.user_projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.user_projects
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can read public projects" ON public.user_projects
    FOR SELECT USING (is_public = true);

-- User Components Policies (AI-Generated)
CREATE POLICY "Users can only access their own components" ON public.user_components
    FOR ALL USING (auth.uid() = user_id);

-- Domains Policies
CREATE POLICY "Users can only access their own domains" ON public.domains
    FOR ALL USING (auth.uid() = user_id);

-- Domain DNS Records Policies
CREATE POLICY "Users can access DNS records for their domains" ON public.domain_dns_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.domains 
            WHERE domains.id = domain_dns_records.domain_id 
            AND domains.user_id = auth.uid()
        )
    );

-- Deployments Policies
CREATE POLICY "Users can only access their own deployments" ON public.deployments
    FOR ALL USING (auth.uid() = user_id);

-- Deployment Metrics Policies
CREATE POLICY "Users can access metrics for their deployments" ON public.deployment_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.deployments 
            WHERE deployments.id = deployment_metrics.deployment_id 
            AND deployments.user_id = auth.uid()
        )
    );

-- Notifications Policies
CREATE POLICY "Users can only access their own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 11. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER set_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_projects
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_nodes
    BEFORE UPDATE ON public.nodes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_components
    BEFORE UPDATE ON public.components
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_projects
    BEFORE UPDATE ON public.user_projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_components
    BEFORE UPDATE ON public.user_components
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_domains
    BEFORE UPDATE ON public.domains
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_deployments
    BEFORE UPDATE ON public.deployments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment download counts
CREATE OR REPLACE FUNCTION public.increment_component_downloads()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.components 
    SET downloads_count = downloads_count + 1 
    WHERE id = NEW.component_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_downloads_on_insert
    AFTER INSERT ON public.component_downloads
    FOR EACH ROW EXECUTE FUNCTION public.increment_component_downloads();

-- Function to update component ratings
CREATE OR REPLACE FUNCTION public.update_component_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.components 
    SET rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM public.component_reviews 
        WHERE component_id = COALESCE(NEW.component_id, OLD.component_id)
    ),
    rating_count = (
        SELECT COUNT(*) 
        FROM public.component_reviews 
        WHERE component_id = COALESCE(NEW.component_id, OLD.component_id)
    )
    WHERE id = COALESCE(NEW.component_id, OLD.component_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON public.component_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_component_rating();

-- =====================================================
-- 12. INITIAL DATA & SAMPLE RECORDS
-- =====================================================

-- Insert default subscription plans
INSERT INTO public.subscription_plans (plan_key, plan_name, description, price_monthly, price_yearly, max_projects, max_deployments, max_storage_gb, max_domains, ai_generation_credits) VALUES
('free', 'Free Plan', 'Perfect for getting started with OurSynth', 0.00, 0.00, 3, 3, 1, 1, 10),
('pro', 'Pro Plan', 'For serious developers and small teams', 29.99, 299.99, 25, 25, 50, 10, 500),
('enterprise', 'Enterprise Plan', 'For large teams and organizations', 99.99, 999.99, -1, -1, 500, 50, 2000)
ON CONFLICT (plan_key) DO NOTHING;

-- Insert sample components for marketplace
INSERT INTO public.components (name, description, price, rating, category, tags, is_featured, framework, component_data) VALUES
('Modern Button Set', 'Collection of stylish buttons with hover effects and animations', 12.99, 4.8, 'Buttons', ARRAY['button', 'modern', 'hover', 'animation'], true, 'react', '{"variants": ["primary", "secondary", "outline"], "sizes": ["sm", "md", "lg"]}'),
('Card Components', 'Beautiful card layouts for content display', 0.00, 4.6, 'Layout', ARRAY['card', 'layout', 'content', 'free'], false, 'react', '{"elevation": true, "variants": ["filled", "outlined"], "responsive": true}'),
('Form Input Library', 'Complete form input collection with validation', 29.99, 4.9, 'Forms', ARRAY['input', 'form', 'validation', 'accessibility'], true, 'react', '{"types": ["text", "email", "password", "select"], "validation": true}'),
('Dashboard Layout', 'Complete dashboard template with sidebar and responsive grid', 27.99, 4.6, 'Templates', ARRAY['dashboard', 'layout', 'sidebar', 'responsive'], false, 'react', '{"layout": "sidebar", "responsive": true, "components": ["header", "sidebar", "main", "footer"]}'),
('E-commerce Store', 'Full e-commerce template with product listings and checkout', 32.99, 4.8, 'Templates', ARRAY['ecommerce', 'shop', 'product', 'checkout'], true, 'react', '{"pages": ["home", "product", "cart", "checkout"], "responsive": true, "components": ["product-card", "cart", "checkout-form"]}')
ON CONFLICT DO NOTHING;

-- Insert default email templates
INSERT INTO public.email_templates (template_key, template_name, subject_template, html_template, text_template) VALUES
('welcome', 'Welcome Email', 'Welcome to OurSynth, {{user_name}}!', '<h1>Welcome {{user_name}}!</h1><p>Thanks for joining OurSynth. Get started by creating your first project.</p>', 'Welcome {{user_name}}! Thanks for joining OurSynth. Get started by creating your first project.'),
('domain_expiry', 'Domain Expiry Warning', 'Your domain {{domain_name}} expires soon', '<h1>Domain Expiry Notice</h1><p>Your domain {{domain_name}} expires on {{expiry_date}}. Renew now to avoid service interruption.</p>', 'Your domain {{domain_name}} expires on {{expiry_date}}. Renew now to avoid service interruption.'),
('deployment_success', 'Deployment Successful', 'Your deployment {{deployment_name}} is live!', '<h1>Deployment Successful!</h1><p>Your deployment {{deployment_name}} is now live at {{deployment_url}}</p>', 'Your deployment {{deployment_name}} is now live at {{deployment_url}}')
ON CONFLICT (template_key) DO NOTHING;

-- =====================================================
-- 13. USEFUL VIEWS
-- =====================================================

-- View for projects with statistics
CREATE OR REPLACE VIEW projects_with_stats AS
SELECT 
    p.*,
    COUNT(n.id) as node_count,
    MAX(n.updated_at) as last_node_update,
    0 as fork_count -- Canvas projects don't have traditional forks
FROM public.projects p
LEFT JOIN public.nodes n ON p.id = n.project_id
GROUP BY p.id;

-- View for user projects (template-based) with statistics
CREATE OR REPLACE VIEW user_projects_with_stats AS
SELECT 
    up.*,
    c.name as template_name,
    c.category as template_category
FROM public.user_projects up
LEFT JOIN public.components c ON up.template_id = c.id;

-- View for user dashboard summary
CREATE OR REPLACE VIEW user_dashboard_summary AS
SELECT 
    u.id as user_id,
    up.display_name,
    up.subscription_tier,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT d.id) as total_domains,
    COUNT(DISTINCT dep.id) as total_deployments,
    COUNT(DISTINCT uc.id) as total_ai_components,
    SUM(CASE WHEN dep.status = 'deployed' THEN 1 ELSE 0 END) as active_deployments,
    MAX(p.updated_at) as last_project_activity
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
LEFT JOIN public.projects p ON u.id = p.user_id
LEFT JOIN public.domains d ON u.id = d.user_id
LEFT JOIN public.deployments dep ON u.id = dep.user_id
LEFT JOIN public.user_components uc ON u.id = uc.user_id
GROUP BY u.id, up.display_name, up.subscription_tier;

-- View for component marketplace with stats
CREATE OR REPLACE VIEW marketplace_components AS
SELECT 
    c.*,
    COALESCE(AVG(cr.rating), 0) as avg_rating,
    COUNT(DISTINCT cr.id) as review_count,
    COUNT(DISTINCT cd.id) as download_count,
    up.display_name as author_name
FROM public.components c
LEFT JOIN public.component_reviews cr ON c.id = cr.component_id
LEFT JOIN public.component_downloads cd ON c.id = cd.component_id
LEFT JOIN public.user_profiles up ON c.author_id = up.id
WHERE c.is_active = true
GROUP BY c.id, up.display_name;

-- =====================================================
-- 14. GRANTS & PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Components table permissions (public read, authenticated write)
GRANT SELECT ON public.components TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.components TO authenticated;

-- All other tables - authenticated users only
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nodes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.component_reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.component_downloads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_components TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_generation_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domains TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.domain_dns_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_domain_preferences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deployments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deployment_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deployment_webhooks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_views TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feature_usage TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.usage_tracking TO authenticated;

-- Views permissions
GRANT SELECT ON projects_with_stats TO authenticated;
GRANT SELECT ON user_projects_with_stats TO authenticated;
GRANT SELECT ON user_dashboard_summary TO authenticated;
GRANT SELECT ON marketplace_components TO anon, authenticated;

-- Subscription plans - read-only for all
GRANT SELECT ON public.subscription_plans TO anon, authenticated;

-- Email templates - read-only for authenticated
GRANT SELECT ON public.email_templates TO authenticated;

-- =====================================================
-- END OF SCHEMA
-- =====================================================

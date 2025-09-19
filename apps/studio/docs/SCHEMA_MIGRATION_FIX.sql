-- =====================================================
-- OURSYNTH PLATFORM - SCHEMA MIGRATION & COMPATIBILITY FIX
-- =====================================================
-- This script handles the existing database schema and migrates it
-- to be compatible with the new complete schema structure
-- =====================================================

-- Step 1: Handle existing table conflicts and type mismatches
DO $$ 
BEGIN
    -- Drop existing constraints that will conflict
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'domain_dns_records_domain_id_fkey'
        AND table_name = 'domain_dns_records'
    ) THEN
        ALTER TABLE public.domain_dns_records DROP CONSTRAINT domain_dns_records_domain_id_fkey;
    END IF;

    -- Drop existing deployments table if it exists (incompatible structure)
    DROP TABLE IF EXISTS public.deployments CASCADE;
    
    -- Create new deployments table with correct structure
    CREATE TABLE IF NOT EXISTS public.deployments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        project_id BIGINT, -- Use BIGINT to match existing projects table
        domain_id BIGINT, -- Use BIGINT to match existing domains table
        deployment_name VARCHAR(255) NOT NULL,
        site_name TEXT, -- Keep compatibility with old structure
        repository_url TEXT,
        build_command TEXT,
        output_directory TEXT,
        deployment_url TEXT,
        deployment_type VARCHAR(50) DEFAULT 'static' CHECK (deployment_type IN ('static', 'spa', 'ssr', 'api', 'full-stack')),
        platform VARCHAR(50) DEFAULT 'azure' CHECK (platform IN ('azure', 'vercel', 'netlify', 'aws', 'gcp')),
        environment VARCHAR(50) DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'deployed', 'failed', 'cancelled')),
        build_id VARCHAR(255),
        commit_hash VARCHAR(40),
        branch_name VARCHAR(100) DEFAULT 'main',
        build_logs TEXT,
        error_logs TEXT,
        error_message TEXT, -- Keep compatibility
        build_duration_ms INTEGER,
        bundle_size BIGINT,
        performance_score INTEGER,
        deployment_config JSONB DEFAULT '{}',
        environment_variables JSONB DEFAULT '{}',
        custom_domain VARCHAR(255),
        ssl_certificate_id VARCHAR(255),
        cdn_enabled BOOLEAN DEFAULT TRUE,
        analytics_enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
    );

    -- Add foreign key constraints to match existing schema types
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
        ALTER TABLE public.deployments 
        ADD CONSTRAINT deployments_project_id_fkey 
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'domains') THEN
        ALTER TABLE public.deployments 
        ADD CONSTRAINT deployments_domain_id_fkey 
        FOREIGN KEY (domain_id) REFERENCES public.domains(id) ON DELETE SET NULL;
    END IF;

EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Step 2: Add missing tables that don't exist in current schema
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
    total_storage_used BIGINT DEFAULT 0,
    max_storage_limit BIGINT DEFAULT 1073741824,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

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

-- Update existing components table with missing columns
DO $$
BEGIN
    -- Add missing columns to components table if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'components' AND column_name = 'rating_count'
    ) THEN
        ALTER TABLE public.components ADD COLUMN rating_count INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'components' AND column_name = 'preview_images'
    ) THEN
        ALTER TABLE public.components ADD COLUMN preview_images TEXT[];
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'components' AND column_name = 'subcategory'
    ) THEN
        ALTER TABLE public.components ADD COLUMN subcategory VARCHAR(100);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'components' AND column_name = 'is_premium'
    ) THEN
        ALTER TABLE public.components ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'components' AND column_name = 'version'
    ) THEN
        ALTER TABLE public.components ADD COLUMN version VARCHAR(20) DEFAULT '1.0.0';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'components' AND column_name = 'license'
    ) THEN
        ALTER TABLE public.components ADD COLUMN license VARCHAR(50) DEFAULT 'MIT';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'components' AND column_name = 'demo_url'
    ) THEN
        ALTER TABLE public.components ADD COLUMN demo_url TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'components' AND column_name = 'documentation_url'
    ) THEN
        ALTER TABLE public.components ADD COLUMN documentation_url TEXT;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Step 3: Create missing tables for complete platform functionality
CREATE TABLE IF NOT EXISTS public.component_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    component_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(component_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.component_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    component_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    download_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.user_components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    generated_code TEXT NOT NULL,
    preview_image_url TEXT,
    ai_provider VARCHAR(50),
    ai_model VARCHAR(100),
    generation_time_ms INTEGER,
    token_count INTEGER,
    framework VARCHAR(50) DEFAULT 'react',
    language VARCHAR(50) DEFAULT 'typescript',
    is_public BOOLEAN DEFAULT FALSE,
    is_favorite BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.ai_generation_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    prompt_text TEXT NOT NULL,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_tokens INTEGER,
    generation_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    cost_estimate DECIMAL(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Fix DNS records table to reference domains correctly
DO $$
BEGIN
    -- Drop and recreate dns_records table to fix domain relationship
    DROP TABLE IF EXISTS public.dns_records CASCADE;
    
    CREATE TABLE public.domain_dns_records (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        domain_id BIGINT REFERENCES public.domains(id) ON DELETE CASCADE NOT NULL,
        record_type VARCHAR(10) NOT NULL CHECK (record_type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV')),
        name VARCHAR(255) NOT NULL,
        value TEXT NOT NULL,
        ttl INTEGER DEFAULT 3600,
        priority INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
    );
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Step 4: Create additional new tables
CREATE TABLE IF NOT EXISTS public.deployment_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deployment_id UUID REFERENCES public.deployments(id) ON DELETE CASCADE NOT NULL,
    metric_date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    avg_session_duration INTEGER,
    page_load_time_ms INTEGER,
    error_rate DECIMAL(5,2),
    uptime_percentage DECIMAL(5,2),
    bandwidth_used BIGINT,
    requests_count INTEGER,
    cache_hit_rate DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.deployment_webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    deployment_id UUID REFERENCES public.deployments(id) ON DELETE CASCADE,
    webhook_url TEXT NOT NULL,
    webhook_type VARCHAR(50) CHECK (webhook_type IN ('build-start', 'build-complete', 'deploy-success', 'deploy-failure')),
    is_active BOOLEAN DEFAULT TRUE,
    secret_token VARCHAR(255),
    headers JSONB DEFAULT '{}',
    retry_count INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deployment_id UUID REFERENCES public.deployments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    page_url TEXT NOT NULL,
    page_title TEXT,
    referrer_url TEXT,
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    screen_resolution VARCHAR(20),
    view_duration_ms INTEGER,
    scroll_depth INTEGER,
    bounce BOOLEAN DEFAULT FALSE,
    conversion_event VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.feature_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    app_name VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    feature_data JSONB DEFAULT '{}',
    session_id UUID,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.system_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,6) NOT NULL,
    metric_unit VARCHAR(20) NOT NULL,
    app_name VARCHAR(50),
    environment VARCHAR(50) DEFAULT 'production',
    additional_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    action_label VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    delivery_method VARCHAR(50) DEFAULT 'in-app' CHECK (delivery_method IN ('in-app', 'email', 'push', 'sms')),
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_key VARCHAR(100) UNIQUE NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    subject_template TEXT NOT NULL,
    html_template TEXT NOT NULL,
    text_template TEXT,
    template_variables JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_key VARCHAR(50) UNIQUE NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    max_projects INTEGER,
    max_deployments INTEGER,
    max_storage_gb INTEGER,
    max_domains INTEGER,
    ai_generation_credits INTEGER,
    priority_support BOOLEAN DEFAULT FALSE,
    custom_branding BOOLEAN DEFAULT FALSE,
    advanced_analytics BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Update existing user_subscriptions table structure if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_subscriptions' AND column_name = 'plan_id'
    ) THEN
        ALTER TABLE public.user_subscriptions ADD COLUMN plan_id UUID REFERENCES public.subscription_plans(id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_subscriptions' AND column_name = 'stripe_subscription_id'
    ) THEN
        ALTER TABLE public.user_subscriptions ADD COLUMN stripe_subscription_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_subscriptions' AND column_name = 'stripe_customer_id'
    ) THEN
        ALTER TABLE public.user_subscriptions ADD COLUMN stripe_customer_id VARCHAR(255);
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.user_subscriptions(id),
    usage_type VARCHAR(50) NOT NULL,
    usage_amount BIGINT NOT NULL,
    usage_unit VARCHAR(20) NOT NULL,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    overage_amount BIGINT DEFAULT 0,
    overage_cost DECIMAL(10,4) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON public.user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON public.projects(is_public);
CREATE INDEX IF NOT EXISTS idx_nodes_project_id ON public.nodes(project_id);
CREATE INDEX IF NOT EXISTS idx_nodes_parent_id ON public.nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_nodes_type ON public.nodes(type);
CREATE INDEX IF NOT EXISTS idx_components_category ON public.components(category);
CREATE INDEX IF NOT EXISTS idx_components_rating ON public.components(rating DESC);
CREATE INDEX IF NOT EXISTS idx_components_price ON public.components(price);
CREATE INDEX IF NOT EXISTS idx_components_created_at ON public.components(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_components_is_featured ON public.components(is_featured);
CREATE INDEX IF NOT EXISTS idx_components_is_active ON public.components(is_active);
CREATE INDEX IF NOT EXISTS idx_components_framework ON public.components(framework);
CREATE INDEX IF NOT EXISTS idx_deployments_user_id ON public.deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON public.deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON public.deployments(created_at DESC);

-- Step 6: Insert default data
INSERT INTO public.subscription_plans (plan_key, plan_name, description, price_monthly, price_yearly, max_projects, max_deployments, max_storage_gb, max_domains, ai_generation_credits) VALUES
('free', 'Free Plan', 'Perfect for getting started with OurSynth', 0.00, 0.00, 3, 3, 1, 1, 10),
('pro', 'Pro Plan', 'For serious developers and small teams', 29.99, 299.99, 25, 25, 50, 10, 500),
('enterprise', 'Enterprise Plan', 'For large teams and organizations', 99.99, 999.99, -1, -1, 500, 50, 2000)
ON CONFLICT (plan_key) DO NOTHING;

INSERT INTO public.email_templates (template_key, template_name, subject_template, html_template, text_template) VALUES
('welcome', 'Welcome Email', 'Welcome to OurSynth, {{user_name}}!', '<h1>Welcome {{user_name}}!</h1><p>Thanks for joining OurSynth. Get started by creating your first project.</p>', 'Welcome {{user_name}}! Thanks for joining OurSynth. Get started by creating your first project.'),
('domain_expiry', 'Domain Expiry Warning', 'Your domain {{domain_name}} expires soon', '<h1>Domain Expiry Notice</h1><p>Your domain {{domain_name}} expires on {{expiry_date}}. Renew now to avoid service interruption.</p>', 'Your domain {{domain_name}} expires on {{expiry_date}}. Renew now to avoid service interruption.'),
('deployment_success', 'Deployment Successful', 'Your deployment {{deployment_name}} is live!', '<h1>Deployment Successful!</h1><p>Your deployment {{deployment_name}} is now live at {{deployment_url}}</p>', 'Your deployment {{deployment_name}} is now live at {{deployment_url}}')
ON CONFLICT (template_key) DO NOTHING;

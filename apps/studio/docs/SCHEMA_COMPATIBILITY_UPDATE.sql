-- =====================================================
-- OURSYNTH PLATFORM - SCHEMA COMPATIBILITY UPDATE
-- =====================================================
-- This script works with your existing database schema and adds
-- only the missing pieces needed for the complete platform
-- =====================================================

-- Add missing columns to existing tables
ALTER TABLE public.components 
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS preview_images TEXT[],
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS version VARCHAR(20) DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS license VARCHAR(50) DEFAULT 'MIT',
ADD COLUMN IF NOT EXISTS demo_url TEXT,
ADD COLUMN IF NOT EXISTS documentation_url TEXT;

-- Update existing user_projects to add missing columns
ALTER TABLE public.user_projects
ADD COLUMN IF NOT EXISTS fork_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS star_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;

-- Add missing columns to domains table
ALTER TABLE public.domains
ADD COLUMN IF NOT EXISTS registrar VARCHAR(100),
ADD COLUMN IF NOT EXISTS purchase_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS renewal_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS whois_privacy BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nameservers TEXT[],
ADD COLUMN IF NOT EXISTS ssl_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ssl_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update domains table status values
ALTER TABLE public.domains 
ALTER COLUMN status SET DEFAULT 'active';

-- Create new missing tables
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    location_country VARCHAR(100),
    location_city VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS public.component_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    component_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(component_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.component_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    component_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    download_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Replace dns_records with domain_dns_records (better structure)
DROP TABLE IF EXISTS public.dns_records CASCADE;

CREATE TABLE IF NOT EXISTS public.domain_dns_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain_id BIGINT REFERENCES public.domains(id) ON DELETE CASCADE NOT NULL,
    record_type VARCHAR(10) NOT NULL CHECK (record_type IN ('A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV')),
    name VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    ttl INTEGER DEFAULT 3600,
    priority INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update existing deployments table to new structure
-- Note: This keeps your existing BIGINT types for compatibility
ALTER TABLE public.deployments
ADD COLUMN IF NOT EXISTS deployment_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS deployment_type VARCHAR(50) DEFAULT 'static',
ADD COLUMN IF NOT EXISTS platform VARCHAR(50) DEFAULT 'azure',
ADD COLUMN IF NOT EXISTS environment VARCHAR(50) DEFAULT 'production',
ADD COLUMN IF NOT EXISTS build_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS commit_hash VARCHAR(40),
ADD COLUMN IF NOT EXISTS build_logs TEXT,
ADD COLUMN IF NOT EXISTS bundle_size BIGINT,
ADD COLUMN IF NOT EXISTS performance_score INTEGER,
ADD COLUMN IF NOT EXISTS deployment_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS environment_variables JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(255),
ADD COLUMN IF NOT EXISTS ssl_certificate_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS cdn_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS analytics_enabled BOOLEAN DEFAULT TRUE;

-- Add project_id to deployments if it doesn't exist
ALTER TABLE public.deployments
ADD COLUMN IF NOT EXISTS project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS domain_id BIGINT REFERENCES public.domains(id) ON DELETE SET NULL;

-- Update deployment_name from site_name if empty
UPDATE public.deployments 
SET deployment_name = site_name 
WHERE deployment_name IS NULL AND site_name IS NOT NULL;

-- Create new analytics and notification tables
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    view_duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to existing user_subscriptions
ALTER TABLE public.user_subscriptions
ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.subscription_plans(id),
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 month',
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_components_category ON public.components(category);
CREATE INDEX IF NOT EXISTS idx_components_rating ON public.components(rating DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON public.deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_domain_dns_records_domain_id ON public.domain_dns_records(domain_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (plan_key, plan_name, description, price_monthly, price_yearly, max_projects, max_deployments, max_storage_gb, max_domains, ai_generation_credits) VALUES
('free', 'Free Plan', 'Perfect for getting started with OurSynth', 0.00, 0.00, 3, 3, 1, 1, 10),
('pro', 'Pro Plan', 'For serious developers and small teams', 29.99, 299.99, 25, 25, 50, 10, 500),
('enterprise', 'Enterprise Plan', 'For large teams and organizations', 99.99, 999.99, -1, -1, 500, 50, 2000)
ON CONFLICT (plan_key) DO NOTHING;

-- Create useful views
CREATE OR REPLACE VIEW projects_with_stats AS
SELECT 
    p.*,
    COUNT(n.id) as node_count,
    MAX(n.updated_at) as last_node_update
FROM public.projects p
LEFT JOIN public.nodes n ON p.id = n.project_id
GROUP BY p.id;

CREATE OR REPLACE VIEW user_dashboard_summary AS
SELECT 
    u.id as user_id,
    up.display_name,
    up.subscription_tier,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT d.id) as total_domains,
    COUNT(DISTINCT dep.id) as total_deployments,
    COUNT(DISTINCT uc.id) as total_ai_components
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.id
LEFT JOIN public.projects p ON u.id = p.user_id
LEFT JOIN public.domains d ON u.id = d.user_id
LEFT JOIN public.deployments dep ON u.id = dep.user_id
LEFT JOIN public.user_components uc ON u.id = uc.user_id
GROUP BY u.id, up.display_name, up.subscription_tier;

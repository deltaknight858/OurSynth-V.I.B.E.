-- =====================================================
-- OURSYNTH PLATFORM - SAFE MIGRATION SCRIPT
-- =====================================================
-- This script safely extends your existing database structure
-- while preserving all existing data and table relationships.
-- It adds missing functionality without breaking existing apps.
-- =====================================================

-- =====================================================
-- 1. EXTEND EXISTING TABLES WITH MISSING COLUMNS
-- =====================================================

-- Extend existing projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS canvas_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS project_metadata JSONB DEFAULT '{}';

-- Extend existing nodes table  
ALTER TABLE public.nodes
ADD COLUMN IF NOT EXISTS z_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;

-- Extend existing domains table
ALTER TABLE public.domains
ADD COLUMN IF NOT EXISTS registrar VARCHAR(100),
ADD COLUMN IF NOT EXISTS purchase_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS renewal_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS whois_privacy BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nameservers TEXT[],
ADD COLUMN IF NOT EXISTS dns_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ssl_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ssl_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Extend existing components table
ALTER TABLE public.components
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS preview_images TEXT[],
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS version VARCHAR(20) DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS license VARCHAR(50) DEFAULT 'MIT',
ADD COLUMN IF NOT EXISTS demo_url TEXT,
ADD COLUMN IF NOT EXISTS documentation_url TEXT;

-- Extend existing deployments table
ALTER TABLE public.deployments
ADD COLUMN IF NOT EXISTS deployment_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS deployment_type VARCHAR(50) DEFAULT 'static' CHECK (deployment_type IN ('static', 'spa', 'ssr', 'api', 'full-stack')),
ADD COLUMN IF NOT EXISTS platform VARCHAR(50) DEFAULT 'azure' CHECK (platform IN ('azure', 'vercel', 'netlify', 'aws', 'gcp')),
ADD COLUMN IF NOT EXISTS environment VARCHAR(50) DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
ADD COLUMN IF NOT EXISTS build_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS commit_hash VARCHAR(40),
ADD COLUMN IF NOT EXISTS build_logs TEXT,
ADD COLUMN IF NOT EXISTS build_duration_ms INTEGER,
ADD COLUMN IF NOT EXISTS bundle_size BIGINT,
ADD COLUMN IF NOT EXISTS performance_score INTEGER,
ADD COLUMN IF NOT EXISTS deployment_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS environment_variables JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_domain VARCHAR(255),
ADD COLUMN IF NOT EXISTS ssl_certificate_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS cdn_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS analytics_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS domain_id BIGINT REFERENCES public.domains(id) ON DELETE SET NULL;

-- Update deployment_name if null
UPDATE public.deployments 
SET deployment_name = site_name 
WHERE deployment_name IS NULL;

-- =====================================================
-- 2. CREATE NEW TABLES (MISSING FUNCTIONALITY)
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
    total_storage_used BIGINT DEFAULT 0,
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
    UNIQUE(component_id, user_id)
);

-- Component Downloads Tracking
CREATE TABLE IF NOT EXISTS public.component_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    component_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    download_source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- User Generated Components (AI-Created)
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

-- AI Generation Metrics
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

-- Deployment Metrics
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

-- Deployment Webhooks & Integrations
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

-- Page Views & User Analytics
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

-- Feature Usage Analytics
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

-- System Performance Metrics
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

-- User Notifications
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

-- Email Templates & Campaigns
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

-- Subscription Plans
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

-- Usage Tracking for Billing
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

-- =====================================================
-- 3. CREATE PERFORMANCE INDEXES
-- =====================================================

-- User Profiles Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON public.user_profiles(subscription_tier);

-- Projects Indexes (existing table)
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON public.projects(is_public);

-- Nodes Indexes (existing table)
CREATE INDEX IF NOT EXISTS idx_nodes_project_id ON public.nodes(project_id);
CREATE INDEX IF NOT EXISTS idx_nodes_parent_id ON public.nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_nodes_type ON public.nodes(type);

-- Components Indexes (existing table)
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

-- Domains Indexes (existing table)
CREATE INDEX IF NOT EXISTS idx_domains_user_id ON public.domains(user_id);
CREATE INDEX IF NOT EXISTS idx_domains_name ON public.domains(name);
CREATE INDEX IF NOT EXISTS idx_domains_expires_at ON public.domains(expires_at);
CREATE INDEX IF NOT EXISTS idx_domains_status ON public.domains(status);

-- Deployments Indexes (existing table)
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
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Component Reviews Policies
CREATE POLICY "Users can view component reviews" ON public.component_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON public.component_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.component_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- User Components Policies (AI-Generated)
CREATE POLICY "Users can only access their own components" ON public.user_components
    FOR ALL USING (auth.uid() = user_id);

-- Deployments Policies (extend existing table)
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
-- 5. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to extended tables
CREATE TRIGGER set_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_domains
    BEFORE UPDATE ON public.domains
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_user_components
    BEFORE UPDATE ON public.user_components
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_deployment_webhooks
    BEFORE UPDATE ON public.deployment_webhooks
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
-- 6. INITIAL DATA & SAMPLE RECORDS
-- =====================================================

-- Insert default subscription plans
INSERT INTO public.subscription_plans (plan_key, plan_name, description, price_monthly, price_yearly, max_projects, max_deployments, max_storage_gb, max_domains, ai_generation_credits) VALUES
('free', 'Free Plan', 'Perfect for getting started with OurSynth', 0.00, 0.00, 3, 3, 1, 1, 10),
('pro', 'Pro Plan', 'For serious developers and small teams', 29.99, 299.99, 25, 25, 50, 10, 500),
('enterprise', 'Enterprise Plan', 'For large teams and organizations', 99.99, 999.99, -1, -1, 500, 50, 2000)
ON CONFLICT (plan_key) DO NOTHING;

-- Insert default email templates
INSERT INTO public.email_templates (template_key, template_name, subject_template, html_template, text_template) VALUES
('welcome', 'Welcome Email', 'Welcome to OurSynth, {{user_name}}!', '<h1>Welcome {{user_name}}!</h1><p>Thanks for joining OurSynth. Get started by creating your first project.</p>', 'Welcome {{user_name}}! Thanks for joining OurSynth. Get started by creating your first project.'),
('domain_expiry', 'Domain Expiry Warning', 'Your domain {{domain_name}} expires soon', '<h1>Domain Expiry Notice</h1><p>Your domain {{domain_name}} expires on {{expiry_date}}. Renew now to avoid service interruption.</p>', 'Your domain {{domain_name}} expires on {{expiry_date}}. Renew now to avoid service interruption.'),
('deployment_success', 'Deployment Successful', 'Your deployment {{deployment_name}} is live!', '<h1>Deployment Successful!</h1><p>Your deployment {{deployment_name}} is now live at {{deployment_url}}</p>', 'Your deployment {{deployment_name}} is now live at {{deployment_url}}')
ON CONFLICT (template_key) DO NOTHING;

-- =====================================================
-- 7. GRANTS & PERMISSIONS
-- =====================================================

-- Grant necessary permissions to new tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.component_reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.component_downloads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_components TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_generation_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deployment_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deployment_webhooks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_views TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feature_usage TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.usage_tracking TO authenticated;

-- Subscription plans - read-only for all
GRANT SELECT ON public.subscription_plans TO anon, authenticated;

-- Email templates - read-only for authenticated
GRANT SELECT ON public.email_templates TO authenticated;

-- =====================================================
-- END OF SAFE MIGRATION SCRIPT
-- =====================================================

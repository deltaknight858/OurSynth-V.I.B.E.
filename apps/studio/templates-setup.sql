-- Additional SQL setup for templates and user projects
-- Run this after the main supabase-setup.sql

-- Create user_projects table for templates
CREATE TABLE IF NOT EXISTS public.user_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES public.components(id), -- Reference to the original template component
    project_data JSONB, -- Store the project configuration/data
    thumbnail_url TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for user_projects
CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON public.user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_template_id ON public.user_projects(template_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_created_at ON public.user_projects(created_at DESC);

-- Enable RLS for user_projects
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_projects
CREATE POLICY "Users can read their own projects" ON public.user_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.user_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.user_projects
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.user_projects
    FOR DELETE USING (auth.uid() = user_id);

-- Allow read access to public projects
CREATE POLICY "Public can read public projects" ON public.user_projects
    FOR SELECT USING (is_public = true);

-- Add some additional template data to the components table
INSERT INTO public.components (name, description, price, rating, category, tags, is_featured, framework, component_data) VALUES
('Dashboard Layout', 'Complete dashboard template with sidebar and responsive grid', 27.99, 4.6, 'Templates', ARRAY['dashboard', 'layout', 'sidebar', 'responsive'], false, 'react', '{"layout": "sidebar", "responsive": true, "components": ["header", "sidebar", "main", "footer"]}'),
('E-commerce Store', 'Full e-commerce template with product listings and checkout', 32.99, 4.8, 'Templates', ARRAY['ecommerce', 'shop', 'product', 'checkout'], true, 'react', '{"pages": ["home", "product", "cart", "checkout"], "responsive": true, "components": ["product-card", "cart", "checkout-form"]}'),
('Landing Page Pro', 'Modern landing page template with hero section and CTAs', 29.99, 4.4, 'Templates', ARRAY['landing', 'hero', 'cta', 'marketing'], false, 'react', '{"sections": ["hero", "features", "testimonials", "cta"], "animations": true, "responsive": true}'),
('Admin Panel', 'Complete admin dashboard with data tables and charts', 49.99, 4.9, 'Templates', ARRAY['admin', 'dashboard', 'charts', 'tables'], true, 'react', '{"components": ["data-table", "charts", "forms", "navigation"], "theme": "customizable", "responsive": true}'),
('Blog Template', 'Clean blog template with article layouts and search', 34.99, 4.7, 'Templates', ARRAY['blog', 'article', 'content', 'responsive'], false, 'react', '{"layouts": ["post", "archive", "search"], "seo": true, "responsive": true, "dark-mode": true}'),
('Portfolio Showcase', 'Creative portfolio template for designers and developers', 24.99, 4.5, 'Templates', ARRAY['portfolio', 'showcase', 'creative', 'responsive'], false, 'react', '{"layouts": ["grid", "masonry", "slider"], "animations": true, "responsive": true, "lightbox": true}')
ON CONFLICT DO NOTHING;

-- Grant permissions for user_projects table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_projects TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

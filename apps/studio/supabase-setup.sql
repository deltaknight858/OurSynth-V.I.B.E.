-- Supabase SQL script to create the components table for the marketplace
-- Run this in your Supabase SQL Editor

-- Create the components table for UI marketplace
CREATE TABLE IF NOT EXISTS public.components (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    thumbnail_url TEXT,
    category VARCHAR(100),
    download_url TEXT,
    file_size BIGINT,
    downloads_count INTEGER DEFAULT 0,
    author_id UUID REFERENCES auth.users(id),
    tags TEXT[], -- Array of tags for better searching
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    component_data JSONB, -- Store the actual component configuration
    framework VARCHAR(50) DEFAULT 'react', -- react, vue, angular, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_components_category ON public.components(category);
CREATE INDEX IF NOT EXISTS idx_components_rating ON public.components(rating DESC);
CREATE INDEX IF NOT EXISTS idx_components_price ON public.components(price);
CREATE INDEX IF NOT EXISTS idx_components_created_at ON public.components(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_components_is_featured ON public.components(is_featured);
CREATE INDEX IF NOT EXISTS idx_components_is_active ON public.components(is_active);
CREATE INDEX IF NOT EXISTS idx_components_framework ON public.components(framework);

-- Enable Row Level Security (RLS)
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS

-- Allow everyone to read active components
CREATE POLICY "Allow public read access to active components" ON public.components
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert their own components
CREATE POLICY "Allow authenticated users to insert components" ON public.components
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own components
CREATE POLICY "Allow users to update their own components" ON public.components
    FOR UPDATE USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Allow users to delete their own components
CREATE POLICY "Allow users to delete their own components" ON public.components
    FOR DELETE USING (auth.uid() = author_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.components
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data
INSERT INTO public.components (name, description, price, rating, category, tags, is_featured, framework, component_data) VALUES
('Modern Button Set', 'Collection of stylish buttons with hover effects and animations', 12.99, 4.8, 'Buttons', ARRAY['button', 'modern', 'hover', 'animation'], true, 'react', '{"variants": ["primary", "secondary", "outline"], "sizes": ["sm", "md", "lg"]}'),
('Card Components', 'Beautiful card layouts for content display', 0.00, 4.6, 'Layout', ARRAY['card', 'layout', 'content', 'free'], false, 'react', '{"elevation": true, "variants": ["filled", "outlined"], "responsive": true}'),
('Form Input Library', 'Complete form input collection with validation', 29.99, 4.9, 'Forms', ARRAY['input', 'form', 'validation', 'accessibility'], true, 'react', '{"types": ["text", "email", "password", "select"], "validation": true}'),
('Navigation Components', 'Header, sidebar, and breadcrumb navigation elements', 24.99, 4.7, 'Navigation', ARRAY['nav', 'header', 'sidebar', 'breadcrumb'], false, 'react', '{"responsive": true, "collapsible": true, "themes": ["light", "dark"]}'),
('Data Table Pro', 'Advanced data table with sorting, filtering, and pagination', 49.99, 4.5, 'Data Display', ARRAY['table', 'data', 'sorting', 'pagination'], false, 'react', '{"features": ["sort", "filter", "pagination", "export"], "virtualization": true}'),
('Modal & Dialog Set', 'Flexible modal and dialog components with animations', 19.99, 4.4, 'Overlays', ARRAY['modal', 'dialog', 'popup', 'overlay'], false, 'react', '{"animations": true, "backdrop": "blur", "sizes": ["sm", "md", "lg", "xl"]}'),
('Icon Button Pack', 'Beautiful icon buttons with multiple states and styles', 15.99, 4.8, 'Buttons', ARRAY['icon', 'button', 'minimal', 'states'], true, 'react', '{"icons": "lucide", "states": ["default", "hover", "active", "disabled"], "shapes": ["circle", "square"]}'),
('Loading Components', 'Skeleton loaders, spinners, and progress indicators', 8.99, 4.3, 'Feedback', ARRAY['loading', 'skeleton', 'spinner', 'progress'], false, 'react', '{"types": ["skeleton", "spinner", "progress", "dots"], "customizable": true}'),
('Toast Notifications', 'Elegant toast notification system with animations', 22.99, 4.6, 'Feedback', ARRAY['toast', 'notification', 'alert', 'snackbar'], false, 'react', '{"positions": ["top", "bottom"], "types": ["success", "error", "warning", "info"], "dismissible": true}'),
('Layout Templates', 'Complete page layout templates for rapid prototyping', 39.99, 4.5, 'Templates', ARRAY['layout', 'template', 'page', 'responsive'], true, 'react', '{"layouts": ["dashboard", "landing", "blog", "ecommerce"], "responsive": true, "customizable": true}');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.components TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.components TO authenticated;

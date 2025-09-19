-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    description text,
    thumbnail_url text,
    tags text[],
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to templates
CREATE POLICY "Allow public read access to templates" ON templates
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert templates
CREATE POLICY "Allow authenticated insert on templates" ON templates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their own templates
CREATE POLICY "Allow authenticated update on templates" ON templates
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_name ON templates(name);
CREATE INDEX IF NOT EXISTS idx_templates_tags ON templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at DESC);

-- Insert some sample template data
INSERT INTO templates (name, description, thumbnail_url, tags) VALUES 
('React Component Kit', 'Modern React components with TypeScript', 'https://via.placeholder.com/400x200?text=React+Kit', ARRAY['react', 'typescript', 'components', 'ui']),
('Vue.js Starter', 'Complete Vue.js application template', 'https://via.placeholder.com/400x200?text=Vue+Starter', ARRAY['vue', 'javascript', 'spa', 'frontend']),
('Node.js API Server', 'RESTful API server with Express and MongoDB', 'https://via.placeholder.com/400x200?text=Node+API', ARRAY['nodejs', 'express', 'mongodb', 'api']),
('Python Data Science', 'Jupyter notebook for data analysis', 'https://via.placeholder.com/400x200?text=Python+DS', ARRAY['python', 'jupyter', 'data-science', 'analysis']),
('Flutter Mobile App', 'Cross-platform mobile app template', 'https://via.placeholder.com/400x200?text=Flutter+App', ARRAY['flutter', 'dart', 'mobile', 'cross-platform']),
('Docker Compose Stack', 'Multi-service application with Docker', 'https://via.placeholder.com/400x200?text=Docker+Stack', ARRAY['docker', 'devops', 'containerization', 'microservices']);

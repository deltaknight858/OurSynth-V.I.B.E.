-- =====================================================
-- DATABASE VERIFICATION QUERIES
-- =====================================================
-- Run these queries in Supabase SQL Editor to verify your setup

-- 1. Check all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Verify subscription plans data
SELECT plan_key, plan_name, price_monthly 
FROM public.subscription_plans;

-- 3. Check sample components
SELECT name, category, price, framework 
FROM public.components;

-- 4. Verify Row Level Security is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- 5. Check views were created
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- 6. Test user profile creation (replace with your actual user ID)
-- INSERT INTO public.user_profiles (id, username, display_name) 
-- VALUES (auth.uid(), 'testuser', 'Test User');

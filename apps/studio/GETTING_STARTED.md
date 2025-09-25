# 🚀 OurSynth Platform - Getting Started

Your database is now ready! Follow these steps to get your OurSynth Platform running.

## ✅ **What's Already Done:**
- ✅ Complete database schema deployed (1119 lines)
- ✅ All tables created with UUID primary keys  
- ✅ Row Level Security (RLS) policies enabled
- ✅ Sample data inserted (subscription plans, components)
- ✅ Database views created for analytics
- ✅ TypeScript types generated and shared
- ✅ Shared Supabase client created

## 🎯 **Next Steps:**

### **1. Configure Environment Variables**

Copy your Supabase credentials from: https://app.supabase.com/project/YOUR_PROJECT/settings/api

**For each app** (`studio`, `pathways`, `domains`, `deploy`), create `.env.local`:

```bash
# In each app directory: apps/studio/.env.local, apps/pathways/.env.local, etc.
cp .env.local.example .env.local
```

Then fill in your credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **2. Install Dependencies**

```bash
# From the root directory
npm install

# Build shared packages
npm run build:packages
```

### **3. Start Development Servers**

```bash
# Start all apps simultaneously
npm run dev

# Or start individual apps:
npm run dev:studio      # Studio App (Canvas Builder)
npm run dev:pathways    # Pathways App (AI Components)  
npm run dev:domains     # Domains App (Domain Management)
npm run dev:deploy      # Deploy App (Deployment Tracking)
```

### **4. Test Database Connection**

Visit any app and try to:
1. **Sign up for an account**
2. **Create a user profile** 
3. **Create a project/component/domain**

## 📊 **Database Verification**

Run these queries in **Supabase SQL Editor** to verify everything works:

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Check sample data
SELECT plan_key, plan_name, price_monthly FROM subscription_plans;
SELECT name, category, framework FROM components;

-- Test RLS is working
SELECT COUNT(*) FROM user_profiles; -- Should return 0 if not authenticated
```

## 🏗️ **Platform Architecture**

Your OurSynth Platform now includes:

### **🎨 Studio App** (`localhost:3000`)
- Visual canvas for building React components
- Drag-and-drop interface
- Project management
- **Database:** `projects`, `nodes` tables

### **🤖 Pathways App** (`localhost:3001`) 
- AI-powered component generation
- OpenAI/Claude integration ready
- Component library
- **Database:** `user_components`, `ai_generation_metrics` tables

### **🌐 Domains App** (`localhost:3002`)
- Domain registration & management
- DNS record management  
- SSL certificate tracking
- **Database:** `domains`, `domain_dns_records` tables

### **🚀 Deploy App** (`localhost:3003`)
- Deployment tracking & analytics
- Multi-platform support (Azure, Vercel, Netlify)
- Performance monitoring
- **Database:** `deployments`, `deployment_metrics` tables

### **👥 Shared Services**
- **Authentication:** Supabase Auth with user profiles
- **Billing:** Stripe integration ready (`subscription_plans`, `user_subscriptions`)
- **Analytics:** Usage tracking and metrics
- **Notifications:** In-app notification system

## 🔧 **Common Issues & Solutions**

### **Environment Variables Not Found**
```bash
# Make sure you've created .env.local in each app directory
ls apps/*/env.local  # Should show all your env files
```

### **TypeScript Errors**
```bash
# Rebuild shared packages
npm run build:packages
```

### **Database Connection Issues**
1. Check your Supabase project is active
2. Verify URL and anon key are correct
3. Ensure RLS policies are enabled

### **Port Conflicts**
If ports are in use, update them in each app's `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3005"  // Change port here
  }
}
```

## 🎉 **You're Ready!**

Your OurSynth Platform is now configured with:
- ✅ **Complete database schema**
- ✅ **Type-safe database operations**  
- ✅ **Multi-app architecture**
- ✅ **Authentication & authorization**
- ✅ **Real-time capabilities**
- ✅ **Analytics & monitoring**

**Start building and watch your platform come to life!** 🚀

## 📚 **Documentation Links**

- **Supabase Dashboard:** https://app.supabase.com/project/YOUR_PROJECT
- **Database Schema:** `docs/COMPLETE_DATABASE_SCHEMA.sql`
- **API Reference:** Generated types in `packages/shared-types/src/database.ts`
- **Shared Client:** `packages/shared-types/src/supabase.ts`

---

**Need help?** Check the troubleshooting section or create an issue in the repository.

# 🔑 Environment Variables Setup Guide

## 📋 **Quick Setup Steps**

### **Option 1: Automated Setup (Recommended)**
```bash
node setup-env.js
```
This interactive script will guide you through configuring all environment variables.

### **Option 2: Manual Setup**

#### **1. Get Your Supabase Credentials**
1. Go to https://app.supabase.com/projects
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Anon/Public Key** (starts with `eyJ`)

#### **2. Update Environment Files**
Replace the placeholder values in each app's `.env.local` file:

**All Apps Need:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Pathways App (AI Components) - Optional:**
```bash
OPENAI_API_KEY=your-openai-api-key-here
```

## 📁 **Environment Files Created**

| App | File Location | Purpose |
|-----|---------------|---------|
| **Studio** | `apps/studio/.env.local` | Canvas builder & marketplace |
| **Pathways** | `apps/pathways/.env.local` | AI component generation |
| **Domains** | `apps/domains/.env.local` | Domain management & DNS |
| **Deploy** | `apps/deploy/.env.local` | Deployment tracking |
| **Dashboard** | `apps/dashboard/.env.local` | Analytics & management |

## 🔌 **Optional Integrations**

### **AI Providers (for Pathways App)**
- **OpenAI**: Get API key from https://platform.openai.com/api-keys
- **Anthropic**: Get API key from https://console.anthropic.com
- **Azure OpenAI**: Configure through Azure portal

### **Domain Providers (for Domains App)**
- **GoDaddy**: API keys from GoDaddy Developer Center
- **Namecheap**: API access from Namecheap account
- **Cloudflare**: API tokens from Cloudflare dashboard

### **Deployment Providers (for Deploy App)**
- **Azure**: Service principal credentials
- **Vercel**: API tokens from Vercel dashboard
- **Netlify**: Personal access tokens
- **AWS**: IAM user credentials

## 🚀 **Start Your Platform**

After setting up environment variables:

```bash
# Install dependencies
npm install

# Build shared packages
npm run build:packages

# Start all development servers
npm run dev
```

Your apps will be available at:
- **Studio**: http://localhost:3000
- **Pathways**: http://localhost:3001
- **Domains**: http://localhost:3002
- **Deploy**: http://localhost:3003
- **Dashboard**: http://localhost:3004

## 🔒 **Security Notes**

- Never commit `.env.local` files to git (they're in `.gitignore`)
- Use different API keys for development and production
- Rotate API keys regularly
- Store production secrets in your deployment platform's secret management

## 🛠️ **Troubleshooting**

### **Missing Dependencies**
```bash
npm install
```

### **Shared Packages Not Building**
```bash
npm run build:packages
```

### **Supabase Connection Issues**
1. Verify your project URL and anon key
2. Check your database is accessible
3. Ensure RLS policies are properly configured

### **AI Provider Issues**
1. Verify API keys are correct
2. Check API usage limits and billing
3. Ensure models are available in your region

---

**Ready to build amazing things with OurSynth Platform!** 🎉

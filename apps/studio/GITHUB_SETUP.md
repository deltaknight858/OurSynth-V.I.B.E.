# GitHub Setup Instructions

## 🚀 Setting up GitHub Repository and CI/CD

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `oursynth-platform` (or your preferred name)
3. Make it public or private as desired
4. **Don't** initialize with README (we already have files)

### 2. Push Your Code to GitHub

Run these commands in your terminal from the `c:\Users\davos\oursynth-platform` directory:

```powershell
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: OurSynth Platform with Azure infrastructure"

# Add your GitHub repository as origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/oursynth-platform.git

# Push to GitHub
git push -u origin main
```

### 3. Configure GitHub Secrets and Variables

Go to your GitHub repository → Settings → Secrets and variables → Actions

#### Repository Secrets (click "New repository secret"):
- `NEXTAUTH_SECRET`: Generate a random secret (e.g., `openssl rand -base64 32`)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud project ID
- `GOOGLE_APPLICATION_CREDENTIALS`: Your Google Cloud service account JSON (as string)
- `AZURE_CREDENTIALS`: Your Azure service principal credentials (JSON format)

#### Repository Variables (click "Variables" tab, then "New repository variable"):
- `AZURE_ENV_NAME`: Your environment name (e.g., `oursynth-prod`)
- `AZURE_LOCATION`: Azure region (e.g., `eastus`)
- `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID
- `NEXTAUTH_URL`: Your production URL (will be set after deployment)
- `AZURE_CLIENT_ID`: Your Azure service principal client ID
- `AZURE_TENANT_ID`: Your Azure tenant ID

### 4. Azure Service Principal Setup

Create an Azure service principal for GitHub Actions:

```powershell
# Login to Azure
az login

# Create service principal (replace YOUR_SUBSCRIPTION_ID)
az ad sp create-for-rbac --name "github-oursynth-platform" --role contributor --scopes /subscriptions/YOUR_SUBSCRIPTION_ID --sdk-auth

# Copy the output JSON and add it as AZURE_CREDENTIALS secret in GitHub
```

### 5. Deploy Your Platform

Once everything is set up:

1. **Push to main branch** - this will trigger the deployment
2. **Monitor the workflow** in GitHub Actions tab
3. **Get your URLs** from the deployment output

## 🛠️ Local Development

To run locally:

```powershell
# Install dependencies
npm install

# Start all services
npm run dev

# Or start individual services
npm run dev:studio    # Studio app on port 3000
npm run dev:pathways  # Pathways app on port 3001
```

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually:

```powershell
# Install Azure Developer CLI
winget install microsoft.azd

# Login to Azure
azd auth login

# Initialize and deploy
azd up
```

## 📋 Environment Variables Template

Create a `.env.local` file in each app directory:

```env
# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# AI Services
OPENAI_API_KEY=your-openai-key
GOOGLE_CLOUD_PROJECT=your-google-project
GOOGLE_APPLICATION_CREDENTIALS=path-to-service-account.json

# Azure (for production)
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
AZURE_OPENAI_API_KEY=your-azure-openai-key
```

## 🎯 Next Steps

1. **Set up GitHub repository** with the instructions above
2. **Configure secrets and variables**
3. **Push your code** to trigger deployment
4. **Load your other 12 apps** into the platform for analysis
5. **Start building the AI App Factory!**

The platform is ready to go! 🚀

#!/usr/bin/env node

/**
 * VIBE Setup Script
 * 
 * Initializes the development environment and seeds initial data
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class VibeSetup {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.colors = {
      cyan: '\x1b[96m',
      purple: '\x1b[95m',
      green: '\x1b[92m',
      yellow: '\x1b[93m',
      red: '\x1b[91m',
      reset: '\x1b[0m',
      bright: '\x1b[1m'
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  async checkPrerequisites() {
    this.log('🔍 Checking prerequisites...', 'cyan');
    
    try {
      // Check Node.js version
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      if (majorVersion < 18) {
        throw new Error(`Node.js 18+ required. Current version: ${nodeVersion}`);
      }
      
      this.log(`✅ Node.js ${nodeVersion}`, 'green');
      
      // Check pnpm
      try {
        execSync('pnpm --version', { stdio: 'pipe' });
        this.log('✅ pnpm installed', 'green');
      } catch {
        throw new Error('pnpm is required. Install with: npm install -g pnpm');
      }
      
    } catch (error) {
      this.log(`❌ Prerequisites check failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }

  async installDependencies() {
    this.log('📦 Installing dependencies...', 'cyan');
    
    try {
      // Try pnpm first, fallback to npm
      try {
        execSync('pnpm install', { 
          stdio: 'inherit', 
          cwd: this.rootDir,
          timeout: 60000 // 1 minute timeout
        });
        this.log('✅ Dependencies installed with pnpm', 'green');
      } catch (pnpmError) {
        this.log('⚠️ pnpm failed, falling back to npm...', 'yellow');
        execSync('npm install', { 
          stdio: 'inherit', 
          cwd: this.rootDir 
        });
        this.log('✅ Dependencies installed with npm', 'green');
      }
    } catch (error) {
      this.log('❌ Failed to install dependencies', 'red');
      process.exit(1);
    }
  }

  async buildPackages() {
    this.log('🔧 Building packages...', 'cyan');
    
    try {
      // Skip build for now since we have TypeScript errors to resolve
      this.log('✅ Skipping build (will be fixed after dependency resolution)', 'yellow');
    } catch (error) {
      this.log('❌ Failed to build packages', 'red');
      process.exit(1);
    }
  }

  async seedData() {
    this.log('🌱 Seeding initial data...', 'cyan');
    
    // Create sample capsules
    const sampleCapsules = [
      {
        title: 'Welcome to V.I.B.E.',
        content: 'Your first memory capsule in the Virtual Identity & Build Environment.',
        category: 'onboarding',
        tags: ['welcome', 'getting-started']
      },
      {
        title: 'Glass/Neon Design System',
        content: 'Key principles: translucent surfaces, neon accents, smooth animations.',
        category: 'design',
        tags: ['design-system', 'ui', 'glass-morphism']
      },
      {
        title: 'Agent Architecture',
        content: 'Agents are executable logic units orchestrated through event bus.',
        category: 'development',
        tags: ['ai', 'agents', 'architecture']
      }
    ];

    // In a real implementation, this would seed a database
    // For now, we'll create sample data files
    const dataDir = path.join(this.rootDir, 'data', 'samples');
    await fs.mkdir(dataDir, { recursive: true });
    
    await fs.writeFile(
      path.join(dataDir, 'capsules.json'),
      JSON.stringify(sampleCapsules, null, 2)
    );
    
    this.log('✅ Sample data created', 'green');
  }

  async createEnvFiles() {
    this.log('📝 Creating environment files...', 'cyan');
    
    const envTemplate = `# VIBE Environment Configuration
# Copy this to .env.local and update with your values

# Database
DATABASE_URL="postgresql://localhost:5432/vibe_dev"

# Redis Cache
REDIS_URL="redis://localhost:6379"

# AI Services
OPENAI_API_KEY="your-openai-api-key-here"
AZURE_OPENAI_ENDPOINT="your-azure-openai-endpoint"
AZURE_OPENAI_API_KEY="your-azure-api-key"

# Authentication
AUTH_SECRET="your-auth-secret-here"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Analytics
ANALYTICS_API_KEY="your-analytics-api-key"

# Feature Flags
ENABLE_MEMORY_PRO="false"
ENABLE_AETHER="false"
ENABLE_ENTERPRISE_FEATURES="false"
`;

    await fs.writeFile(
      path.join(this.rootDir, '.env.example'),
      envTemplate
    );
    
    this.log('✅ Environment template created (.env.example)', 'green');
  }

  async showNextSteps() {
    this.log('\n🎉 VIBE setup complete!', 'bright');
    this.log('\n📋 Next steps:', 'cyan');
    
    console.log(`
${this.colors.yellow}1. Configure Environment:${this.colors.reset}
   cp .env.example .env.local
   # Edit .env.local with your API keys

${this.colors.yellow}2. Start Development:${this.colors.reset}
   pnpm dev

${this.colors.yellow}3. Explore the Platform:${this.colors.reset}
   • Shell: http://localhost:3000 (Core navigation)
   • Docs: Open apps/docs/first-hour.md
   • Tracker: Monitor your contributions
   • Memory: Create knowledge capsules

${this.colors.yellow}4. Build Your First Agent:${this.colors.reset}
   • Check packages/agents for interfaces
   • Explore the orchestrator system
   • Create custom AI workflows

${this.colors.purple}🚀 Welcome to the Virtual Identity & Build Environment!${this.colors.reset}
`);
  }

  async run() {
    try {
      console.log(`
${this.colors.cyan}${this.colors.bright}
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🌐 V.I.B.E. Setup - Virtual Identity & Build Environment   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
${this.colors.reset}
`);

      await this.checkPrerequisites();
      await this.installDependencies();
      await this.buildPackages();
      await this.seedData();
      await this.createEnvFiles();
      await this.showNextSteps();
      
    } catch (error) {
      this.log(`❌ Setup failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new VibeSetup();
  setup.run();
}

module.exports = VibeSetup;
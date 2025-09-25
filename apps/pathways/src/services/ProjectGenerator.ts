export interface ProjectConfig {
  projectName: string;
  description: string;
  deployment: string;
  environment: string;
  features: string[];
  template: {
    id: string;
    name: string;
    description: string;
  };
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'file' | 'directory';
}

export type FileGenerationCallback = (file: GeneratedFile) => void;

export class ProjectGenerator {
  private config: ProjectConfig;
  
  constructor(config: ProjectConfig) {
    this.config = config;
  }

  async generateProject(): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    
    // Create base project structure
    files.push(...this.createBaseStructure());
    
    // Add package.json
    files.push(this.createPackageJson());
    
    // Add framework-specific files
    files.push(...this.createFrameworkFiles());
    
    // Add feature-specific files
    files.push(...this.createFeatureFiles());
    
    // Add deployment configuration
    files.push(...this.createDeploymentConfig());
    
    return files;
  }

  async generateProjectWithStreaming(onFileGenerated?: FileGenerationCallback): Promise<GeneratedFile[]> {
    const allFiles: GeneratedFile[] = [];
    
    // Get all files that would be generated
    const baseFiles = this.createBaseStructure();
    const packageFile = this.createPackageJson();
    const frameworkFiles = this.createFrameworkFiles();
    const featureFiles = this.createFeatureFiles();
    const deploymentFiles = this.createDeploymentConfig();
    
    const filesToGenerate = [
      ...baseFiles,
      packageFile,
      ...frameworkFiles,
      ...featureFiles,
      ...deploymentFiles
    ];

    // Stream files one by one with delays
    for (const file of filesToGenerate) {
      allFiles.push(file);
      
      if (onFileGenerated) {
        onFileGenerated(file);
      }
      
      // Add a small delay to simulate streaming and prevent memory overload
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return allFiles;
  }

  private createBaseStructure(): GeneratedFile[] {
    const projectName = this.sanitizeProjectName(this.config.projectName);
    
    // Only create actual files with content, no empty directories
    const baseFiles: GeneratedFile[] = [
      // Essential project files
      { path: `${projectName}/README.md`, content: this.createReadme(), type: 'file' },
      { path: `${projectName}/.gitignore`, content: this.createGitignore(), type: 'file' },
      { path: `${projectName}/.env.example`, content: this.createEnvExample(), type: 'file' },
      { path: `${projectName}/next.config.js`, content: this.createNextConfig(), type: 'file' },
      { path: `${projectName}/tsconfig.json`, content: this.createTsConfig(), type: 'file' },
      { path: `${projectName}/tailwind.config.js`, content: this.createTailwindConfig(), type: 'file' },
      
      // Basic app structure
      { path: `${projectName}/src/pages/index.tsx`, content: this.createIndexPage(), type: 'file' },
      { path: `${projectName}/src/pages/_app.tsx`, content: this.createAppTsx(), type: 'file' },
      { path: `${projectName}/src/styles/globals.css`, content: this.createGlobalsCss(), type: 'file' },
    ];
    
    return baseFiles;
  }

  private createPackageJson(): GeneratedFile {
    const projectName = this.sanitizeProjectName(this.config.projectName);
    const dependencies = this.getDependencies();
    
    const packageJson = {
      name: projectName,
      version: "0.1.0",
      private: true,
      description: this.config.description,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
        ...(this.config.features.includes('Testing Setup') && {
          test: "jest",
          "test:watch": "jest --watch"
        })
      },
      dependencies: dependencies.dependencies,
      devDependencies: dependencies.devDependencies,
      ...(this.config.features.includes('Testing Setup') && {
        jest: {
          testEnvironment: "jsdom",
          setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
        }
      })
    };

    return {
      path: `${projectName}/package.json`,
      content: JSON.stringify(packageJson, null, 2),
      type: 'file'
    };
  }

  private createFrameworkFiles(): GeneratedFile[] {
    const projectName = this.sanitizeProjectName(this.config.projectName);
    const files: GeneratedFile[] = [];

    // Next.js config
    files.push({
      path: `${projectName}/next.config.js`,
      content: this.createNextConfig(),
      type: 'file'
    });

    // TypeScript config
    files.push({
      path: `${projectName}/tsconfig.json`,
      content: this.createTsConfig(),
      type: 'file'
    });

    // Tailwind config
    files.push({
      path: `${projectName}/tailwind.config.js`,
      content: this.createTailwindConfig(),
      type: 'file'
    });

    // PostCSS config
    files.push({
      path: `${projectName}/postcss.config.js`,
      content: 'module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}',
      type: 'file'
    });

    // Main app files
    files.push({
      path: `${projectName}/src/pages/_app.tsx`,
      content: this.createAppTsx(),
      type: 'file'
    });

    files.push({
      path: `${projectName}/src/pages/index.tsx`,
      content: this.createIndexPage(),
      type: 'file'
    });

    files.push({
      path: `${projectName}/src/styles/globals.css`,
      content: this.createGlobalsCss(),
      type: 'file'
    });

    return files;
  }

  private createFeatureFiles(): GeneratedFile[] {
    const projectName = this.sanitizeProjectName(this.config.projectName);
    const files: GeneratedFile[] = [];

    if (this.config.features.includes('Authentication')) {
      files.push({
        path: `${projectName}/src/lib/auth.ts`,
        content: this.createAuthConfig(),
        type: 'file'
      });
    }

    if (this.config.features.includes('Database Integration')) {
      files.push({
        path: `${projectName}/src/lib/db.ts`,
        content: this.createDatabaseConfig(),
        type: 'file'
      });
      
      files.push({
        path: `${projectName}/prisma/`,
        content: '',
        type: 'directory'
      });
      
      files.push({
        path: `${projectName}/prisma/schema.prisma`,
        content: this.createPrismaSchema(),
        type: 'file'
      });
    }

    if (this.config.features.includes('Testing Setup')) {
      files.push({
        path: `${projectName}/jest.config.js`,
        content: this.createJestConfig(),
        type: 'file'
      });
      
      files.push({
        path: `${projectName}/jest.setup.js`,
        content: this.createJestSetup(),
        type: 'file'
      });
      
      files.push({
        path: `${projectName}/__tests__/`,
        content: '',
        type: 'directory'
      });
      
      files.push({
        path: `${projectName}/__tests__/index.test.tsx`,
        content: this.createIndexTest(),
        type: 'file'
      });
    }

    if (this.config.features.includes('Email Service')) {
      files.push({
        path: `${projectName}/src/lib/email.ts`,
        content: this.createEmailConfig(),
        type: 'file'
      });
    }

    return files;
  }

  private createDeploymentConfig(): GeneratedFile[] {
    const projectName = this.sanitizeProjectName(this.config.projectName);
    const files: GeneratedFile[] = [];

    if (this.config.deployment === 'vercel') {
      files.push({
        path: `${projectName}/vercel.json`,
        content: this.createVercelConfig(),
        type: 'file'
      });
    }

    if (this.config.features.includes('CI/CD Pipeline')) {
      files.push({
        path: `${projectName}/.github/`,
        content: '',
        type: 'directory'
      });
      
      files.push({
        path: `${projectName}/.github/workflows/`,
        content: '',
        type: 'directory'
      });
      
      files.push({
        path: `${projectName}/.github/workflows/ci.yml`,
        content: this.createGithubAction(),
        type: 'file'
      });
    }

    return files;
  }

  private getDependencies() {
    const dependencies: Record<string, string> = {
      next: "^14.0.0",
      react: "^18.0.0",
      "react-dom": "^18.0.0",
      "framer-motion": "^10.0.0"
    };

    const devDependencies: Record<string, string> = {
      "@types/node": "^20.0.0",
      "@types/react": "^18.0.0",
      "@types/react-dom": "^18.0.0",
      typescript: "^5.0.0",
      tailwindcss: "^3.3.0",
      autoprefixer: "^10.4.0",
      postcss: "^8.4.0",
      eslint: "^8.0.0",
      "eslint-config-next": "^14.0.0"
    };

    // Add feature-specific dependencies
    if (this.config.features.includes('Authentication')) {
      dependencies['next-auth'] = '^4.24.0';
    }

    if (this.config.features.includes('Database Integration')) {
      dependencies['@prisma/client'] = '^5.0.0';
      devDependencies['prisma'] = '^5.0.0';
    }

    if (this.config.features.includes('Testing Setup')) {
      devDependencies['jest'] = '^29.0.0';
      devDependencies['@testing-library/react'] = '^13.0.0';
      devDependencies['@testing-library/jest-dom'] = '^6.0.0';
      devDependencies['jest-environment-jsdom'] = '^29.0.0';
    }

    if (this.config.features.includes('Email Service')) {
      dependencies['@sendgrid/mail'] = '^7.7.0';
    }

    return { dependencies, devDependencies };
  }

  private sanitizeProjectName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  }

  private createReadme(): string {
    return `# ${this.config.projectName}

${this.config.description}

## Features

${this.config.features.map(feature => `- ${feature}`).join('\n')}

## Getting Started

First, install dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is configured for deployment on ${this.config.deployment}.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
`;
  }

  private createGitignore(): string {
    return `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/

# Database
${this.config.features.includes('Database Integration') ? 'prisma/dev.db\nprisma/migrations/' : ''}
`;
  }

  private createEnvExample(): string {
    return `# Environment Variables
# Copy this file to .env.local and fill in the values

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Redis (for caching)
REDIS_URL="redis://localhost:6379"

# File Upload
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="your-app-id"

# Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Monitoring
SENTRY_DSN="https://...@sentry.io/..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
`;
  }

  private createNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  ${this.config.features.includes('SEO Optimization') ? `
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },` : ''}
}

module.exports = nextConfig
`;
  }

  private createTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "es6"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next"
          }
        ],
        paths: {
          "@/*": ["./src/*"]
        }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    }, null, 2);
  }

  private createTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
`;
  }

  private createAppTsx(): string {
    return `import '@/styles/globals.css'
import type { AppProps } from 'next/app'
${this.config.features.includes('Authentication') ? "import { SessionProvider } from 'next-auth/react'" : ''}
${this.config.features.includes('Analytics') ? "import { Analytics } from '@vercel/analytics/react'" : ''}

export default function App({ Component, pageProps }: AppProps) {
  return (
    ${this.config.features.includes('Authentication') ? '<SessionProvider session={pageProps.session}>' : ''}
      <Component {...pageProps} />
      ${this.config.features.includes('Analytics') ? '<Analytics />' : ''}
    ${this.config.features.includes('Authentication') ? '</SessionProvider>' : ''}
  )
}
`;
  }

  private createIndexPage(): string {
    return `import Head from 'next/head'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <>
      <Head>
        <title>${this.config.projectName}</title>
        <meta name="description" content="${this.config.description}" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ${this.config.projectName}
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              ${this.config.description}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </main>
    </>
  )
}
`;
  }

  private createGlobalsCss(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
`;
  }

  private createAuthConfig(): string {
    return `import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
}

export default NextAuth(authOptions)
`;
  }

  private createDatabaseConfig(): string {
    return `import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
`;
  }

  private createPrismaSchema(): string {
    return `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;
  }

  private createJestConfig(): string {
    return `const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
`;
  }

  private createJestSetup(): string {
    return `import '@testing-library/jest-dom/extend-expect'
`;
  }

  private createIndexTest(): string {
    return `import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /welcome to/i,
    })

    expect(heading).toBeInTheDocument()
  })
})
`;
  }

  private createEmailConfig(): string {
    return `import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendEmail(to: string, subject: string, html: string) {
  const msg = {
    to,
    from: process.env.FROM_EMAIL!,
    subject,
    html,
  }

  try {
    await sgMail.send(msg)
    console.log('Email sent successfully')
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
`;
  }

  private createVercelConfig(): string {
    return JSON.stringify({
      "buildCommand": "npm run build",
      "devCommand": "npm run dev",
      "installCommand": "npm install",
      "framework": "nextjs"
    }, null, 2);
  }

  private createGithubAction(): string {
    return `name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
        
    - run: npm ci
    - run: npm run build --if-present
    ${this.config.features.includes('Testing Setup') ? '- run: npm test' : ''}
`;
  }
}

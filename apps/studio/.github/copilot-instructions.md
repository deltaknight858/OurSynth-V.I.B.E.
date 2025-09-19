<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# OurSynth Project Instructions

This is a Next.js TypeScript application with the following configuration:

## Project Structure
- Uses **src/** directory structure
- Implements **App Router** (not Pages Router)
- TypeScript for type safety
- ESLint for code quality
- Turbopack for fast development builds
- **Supabase** for authentication and database

## Import Alias
- Use `@/*` to import from the `src/` directory
- Example: `import Component from '@/components/Component'`

## Development Guidelines
- Follow Next.js 13+ App Router conventions
- Use TypeScript for all new files
- Implement proper type safety
- Use CSS Modules for styling
- Follow React best practices and hooks patterns
- Use `clsx` for conditional CSS classes
- Leverage Supabase client for authentication and data operations

## Key Features
- Server-side rendering (SSR) support
- Static site generation (SSG) when appropriate
- Turbopack for enhanced development performance
- ESLint integration for code quality
- Supabase authentication with Auth UI components
- React Context for auth state management

## Authentication
- Use `AuthProvider` to wrap components that need auth state
- Use `useAuth()` hook to access user session and authentication methods
- Authentication UI components available in `@/components/auth/AuthComponent`
- Supabase client configured in `@/lib/supabase`

When generating code, ensure it follows Next.js App Router patterns and leverages the TypeScript configuration.

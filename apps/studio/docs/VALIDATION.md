# Validation & CI Checks

This document outlines every automated check for the OurSynth Platform project.

## 1. Validate Script

We run a shell script to perform all checks across the monorepo:

```bash
./scripts/validate.sh
```

This script validates:
- TypeScript compilation across all packages and apps
- ESLint rules enforcement
- Unit and integration tests
- Production build verification
- Azure Functions specific validation

## 2. VS Code Tasks

The following tasks are available in VS Code:

### Core Tasks
- **Type Check**: `npm run tsc:noEmit` - TypeScript compilation check without emitting files
- **Lint**: `npm run lint` - ESLint validation across the workspace
- **Test**: `npm test` - Run all test suites
- **Build**: `npm run build` - Build all applications for production

### Azure Functions Tasks
- **Functions Start**: Start the Azure Functions runtime locally
- **Functions Install**: Install Python dependencies for Azure Functions

### Application-Specific Tasks
- **Dashboard Build**: Build the dashboard Next.js app
- **Studio Build**: Build the studio Next.js app
- **Domains Build**: Build the domains Next.js app
- **Deploy Build**: Build the deployment Next.js app
- **Pathways Build**: Build the pathways Next.js app

## 3. Git Hooks

### Pre-commit Hook
- **lint-staged**: Runs linting and formatting on staged files only
- **Type checking**: Validates TypeScript compilation
- **Test affected**: Runs tests for changed files

### Pre-push Hook
- **validate.sh**: Runs the full validation suite before pushing
- **Build verification**: Ensures all apps can build successfully
- **Azure Functions validation**: Validates Python Azure Functions code

## 4. Validation Checks

### TypeScript Validation
- All packages in `packages/` must pass TypeScript compilation
- All apps in `apps/` must pass TypeScript compilation
- No TypeScript errors allowed in production builds

### Linting Rules
- ESLint configuration enforced across all JavaScript/TypeScript files
- Zero warnings policy for production builds
- Custom rules for React components and Next.js applications

### Testing Requirements
- Unit tests must pass for all packages
- Integration tests must pass for all applications
- Smoke tests must pass for the entire platform
- Azure Functions tests must pass

### Build Verification
- All Next.js applications must build successfully
- Azure Functions must package correctly
- Infrastructure as Code (Bicep) must compile
- No build warnings in production mode

### Azure-Specific Checks
- Python requirements validation for Azure Functions
- Azure resource configuration validation
- Bicep template compilation
- Azure deployment readiness checks

## 5. Local Development Setup

To run validation locally:

```bash
# Install dependencies
npm install

# Run full validation
./scripts/validate.sh

# Run specific checks
npm run tsc:noEmit    # Type checking only
npm run lint          # Linting only  
npm test             # Tests only
npm run build        # Build only
```

## 6. CI/CD Integration

The validation script is integrated with:
- GitHub Actions workflows
- Azure DevOps pipelines
- Local git hooks via husky
- VS Code tasks for developer experience

## 7. Troubleshooting

### Common Issues
- **TypeScript errors**: Check `tsconfig.json` files in each package
- **Lint failures**: Run `npm run lint -- --fix` to auto-fix issues
- **Test failures**: Check test output and update snapshots if needed
- **Build failures**: Check Next.js configuration and dependencies

### Azure Functions Issues
- **Python version**: Ensure Python 3.9+ is installed
- **Dependencies**: Check `requirements.txt` in `apps/api/Application`
- **Runtime**: Verify Azure Functions Core Tools are installed

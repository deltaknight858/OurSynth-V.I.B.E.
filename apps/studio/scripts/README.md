# Validation Scripts

This folder contains scripts for validating the OurSynth Platform project.

## Scripts

### Full Validation
- **`validate.sh`** (Linux/macOS) - Complete validation including installation, type checking, linting, testing, building, and infrastructure validation
- **`validate.bat`** (Windows) - Same as above for Windows

### Quick Validation  
- **`validate-quick.sh`** (Linux/macOS) - Fast validation without installation or build steps
- **`validate-quick.bat`** (Windows) - Same as above for Windows

## Usage

### From npm scripts:
```bash
npm run validate        # Full validation
npm run validate:quick  # Quick validation
```

### From VS Code:
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
- Type "Tasks: Run Task"  
- Select "validate" or "validate:quick"

### Direct execution:
```bash
# Windows
scripts\validate.bat
scripts\validate-quick.bat

# Linux/macOS
bash scripts/validate.sh
bash scripts/validate-quick.sh
```

## What Gets Validated

### Full Validation (`validate`)
1. **Dependencies** - Installs npm packages
2. **TypeScript** - Compiles all TypeScript files
3. **ESLint** - Lints all JavaScript/TypeScript files
4. **Tests** - Runs all Jest tests
5. **Azure Functions** - Validates Python code and dependencies
6. **Build** - Builds all Next.js applications
7. **Infrastructure** - Validates Bicep templates

### Quick Validation (`validate:quick`)
1. **TypeScript** - Compiles all TypeScript files
2. **ESLint** - Lints all JavaScript/TypeScript files  
3. **Tests** - Runs all Jest tests

Use quick validation during development for faster feedback loops, and full validation before commits or deployments.

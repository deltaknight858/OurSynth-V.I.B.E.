#!/bin/bash
echo "Cleaning OurSynth Platform caches and temporary files..."

# Clear Node.js and Next.js caches
echo "Clearing Node.js and Next.js caches..."
find . -name "node_modules/.cache" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "build" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "coverage" -type d -exec rm -rf {} + 2>/dev/null || true

# Clear TypeScript cache files
echo "Clearing TypeScript build cache..."
find . -name "tsconfig.tsbuildinfo" -type f -delete 2>/dev/null || true

# Clear ESLint cache files
echo "Clearing ESLint cache..."
find . -name ".eslintcache" -type f -delete 2>/dev/null || true

# Clear debug logs
echo "Clearing debug logs..."
find . -name "debug.log" -type f -delete 2>/dev/null || true

echo "Cache cleanup completed!"
echo ""
echo "Run 'npm install' to reinstall dependencies if needed."

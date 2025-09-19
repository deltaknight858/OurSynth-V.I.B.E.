#!/usr/bin/env bash
set -eo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting OurSynth Platform Simple Validation${NC}"
echo "=================================================="

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}$1${NC}"
    echo "----------------------------------------"
}

# Function to handle errors
handle_error() {
    echo -e "${RED}❌ Validation failed at: $1${NC}"
    exit 1
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "azure.yaml" ]; then
    echo -e "${RED}❌ Please run this script from the project root${NC}"
    exit 1
fi

print_section "🔗 1/4 Checking Dependency Tree (strict)"
npm install --dry-run --no-audit || handle_error "Dependency health check"

print_section "⚙️ 2/4 Type-checking individual apps"
# Check TypeScript in each Next.js app individually
echo "Type-checking studio app..."
(cd apps/studio && npx tsc --noEmit) || handle_error "TypeScript compilation in studio"

echo "Type-checking pathways app..."
(cd apps/pathways && npx tsc --noEmit) || handle_error "TypeScript compilation in pathways"

echo "Type-checking domains app..."
(cd apps/domains && npx tsc --noEmit) || handle_error "TypeScript compilation in domains"

echo "Type-checking deploy app..."
(cd apps/deploy && npx tsc --noEmit) || handle_error "TypeScript compilation in deploy"

print_section "🔍 3/4 Basic lint check"
echo "Linting studio app..."
(cd apps/studio && npm run lint) || handle_error "Linting in studio"

print_section "🧪 4/4 Running tests"
npm test -- --ci --passWithNoTests || handle_error "Test execution"

print_section "📊 Simple Validation Summary"
echo -e "${GREEN}✨ All simple checks passed!${NC}"
echo ""
echo "Completed validations:"
echo "  ✅ Dependency health check"
echo "  ✅ TypeScript compilation (individual apps)"
echo "  ✅ Basic linting"
echo "  ✅ Test execution"
echo ""
echo -e "${GREEN}🎉 OurSynth Platform basic validation complete!${NC}"
echo -e "${YELLOW}Note: This bypasses Turbo to avoid workspace parsing issues${NC}"

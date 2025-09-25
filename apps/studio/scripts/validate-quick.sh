#!/usr/bin/env bash
set -eo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting OurSynth Platform Quick Validation${NC}"
echo "=================================================="

# Function to print section headers
print_section() {
    echo ""
    echo -e "${BLUE}$1${NC}"
    echo "----------------------------------------"
}

# Function to handle errors
handle_error() {
    echo -e "${RED}❌ Quick validation failed at: $1${NC}"
    exit 1
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "azure.yaml" ]; then
    echo -e "${RED}❌ Please run this script from the project root${NC}"
    exit 1
fi

print_section "📝 Type-checking All Packages"
npm run tsc:noEmit || handle_error "TypeScript compilation"

print_section "🔍 3/6 Linting with ESLint"
npm run lint || handle_error "ESLint validation"

print_section "🧪 Running Tests"
npm test -- --ci --passWithNoTests || handle_error "Test execution"

print_section "📊 Quick Validation Summary"
echo -e "${GREEN}✨ Quick checks passed!${NC}"
echo ""
echo "Completed validations:"
echo "  ✅ TypeScript compilation"
echo "  ✅ ESLint validation"
echo "  ✅ Test execution"
echo ""
echo -e "${GREEN}🎉 OurSynth Platform passed quick validation!${NC}"

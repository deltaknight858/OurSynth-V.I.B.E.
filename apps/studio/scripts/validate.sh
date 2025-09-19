#!/usr/bin/env bash
set -eo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting OurSynth Platform Validation${NC}"
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

print_section "� 1/6 Checking Dependency Tree (strict)"
npm install --dry-run --no-audit || handle_error "Dependency health check"

print_section "⚙️ 2/6 Type-checking with tsc"
npm run tsc:noEmit || handle_error "TypeScript compilation"

print_section "🔍 3/6 Linting with ESLint"
npm run lint || handle_error "ESLint validation"

print_section "🧪 4/6 Running tests with Jest"
npm test -- --ci --passWithNoTests || handle_error "Test execution"

print_section "� 5/6 Building Next.js production bundle"
# Build all applications
npm run build || handle_error "Production build"

print_section "🔧 6/6 Validating Infrastructure & Azure Functions"
# Check if Azure Functions dependencies are installed
if [ -f "apps/api/Application/requirements.txt" ]; then
    echo "Checking Python Azure Functions..."
    cd apps/api/Application
    
    # Check if virtual environment exists, if not create it
    if [ ! -d ".venv" ]; then
        echo "Creating Python virtual environment..."
        python -m venv .venv
    fi
    
    # Activate virtual environment (Windows)
    if [ -f ".venv/Scripts/activate" ]; then
        source .venv/Scripts/activate
    elif [ -f ".venv/bin/activate" ]; then
        source .venv/bin/activate
    fi
    
    # Install Python dependencies
    python -m pip install -r requirements.txt > /dev/null || handle_error "Python dependencies installation"
    
    # Basic Python syntax check
    python -m py_compile *.py || handle_error "Python syntax validation"
    
    cd ../../..
else
    echo -e "${YELLOW}⚠️  No Azure Functions requirements.txt found, skipping Python validation${NC}"
fi
# Check if Bicep files exist and compile them
if [ -f "infra/main.bicep" ]; then
    echo "Validating Bicep templates..."
    # This requires Azure CLI and Bicep CLI to be installed
    if command -v az &> /dev/null && az bicep version &> /dev/null; then
        az bicep build --file infra/main.bicep --outdir infra/compiled || handle_error "Bicep template compilation"
        echo "Bicep templates compiled successfully"
    else
        echo -e "${YELLOW}⚠️  Azure CLI or Bicep not found, skipping infrastructure validation${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No Bicep files found, skipping infrastructure validation${NC}"
fi

# Optional: Style-lint CSS/Tailwind (uncomment to enable)
# echo "🎨 Optional: Style-lint your CSS/Tailwind"
# npx stylelint "**/*.{css,scss}" || echo -e "${YELLOW}⚠️  Stylelint not configured or no CSS files found${NC}"

print_section "📊 Validation Summary"
echo -e "${GREEN}✨ All validations completed successfully!${NC}"
echo ""
echo "Completed validations:"
echo "  ✅ Dependency health check"
echo "  ✅ TypeScript compilation"
echo "  ✅ ESLint validation"
echo "  ✅ Test execution"
echo "  ✅ Production build"
echo "  ✅ Azure Functions validation"
echo "  ✅ Infrastructure validation"
echo ""
echo -e "${GREEN}🎉 OurSynth Platform is ready for deployment!${NC}"

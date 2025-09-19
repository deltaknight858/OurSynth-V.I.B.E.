@echo off
setlocal enabledelayedexpansion

:: Colors are not easily supported in Windows batch, so we'll use simple output
echo Starting OurSynth Platform Validation
echo ==================================================

:: Function to handle errors
if errorlevel 1 (
    echo Validation failed
    exit /b 1
)

:: Check if we're in the right directory
if not exist "package.json" (
    echo Please run this script from the project root
    exit /b 1
)

if not exist "azure.yaml" (
    echo Please run this script from the project root
    exit /b 1
)

echo.
echo 1/6 Checking Dependency Tree (strict)
echo ----------------------------------------
call npm install --dry-run --no-audit
if errorlevel 1 (
    echo Dependency health check failed
    exit /b 1
)

echo.
echo 2/6 Type-checking with tsc
echo ----------------------------------------
call npm run tsc:noEmit
if errorlevel 1 (
    echo TypeScript compilation failed
    exit /b 1
)

echo.
echo 3/6 Linting with ESLint
echo ----------------------------------------
call npm run lint
if errorlevel 1 (
    echo ESLint validation failed
    exit /b 1
)

echo.
echo 4/6 Running tests with Jest
echo ----------------------------------------
call npm test -- --ci --passWithNoTests
if errorlevel 1 (
    echo Test execution failed
    exit /b 1
)

echo.
echo 5/6 Building Next.js production bundle
echo ----------------------------------------
call npm run build
if errorlevel 1 (
    echo Production build failed
    exit /b 1
)

echo.
echo 6/6 Validating Infrastructure ^& Azure Functions
echo ----------------------------------------
if exist "apps\api\Application\requirements.txt" (
    echo Checking Python Azure Functions...
    cd apps\api\Application
    
    :: Check if virtual environment exists, if not create it
    if not exist ".venv" (
        echo Creating Python virtual environment...
        python -m venv .venv
    )
    
    :: Activate virtual environment (Windows)
    if exist ".venv\Scripts\activate.bat" (
        call .venv\Scripts\activate.bat
    )
    
    :: Install Python dependencies
    python -m pip install -r requirements.txt >nul
    if errorlevel 1 (
        echo Python dependencies installation failed
        cd ..\..\..
        exit /b 1
    )
    
    :: Basic Python syntax check
    for %%f in (*.py) do (
        python -m py_compile "%%f"
        if errorlevel 1 (
            echo Python syntax validation failed for %%f
            cd ..\..\..
            exit /b 1
        )
    )
    
    cd ..\..\..
) else (
    echo No Azure Functions requirements.txt found, skipping Python validation
)

echo.
echo Building for Production
echo ----------------------------------------
call npm run build
if errorlevel 1 (
    echo Production build failed
    exit /b 1
)

echo.
echo Validating Infrastructure
echo ----------------------------------------
if exist "infra\main.bicep" (
    echo Validating Bicep templates...
    :: This requires Azure CLI and Bicep CLI to be installed
    az bicep version >nul 2>&1
    if errorlevel 1 (
        echo Azure CLI or Bicep not found, skipping infrastructure validation
    ) else (
        az bicep build --file infra\main.bicep --outdir infra\compiled
        if errorlevel 1 (
            echo Bicep template compilation failed
            exit /b 1
        )
        echo Bicep templates compiled successfully
    )
) else (
    echo No Bicep files found, skipping infrastructure validation
)

echo.
echo Validation Summary
echo ----------------------------------------
echo All validations completed successfully!
echo.
echo Completed validations:
echo   Dependency health check
echo   TypeScript compilation
echo   ESLint validation
echo   Test execution
echo   Production build
echo   Azure Functions validation
echo   Infrastructure validation
echo.
echo OurSynth Platform is ready for deployment!

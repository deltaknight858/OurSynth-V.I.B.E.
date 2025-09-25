@echo off
setlocal enabledelayedexpansion

echo Starting OurSynth Platform Simple Validation
echo ==================================================

echo.
echo 1/4 Checking Dependency Tree (strict)
echo ----------------------------------------
call npm install --dry-run --no-audit
if errorlevel 1 (
    echo Dependency health check failed
    exit /b 1
)

echo.
echo 2/4 Type-checking individual apps
echo ----------------------------------------
echo Type-checking studio app...
cd apps\studio
call npx tsc --noEmit
if errorlevel 1 (
    echo TypeScript compilation failed in studio
    cd ..\..
    exit /b 1
)
cd ..\..

echo Type-checking pathways app...
cd apps\pathways
call npx tsc --noEmit
if errorlevel 1 (
    echo TypeScript compilation failed in pathways
    cd ..\..
    exit /b 1
)
cd ..\..

echo Type-checking domains app...
cd apps\domains
call npx tsc --noEmit
if errorlevel 1 (
    echo TypeScript compilation failed in domains
    cd ..\..
    exit /b 1
)
cd ..\..

echo Type-checking deploy app...
cd apps\deploy
call npx tsc --noEmit
if errorlevel 1 (
    echo TypeScript compilation failed in deploy
    cd ..\..
    exit /b 1
)
cd ..\..

echo.
echo 3/4 Basic lint check
echo ----------------------------------------
echo Linting studio app...
cd apps\studio
call npm run lint
if errorlevel 1 (
    echo Linting failed in studio
    cd ..\..
    exit /b 1
)
cd ..\..

echo.
echo 4/4 Running tests
echo ----------------------------------------
call npm test -- --ci --passWithNoTests
if errorlevel 1 (
    echo Test execution failed
    exit /b 1
)

echo.
echo Simple Validation Summary
echo ----------------------------------------
echo All simple checks passed!
echo.
echo Completed validations:
echo   Dependency health check
echo   TypeScript compilation (individual apps)
echo   Basic linting
echo   Test execution
echo.
echo OurSynth Platform basic validation complete!
echo Note: This bypasses Turbo to avoid workspace parsing issues

@echo off
setlocal enabledelayedexpansion

echo Starting OurSynth Platform Quick Validation
echo ==================================================

echo.
echo Type-checking All Packages
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
echo Running Tests
echo ----------------------------------------
call npm test -- --ci --passWithNoTests
if errorlevel 1 (
    echo Test execution failed
    exit /b 1
)

echo.
echo Quick Validation Summary
echo ----------------------------------------
echo Quick checks passed!
echo.
echo Completed validations:
echo   TypeScript compilation
echo   ESLint validation
echo   Test execution
echo.
echo OurSynth Platform passed quick validation!

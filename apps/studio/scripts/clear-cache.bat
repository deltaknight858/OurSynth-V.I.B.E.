@echo off
echo Cleaning OurSynth Platform caches and temporary files...

rem Clear Node.js and Next.js caches
echo Clearing Node.js and Next.js caches...
for /d /r . %%d in (node_modules\.cache) do @if exist "%%d" rd /s /q "%%d" 2>nul
for /d /r . %%d in (.next) do @if exist "%%d" rd /s /q "%%d" 2>nul
for /d /r . %%d in (.turbo) do @if exist "%%d" rd /s /q "%%d" 2>nul
for /d /r . %%d in (dist) do @if exist "%%d" rd /s /q "%%d" 2>nul
for /d /r . %%d in (build) do @if exist "%%d" rd /s /q "%%d" 2>nul
for /d /r . %%d in (coverage) do @if exist "%%d" rd /s /q "%%d" 2>nul

rem Clear TypeScript cache files
echo Clearing TypeScript build cache...
for /r . %%f in (tsconfig.tsbuildinfo) do @if exist "%%f" del /q "%%f" 2>nul

rem Clear ESLint cache files
echo Clearing ESLint cache...
for /r . %%f in (.eslintcache) do @if exist "%%f" del /q "%%f" 2>nul

rem Clear debug logs
echo Clearing debug logs...
for /r . %%f in (debug.log) do @if exist "%%f" del /q "%%f" 2>nul

echo Cache cleanup completed!
echo.
echo Run 'npm install' to reinstall dependencies if needed.
pause

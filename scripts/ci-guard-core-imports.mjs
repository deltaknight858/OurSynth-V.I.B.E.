#!/usr/bin/env node
/**
 * ci-guard-core-imports.mjs
 * CI guard for @oursynth/core import usage.
 * Ensures proper import patterns and detects unauthorized usage.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SCAN_DIRS = [
  path.join(ROOT, 'components'),
  path.join(ROOT, 'pages'), 
  path.join(ROOT, 'state'),
  path.join(ROOT, 'lib'),
  path.join(ROOT, 'packages')
];

function walk(dir, acc = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      walk(full, acc);
    } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function checkCoreImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Look for @oursynth/core imports
  const importMatches = content.matchAll(/import\s+.*?from\s+['"](@oursynth\/core(?:\/[^'"]*)?)['"]/g);
  
  for (const match of importMatches) {
    const importPath = match[1];
    const line = content.substring(0, match.index).split('\n').length;
    
    // Check for specific violations
    if (importPath === '@oursynth/core' && !isAllowedDirectImport(filePath)) {
      issues.push({
        type: 'direct-import',
        line,
        message: 'Direct import from @oursynth/core root is discouraged. Use specific subpaths.',
        import: importPath
      });
    }
    
    // Check for deprecated paths
    if (importPath.includes('/deprecated/') || importPath.includes('/legacy/')) {
      issues.push({
        type: 'deprecated-import',
        line,
        message: 'Import from deprecated path is not allowed.',
        import: importPath
      });
    }
    
    // Check for internal paths that shouldn't be imported externally
    if (importPath.includes('/internal/') && !isInternalModule(filePath)) {
      issues.push({
        type: 'internal-import',
        line,
        message: 'Import from internal path is not allowed outside core modules.',
        import: importPath
      });
    }
  }
  
  return issues;
}

function isAllowedDirectImport(filePath) {
  // Allow direct imports in specific contexts
  const relativePath = path.relative(ROOT, filePath);
  return (
    relativePath.startsWith('packages/') ||
    relativePath.includes('index.') ||
    relativePath.includes('main.')
  );
}

function isInternalModule(filePath) {
  const relativePath = path.relative(ROOT, filePath);
  return relativePath.startsWith('packages/') || relativePath.startsWith('lib/core/');
}

function checkAllCoreImports() {
  console.log('🔍 Checking @oursynth/core import usage...');
  
  const allIssues = [];
  let filesScanned = 0;
  
  for (const scanDir of SCAN_DIRS) {
    if (!fs.existsSync(scanDir)) continue;
    
    const files = walk(scanDir);
    for (const file of files) {
      filesScanned++;
      const issues = checkCoreImports(file);
      if (issues.length > 0) {
        allIssues.push({
          file: path.relative(ROOT, file),
          issues
        });
      }
    }
  }
  
  if (allIssues.length > 0) {
    console.log('❌ @oursynth/core import violations found:');
    
    allIssues.forEach(({ file, issues }) => {
      console.log(`\n📄 ${file}:`);
      issues.forEach(issue => {
        console.log(`  Line ${issue.line}: ${issue.message}`);
        console.log(`    Import: ${issue.import}`);
        
        if (issue.type === 'direct-import') {
          console.log(`    Fix: Use '@oursynth/core/components' or specific subpath`);
        } else if (issue.type === 'deprecated-import') {
          console.log(`    Fix: Update to use current API`);
        } else if (issue.type === 'internal-import') {
          console.log(`    Fix: Use public API instead of internal paths`);
        }
      });
    });
    
    console.log(`\nTotal violations: ${allIssues.reduce((sum, f) => sum + f.issues.length, 0)}`);
    console.log('Please fix these import violations before proceeding.');
    process.exit(1);
  }
  
  console.log(`✅ @oursynth/core imports are compliant (scanned ${filesScanned} files)`);
}

checkAllCoreImports();
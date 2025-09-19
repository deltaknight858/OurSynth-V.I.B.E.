#!/usr/bin/env node
/**
 * ci-guard-deprecated-assets.mjs
 * CI guard for deprecated asset usage.
 * Detects usage of deprecated assets, especially from import-staging directory.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const STAGING_DIR = path.join(ROOT, 'import-staging');
const SCAN_DIRS = [
  path.join(ROOT, 'components'),
  path.join(ROOT, 'pages'),
  path.join(ROOT, 'state'),
  path.join(ROOT, 'lib'),
  path.join(ROOT, 'packages')
];

// Common deprecated asset patterns
const DEPRECATED_PATTERNS = [
  /import-staging/g,
  /@legacy\//g,
  /\/deprecated\//g,
  /\.legacy\./g,
  /old-/g,
  /_deprecated/g,
  /\.backup\./g
];

// Deprecated color codes (from existing eslint rules)
const DEPRECATED_COLORS = [
  /#FF00F5/gi,
  /#ff00c8/gi, 
  /#FF00FF/gi,
  /#FF2DA8/gi
];

function walk(dir, acc = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      walk(full, acc);
    } else if (/\.(ts|tsx|js|jsx|css|scss|md)$/.test(e.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function checkDeprecatedAssets(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Check for deprecated import paths
    DEPRECATED_PATTERNS.forEach(pattern => {
      const matches = [...line.matchAll(pattern)];
      matches.forEach(match => {
        issues.push({
          type: 'deprecated-path',
          line: lineNum,
          message: `Deprecated asset path detected: ${match[0]}`,
          content: line.trim()
        });
      });
    });
    
    // Check for deprecated colors
    DEPRECATED_COLORS.forEach(pattern => {
      const matches = [...line.matchAll(pattern)];
      matches.forEach(match => {
        issues.push({
          type: 'deprecated-color',
          line: lineNum,
          message: `Deprecated color code detected: ${match[0]}`,
          content: line.trim(),
          fix: 'Use design tokens like var(--neonPurple) instead'
        });
      });
    });
    
    // Check for specific deprecated asset references
    if (line.includes('import-staging') && (line.includes('import') || line.includes('require'))) {
      issues.push({
        type: 'staging-import',
        line: lineNum,
        message: 'Import from staging directory detected',
        content: line.trim(),
        fix: 'Promote assets to canonical locations before importing'
      });
    }
    
    // Check for deprecated file references
    const deprecatedFiles = [
      'old-logo',
      'legacy-icon',
      'deprecated-',
      '.backup.',
      '-old.',
      'temp-'
    ];
    
    deprecatedFiles.forEach(deprecatedFile => {
      if (line.toLowerCase().includes(deprecatedFile)) {
        issues.push({
          type: 'deprecated-file',
          line: lineNum,
          message: `Reference to deprecated file pattern: ${deprecatedFile}`,
          content: line.trim()
        });
      }
    });
  });
  
  return issues;
}

function checkAllDeprecatedAssets() {
  console.log('🔍 Checking for deprecated asset usage...');
  
  const allIssues = [];
  let filesScanned = 0;
  
  for (const scanDir of SCAN_DIRS) {
    if (!fs.existsSync(scanDir)) continue;
    
    const files = walk(scanDir);
    for (const file of files) {
      filesScanned++;
      const issues = checkDeprecatedAssets(file);
      if (issues.length > 0) {
        allIssues.push({
          file: path.relative(ROOT, file),
          issues
        });
      }
    }
  }
  
  if (allIssues.length > 0) {
    console.log('❌ Deprecated asset usage found:');
    
    let totalIssues = 0;
    allIssues.forEach(({ file, issues }) => {
      console.log(`\n📄 ${file}:`);
      issues.forEach(issue => {
        totalIssues++;
        console.log(`  Line ${issue.line}: ${issue.message}`);
        console.log(`    Code: ${issue.content}`);
        if (issue.fix) {
          console.log(`    Fix: ${issue.fix}`);
        }
      });
    });
    
    console.log(`\nTotal deprecated asset violations: ${totalIssues}`);
    console.log('\nRecommendations:');
    console.log('• Move assets from import-staging to canonical locations');
    console.log('• Update color codes to use design tokens');
    console.log('• Remove references to deprecated/backup files');
    console.log('• Use the promote scripts to properly migrate assets');
    
    process.exit(1);
  }
  
  console.log(`✅ No deprecated asset usage found (scanned ${filesScanned} files)`);
}

checkAllDeprecatedAssets();
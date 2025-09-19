#!/usr/bin/env node
/**
 * ci-guard-token-violations.mjs
 * CI guard for token usage violations.
 * Detects improper token usage and enforces token system compliance.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SCAN_DIRS = [
  path.join(ROOT, 'components'),
  path.join(ROOT, 'pages'),
  path.join(ROOT, 'styles'),
  path.join(ROOT, 'packages')
];

// Token violation patterns
const HARDCODED_VALUES = {
  colors: [
    /#[0-9a-f]{3,8}/gi,  // Hex colors
    /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/gi, // RGB
    /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/gi, // RGBA
    /hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)/gi, // HSL
  ],
  sizes: [
    /\b\d+px\b/g,        // Pixel values
    /\b\d+rem\b/g,       // REM values
    /\b\d+em\b/g,        // EM values
    /\b\d+vh\b/g,        // Viewport height
    /\b\d+vw\b/g,        // Viewport width
  ],
  spacing: [
    /margin:\s*\d+/g,
    /padding:\s*\d+/g,
    /gap:\s*\d+/g,
  ]
};

// Allowed contexts where hardcoded values are acceptable
const ALLOWED_CONTEXTS = [
  'test',
  'spec',
  'story',
  'stories',
  'demo',
  'example',
  'docs'
];

function walk(dir, acc = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      walk(full, acc);
    } else if (/\.(ts|tsx|js|jsx|css|scss)$/.test(e.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function isAllowedContext(filePath) {
  const relativePath = path.relative(ROOT, filePath).toLowerCase();
  return ALLOWED_CONTEXTS.some(context => relativePath.includes(context));
}

function checkTokenViolations(filePath) {
  if (isAllowedContext(filePath)) {
    return []; // Skip files in allowed contexts
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Skip comments and imports
    if (trimmedLine.startsWith('//') || 
        trimmedLine.startsWith('/*') || 
        trimmedLine.startsWith('*') ||
        trimmedLine.startsWith('import') ||
        trimmedLine.startsWith('@import')) {
      return;
    }
    
    // Check for hardcoded color values
    HARDCODED_VALUES.colors.forEach(pattern => {
      const matches = [...line.matchAll(pattern)];
      matches.forEach(match => {
        // Skip if already using a CSS variable
        if (!line.includes('var(--') || line.indexOf(match[0]) < line.indexOf('var(--')) {
          issues.push({
            type: 'hardcoded-color',
            line: lineNum,
            message: `Hardcoded color value: ${match[0]}`,
            content: trimmedLine,
            fix: 'Use CSS custom properties like var(--colorName) or design tokens'
          });
        }
      });
    });
    
    // Check for hardcoded size values (with some exceptions)
    if (!line.includes('border-width') && !line.includes('stroke-width')) {
      HARDCODED_VALUES.sizes.forEach(pattern => {
        const matches = [...line.matchAll(pattern)];
        matches.forEach(match => {
          const value = match[0];
          // Allow common acceptable values
          if (!['0px', '1px', '2px', '100%', '0rem', '1rem'].includes(value)) {
            issues.push({
              type: 'hardcoded-size',
              line: lineNum,
              message: `Hardcoded size value: ${value}`,
              content: trimmedLine,
              fix: 'Use design tokens like var(--spacingMd) or responsive units'
            });
          }
        });
      });
    }
    
    // Check for missing var() usage when tokens should be used
    if (line.includes('color:') && !line.includes('var(--') && !line.includes('transparent') && !line.includes('inherit')) {
      const colorMatch = line.match(/color:\s*([^;,\s]+)/);
      if (colorMatch && !['currentColor', 'inherit', 'transparent'].includes(colorMatch[1])) {
        issues.push({
          type: 'missing-token',
          line: lineNum,
          message: 'Color property should use design tokens',
          content: trimmedLine,
          fix: 'Use var(--colorTokenName) instead of hardcoded values'
        });
      }
    }
    
    // Check for improper token naming
    const tokenMatches = [...line.matchAll(/var\(--([^)]+)\)/g)];
    tokenMatches.forEach(match => {
      const tokenName = match[1];
      
      // Check for non-standard token naming
      if (!/^[a-z][a-zA-Z0-9]*$/.test(tokenName)) {
        issues.push({
          type: 'invalid-token-name',
          line: lineNum,
          message: `Invalid token naming: --${tokenName}`,
          content: trimmedLine,
          fix: 'Use camelCase naming like --primaryColor, --spacingLg'
        });
      }
      
      // Check for deprecated token names
      const deprecatedTokens = ['old', 'legacy', 'temp', 'deprecated'];
      if (deprecatedTokens.some(dep => tokenName.toLowerCase().includes(dep))) {
        issues.push({
          type: 'deprecated-token',
          line: lineNum,
          message: `Deprecated token detected: --${tokenName}`,
          content: trimmedLine,
          fix: 'Update to use current design tokens'
        });
      }
    });
  });
  
  return issues;
}

function checkAllTokenViolations() {
  console.log('🔍 Checking for token usage violations...');
  
  const allIssues = [];
  let filesScanned = 0;
  let filesSkipped = 0;
  
  for (const scanDir of SCAN_DIRS) {
    if (!fs.existsSync(scanDir)) continue;
    
    const files = walk(scanDir);
    for (const file of files) {
      if (isAllowedContext(file)) {
        filesSkipped++;
        continue;
      }
      
      filesScanned++;
      const issues = checkTokenViolations(file);
      if (issues.length > 0) {
        allIssues.push({
          file: path.relative(ROOT, file),
          issues
        });
      }
    }
  }
  
  if (allIssues.length > 0) {
    console.log('❌ Token usage violations found:');
    
    const violationCounts = {
      'hardcoded-color': 0,
      'hardcoded-size': 0,
      'missing-token': 0,
      'invalid-token-name': 0,
      'deprecated-token': 0
    };
    
    allIssues.forEach(({ file, issues }) => {
      console.log(`\n📄 ${file}:`);
      issues.forEach(issue => {
        violationCounts[issue.type]++;
        console.log(`  Line ${issue.line}: ${issue.message}`);
        console.log(`    Code: ${issue.content}`);
        console.log(`    Fix: ${issue.fix}`);
      });
    });
    
    console.log('\nViolation Summary:');
    Object.entries(violationCounts).forEach(([type, count]) => {
      if (count > 0) {
        console.log(`  ${type}: ${count} violations`);
      }
    });
    
    console.log(`\nTotal files with violations: ${allIssues.length}`);
    console.log(`Scanned: ${filesScanned} files, Skipped: ${filesSkipped} files`);
    console.log('\nTo fix: Use design tokens consistently throughout the codebase');
    
    process.exit(1);
  }
  
  console.log(`✅ No token usage violations found (scanned ${filesScanned} files, skipped ${filesSkipped} test/doc files)`);
}

checkAllTokenViolations();
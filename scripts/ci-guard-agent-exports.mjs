#!/usr/bin/env node
/**
 * ci-guard-agent-exports.mjs
 * CI guard for agent-runtime export surface.
 * Ensures agent runtime export surface remains stable for dependent code.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const AGENT_DIR = path.join(ROOT, 'state', 'agent');
const EXPORT_SNAPSHOT = path.join(ROOT, 'docs', 'generated', 'agent-exports.json');

function extractExports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const exports = [];
  
  // Match export declarations
  const exportPatterns = [
    /export\s+(?:interface|type|class|function|const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    /export\s*{\s*([^}]+)\s*}/g,
    /export\s+default\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g
  ];
  
  exportPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (pattern.source.includes('{')) {
        // Handle export { a, b, c } syntax
        const namedExports = match[1].split(',').map(e => e.trim().split(' as ')[0].trim());
        exports.push(...namedExports);
      } else {
        exports.push(match[1]);
      }
    }
  });
  
  return [...new Set(exports)].sort();
}

function scanAgentExports() {
  const exports = {};
  
  if (!fs.existsSync(AGENT_DIR)) {
    console.log('⚠️ Agent directory not found:', AGENT_DIR);
    return exports;
  }
  
  const files = fs.readdirSync(AGENT_DIR).filter(f => /\.(ts|tsx)$/.test(f));
  
  for (const file of files) {
    const filePath = path.join(AGENT_DIR, file);
    const fileExports = extractExports(filePath);
    if (fileExports.length > 0) {
      exports[file] = fileExports;
    }
  }
  
  return exports;
}

function checkAgentExportSurface() {
  console.log('🔍 Checking agent-runtime export surface...');
  
  const currentExports = scanAgentExports();
  const exportCount = Object.values(currentExports).flat().length;
  
  // Create snapshot if it doesn't exist
  if (!fs.existsSync(EXPORT_SNAPSHOT)) {
    fs.mkdirSync(path.dirname(EXPORT_SNAPSHOT), { recursive: true });
    fs.writeFileSync(EXPORT_SNAPSHOT, JSON.stringify({
      generated: new Date().toISOString(),
      exports: currentExports
    }, null, 2));
    console.log(`📝 Created initial agent export surface snapshot with ${exportCount} exports`);
    return;
  }
  
  // Compare with existing snapshot
  const snapshot = JSON.parse(fs.readFileSync(EXPORT_SNAPSHOT, 'utf8'));
  const previousExports = snapshot.exports || {};
  
  const changes = {
    added: [],
    removed: [],
    modified: []
  };
  
  // Check for changes
  for (const [file, exports] of Object.entries(currentExports)) {
    if (!previousExports[file]) {
      changes.added.push({ file, exports });
    } else {
      const prev = previousExports[file];
      const added = exports.filter(e => !prev.includes(e));
      const removed = prev.filter(e => !exports.includes(e));
      
      if (added.length > 0 || removed.length > 0) {
        changes.modified.push({ file, added, removed });
      }
    }
  }
  
  // Check for removed files
  for (const [file, exports] of Object.entries(previousExports)) {
    if (!currentExports[file]) {
      changes.removed.push({ file, exports });
    }
  }
  
  // Report changes
  if (changes.added.length || changes.removed.length || changes.modified.length) {
    console.log('❌ Agent export surface has changed!');
    
    if (changes.added.length) {
      console.log('\nNew files with exports:');
      changes.added.forEach(({ file, exports }) => {
        console.log(`  + ${file}: ${exports.join(', ')}`);
      });
    }
    
    if (changes.removed.length) {
      console.log('\nRemoved files:');
      changes.removed.forEach(({ file, exports }) => {
        console.log(`  - ${file}: ${exports.join(', ')}`);
      });
    }
    
    if (changes.modified.length) {
      console.log('\nModified exports:');
      changes.modified.forEach(({ file, added, removed }) => {
        console.log(`  ~ ${file}:`);
        added.forEach(e => console.log(`    + ${e}`));
        removed.forEach(e => console.log(`    - ${e}`));
      });
    }
    
    console.log('\nIf these changes are intentional, update the snapshot by running:');
    console.log('npm run ci:update-agent-exports');
    process.exit(1);
  }
  
  console.log(`✅ Agent export surface is stable (${exportCount} exports across ${Object.keys(currentExports).length} files)`);
}

// Allow updating snapshot with --update flag
if (process.argv.includes('--update')) {
  const currentExports = scanAgentExports();
  fs.mkdirSync(path.dirname(EXPORT_SNAPSHOT), { recursive: true });
  fs.writeFileSync(EXPORT_SNAPSHOT, JSON.stringify({
    generated: new Date().toISOString(),
    exports: currentExports
  }, null, 2));
  console.log('📝 Updated agent export surface snapshot');
} else {
  checkAgentExportSurface();
}
// scripts/cleanup_workspace.js
// Scans for Storybook stories and files/folders matching keywords, moves them to import-staging, and prints a summary.
// Usage: node scripts/cleanup_workspace.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STAGING = path.resolve(ROOT, 'import-staging');

const STORYBOOK_PATTERNS = [/\.stories\.(js|jsx|ts|tsx)$/i];
const EXCLUDE_DIRS = ['node_modules', '.git', 'import-staging', 'dist', 'build'];
const KEYWORDS = [
  'components', 'python', 'studio', 'analyzer', 'orchestrator', 'capsule', 'time', 'travel', 'provenance',
  'brand', 'branding', 'agents', 'OAI', 'Pathways', 'Wizard', 'tools', 'preview', 'panel', 'domain',
  'deploy', 'connect', 'vibe', 'prompt', 'ai', 'openai', 'vertex'
];

function isStorybookFile(filename) {
  return STORYBOOK_PATTERNS.some((re) => re.test(filename));
}

function matchesKeyword(name) {
  return KEYWORDS.some((kw) => name.toLowerCase().includes(kw.toLowerCase()));
}

function scanDir(dir, found = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDE_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (matchesKeyword(entry.name)) {
        found.push(fullPath);
        continue;
      }
      scanDir(fullPath, found);
    } else {
      if (isStorybookFile(entry.name) || matchesKeyword(entry.name)) {
        found.push(fullPath);
      }
    }
  }
  return found;
}

function moveFiles(files) {
  let moved = 0;
  for (const file of files) {
    const dest = path.join(STAGING, path.relative(ROOT, file));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(file, dest);
    moved++;
    console.log(`Moved: ${file} -> ${dest}`);
  }
  return moved;
}

function main() {
  console.log('Scanning for Storybook and keyword-matching files...');
  const foundFiles = scanDir(ROOT);
  if (foundFiles.length === 0) {
    console.log('No matching files found.');
    return;
  }
  const moved = moveFiles(foundFiles);
  console.log(`\nMoved ${moved} files/folders to import-staging.`);
}

main();

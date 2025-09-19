// scripts/cleanup_special_keywords.js
// Scans for files/folders matching special keywords and moves them to import-staging, printing a summary.
// Usage: node scripts/cleanup_special_keywords.js

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STAGING = path.resolve(ROOT, 'import-staging');
const EXCLUDE_DIRS = ['node_modules', '.git', 'import-staging', 'dist', 'build'];
const SPECIAL_KEYWORDS = [
  'powershell', 'pushable agent button', 'pushable agent action', 'command center', 'floating', 'agent action'
];

function matchesSpecialKeyword(name) {
  return SPECIAL_KEYWORDS.some((kw) => name.toLowerCase().includes(kw.toLowerCase()));
}

function scanDir(dir, found = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDE_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (matchesSpecialKeyword(entry.name)) {
        found.push(fullPath);
        continue;
      }
      scanDir(fullPath, found);
    } else {
      if (matchesSpecialKeyword(entry.name)) {
        found.push(fullPath);
      } else {
        // Also search file contents for keywords
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (matchesSpecialKeyword(content)) {
            found.push(fullPath);
          }
        } catch (e) {}
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
  console.log('Scanning for special keyword files...');
  const foundFiles = scanDir(ROOT);
  if (foundFiles.length === 0) {
    console.log('No matching files found.');
    return;
  }
  const moved = moveFiles(foundFiles);
  console.log(`\nMoved ${moved} files/folders to import-staging.`);
}

main();

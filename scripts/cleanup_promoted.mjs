#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'docs', 'generated', 'promotion-exec-report.json');

if(!fs.existsSync(REPORT)){
  console.error('No promotion exec report found at', REPORT);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(REPORT,'utf8'));
const items = Array.isArray(data.results)
  ? data.results.filter(r => r && r.status === 'copied').map(r => r.item)
  : [];
if(!items.length){
  console.log('No copied items to remove.');
  process.exit(0);
}

// Helpers
const isGitRepo = () => {
  try { execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' }); return true; } catch { return false; }
};
const isTracked = (relPath) => {
  try { execSync(`git ls-files --error-unmatch -- "${relPath.replace(/"/g,'\\"')}"`, { stdio: 'ignore' }); return true; } catch { return false; }
};

for (const rel of items) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.log('Already absent, skip', rel);
    continue;
  }
  console.log('Removing', rel);
  let removed = false;
  if (isGitRepo() && isTracked(rel)) {
    try {
      execSync(`git rm -f -- "${rel.replace(/"/g,'\\"')}"`, { stdio: 'inherit' });
      removed = true;
    } catch (e) {
      // fall through to fs removal
    }
  }
  if (!removed) {
    try {
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) fs.rmSync(abs, { recursive: true, force: true });
      else fs.rmSync(abs, { force: true });
      removed = true;
    } catch (e) {
      console.error('Failed to remove', rel, e?.message || e);
      process.exitCode = 1;
    }
  }
}
console.log('Cleanup complete.');

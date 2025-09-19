#!/usr/bin/env node
/**
 * Staging Inventory Script (Phase 0)
 * ----------------------------------
 * Scans `import-staging/` and produces a JSON + Markdown summary:
 *  - Directory tree (depth-limited)
 *  - File type counts (ts, tsx, js, svg, png, md, other)
 *  - Detected legacy magenta color references (#FF00FF / #FF2DA8 / #FF00F5 / #ff00c8)
 *  - Potential PROMOTE candidates (heuristic: files in known target folders: pathways, command-center, wizard, oai)
 *  - TODO: integrate classification from `docs/import-staging-audit.md`
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const STAGING = path.join(ROOT, 'import-staging');
const OUT_DIR = path.join(ROOT, 'docs', 'generated');
const MAGENTA_REGEX = /#(?:(?:FF00FF)|(?:FF2DA8)|(?:FF00F5)|(?:ff00c8))/gi;
const PROMOTE_HINTS = ['wizard', 'command-center', 'pathways', 'oai'];

function walk(dir, depth = 0, maxDepth = 4, acc = []) {
  if (depth > maxDepth) return acc;
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(STAGING, full).replace(/\\/g, '/');
    if (e.isDirectory()) {
      acc.push({ type: 'dir', path: rel });
      walk(full, depth + 1, maxDepth, acc);
    } else {
      acc.push({ type: 'file', path: rel });
    }
  }
  return acc;
}

function classifyFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) return 'code';
  if (ext === '.svg') return 'svg';
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) return 'image';
  if (ext === '.md') return 'doc';
  if (ext === '.json') return 'data';
  return 'other';
}

function detectMagenta(fullPath) {
  try {
    const txt = fs.readFileSync(fullPath, 'utf8');
    return MAGENTA_REGEX.test(txt) ? true : false;
  } catch { return false; }
}

function main() {
  if (!fs.existsSync(STAGING)) {
    console.error('No import-staging directory found.');
    process.exit(1);
  }
  const entries = walk(STAGING);
  const previousPath = path.join(OUT_DIR, 'staging-inventory.json');
  let previous = null;
  if(fs.existsSync(previousPath)){
    try { previous = JSON.parse(fs.readFileSync(previousPath,'utf8')); } catch { previous = null; }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    root: 'import-staging/',
    counts: { code: 0, svg: 0, image: 0, doc: 0, data: 0, other: 0 },
    magentaHits: [],
    promoteHints: [],
    tree: [],
    diff: { newFiles: [], removedFiles: [] }
  };

  for (const item of entries) {
    summary.tree.push(item);
    if (item.type === 'file') {
      const cls = classifyFile(item.path);
      summary.counts[cls]++;
      if (cls === 'code' || cls === 'doc' || cls === 'svg') {
        const full = path.join(STAGING, item.path);
        if (detectMagenta(full)) summary.magentaHits.push(item.path);
      }
      if (PROMOTE_HINTS.some(h => item.path.toLowerCase().includes(h))) {
        summary.promoteHints.push(item.path);
      }
    }
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const jsonPath = path.join(OUT_DIR, 'staging-inventory.json');
  // Compute diff versus previous (files only)
  if(previous && Array.isArray(previous.tree)){
    const prevFiles = new Set(previous.tree.filter(e=>e.type==='file').map(e=>e.path));
    const currFiles = new Set(summary.tree.filter(e=>e.type==='file').map(e=>e.path));
    for(const f of currFiles){ if(!prevFiles.has(f)) summary.diff.newFiles.push(f); }
    for(const f of prevFiles){ if(!currFiles.has(f)) summary.diff.removedFiles.push(f); }
  }

  summary.diff.newCount = summary.diff.newFiles.length;
  summary.diff.removedCount = summary.diff.removedFiles.length;

  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));

  const mdLines = [];
  mdLines.push('# Staging Inventory Report');
  mdLines.push('');
  mdLines.push('## Diff Since Previous Run');
  mdLines.push('');
  if(previous){
    mdLines.push(`New files: ${summary.diff.newCount}`);
    if(summary.diff.newFiles.length) summary.diff.newFiles.slice(0,50).forEach(p=> mdLines.push(`- + ${p}`));
    mdLines.push('');
    mdLines.push(`Removed files: ${summary.diff.removedCount}`);
    if(summary.diff.removedFiles.length) summary.diff.removedFiles.slice(0,50).forEach(p=> mdLines.push(`- - ${p}`));
  } else {
    mdLines.push('_No previous snapshot (baseline)_');
  }
  mdLines.push('');
  mdLines.push(`Generated: ${summary.generatedAt}`);
  mdLines.push('');
  mdLines.push('## File Type Counts');
  mdLines.push('');
  Object.entries(summary.counts).forEach(([k,v])=> mdLines.push(`- ${k}: ${v}`));
  mdLines.push('');
  mdLines.push('## Potential Promote Hints');
  mdLines.push('');
  if (summary.promoteHints.length) summary.promoteHints.slice(0,50).forEach(p=> mdLines.push(`- ${p}`)); else mdLines.push('_None detected_');
  mdLines.push('');
  mdLines.push('## Magenta References (to purge)');
  mdLines.push('');
  if (summary.magentaHits.length) summary.magentaHits.slice(0,100).forEach(p=> mdLines.push(`- ${p}`)); else mdLines.push('_None_');
  mdLines.push('');
  mdLines.push('> Full JSON: `docs/generated/staging-inventory.json`');
  mdLines.push('');
  fs.writeFileSync(path.join(OUT_DIR, 'staging-inventory.md'), mdLines.join('\n'));

  console.log('Staging inventory written to:', jsonPath);
}

main();
#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { optimize } from 'svgo';

const ROOT = path.resolve(process.cwd(), 'assets');
const REPORT = path.resolve(process.cwd(), 'docs', 'generated', 'svg-normalize-report.json');

const SVGO_CONFIG = {
  multipass: true,
  plugins: [
    'removeDimensions',
    'removeScriptElement',
    'removeStyleElement',
    { name: 'removeAttrs', params: { attrs: '(stroke-linecap|stroke-linejoin)' } },
    {
      name: 'addAttributesToSVGElement',
      params: { attributes: [{ focusable: 'false' }] }
    }
  ]
};

async function collect(dir, acc = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await collect(full, acc);
    else if (e.name.toLowerCase().endsWith('.svg')) acc.push(full);
  }
  return acc;
}

function isReference(file) {
  return file.includes(path.sep + 'vendor' + path.sep);
}

async function processFile(file) {
  const original = await fs.readFile(file, 'utf8');
  const optimized = optimize(original, SVGO_CONFIG);
  let content = optimized.data;
  // Replace static fills with currentColor (skip vendor reference)
  if (!isReference(file)) {
    content = content.replace(/fill="(?!none)([^"]+)"/g, 'fill="currentColor"');
  }
  if (original !== content) {
    await fs.writeFile(file, content, 'utf8');
    return { file, changed: true, bytes: { before: original.length, after: content.length } };
  }
  return { file, changed: false, bytes: { before: original.length, after: original.length } };
}

async function main() {
  const files = await collect(ROOT);
  const results = [];
  for (const f of files) {
    results.push(await processFile(f));
  }
  const summary = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    changed: results.filter(r => r.changed).length,
    bytesSaved: results.reduce((s, r) => s + (r.bytes.before - r.bytes.after), 0)
  };
  await fs.mkdir(path.dirname(REPORT), { recursive: true });
  await fs.writeFile(REPORT, JSON.stringify({ summary, results }, null, 2));
  console.log(`SVG normalize complete: ${summary.changed}/${summary.total} modified, ${summary.bytesSaved} bytes saved.`);
}

main().catch(err => { console.error(err); process.exit(1); });

#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'assets');
const OUTPUT = path.resolve(process.cwd(), 'docs', 'generated', 'svg-inventory.json');

async function walk(dir, acc = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full, acc);
    } else if (e.name.toLowerCase().endsWith('.svg')) {
      const rel = path.relative(ROOT, full).replace(/\\/g, '/');
      const domain = inferDomain(rel);
      const status = inferStatus(rel);
      acc.push({ file: rel, domain, status });
    }
  }
  return acc;
}

function inferDomain(rel) {
  if (rel.startsWith('brand/')) return 'brand';
  if (rel.includes('icon')) return 'ui-icon';
  return 'uncategorized';
}

function inferStatus(rel) {
  if (rel.startsWith('vendor/')) return 'ref';
  return 'core';
}

async function main() {
  const list = await walk(ROOT);
  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, JSON.stringify({ generatedAt: new Date().toISOString(), count: list.length, items: list }, null, 2));
  console.log(`SVG inventory written: ${OUTPUT} (${list.length} items)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'assets');
const OUT_DIR = path.resolve(process.cwd(), 'docs', 'generated');
const OUT_FILE = path.join(OUT_DIR, 'svg-inventory.json');

async function walk(dir, acc=[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(()=>[]);
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if (/\.svg$/i.test(e.name)) {
      const rel = path.relative(ROOT, full).replace(/\\/g,'/');
      acc.push({ file: rel });
    }
  }
  return acc;
}

async function main(){
  const list = await walk(ROOT);
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), count: list.length, items: list }, null, 2));
  console.log(`Inventory: ${list.length} svg(s)`);
}
main().catch(e=>{console.error(e);process.exit(1);});

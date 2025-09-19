#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { optimize } from 'svgo';

const ROOT = path.resolve(process.cwd(), 'assets');
const REPORT_DIR = path.resolve(process.cwd(), 'docs', 'generated');
const REPORT_FILE = path.join(REPORT_DIR, 'svg-normalize-report.json');

const SVGO_CONFIG = {
  multipass: true,
  plugins: [
    'removeDimensions',
    'removeScriptElement',
    'removeStyleElement',
    { name: 'removeAttrs', params: { attrs: '(stroke-linecap|stroke-linejoin)' } },
  ]
};

async function gather(dir, acc=[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(()=>[]);
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await gather(full, acc);
    else if (/\.svg$/i.test(e.name)) acc.push(full);
  }
  return acc;
}

async function processFile(f){
  const before = await fs.readFile(f,'utf8');
  const result = optimize(before, SVGO_CONFIG);
  let content = result.data;
  content = content.replace(/fill="(?!none)([^"]+)"/g, 'fill="currentColor"');
  if (content !== before){
    await fs.writeFile(f, content, 'utf8');
    return { file: f, changed: true, bytes: { before: before.length, after: content.length } };
  }
  return { file: f, changed: false, bytes: { before: before.length, after: before.length } };
}

async function main(){
  const files = await gather(ROOT);
  const results = [];
  for (const f of files) results.push(await processFile(f));
  const summary = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    changed: results.filter(r=>r.changed).length,
    bytesSaved: results.reduce((a,r)=>a+(r.bytes.before-r.bytes.after),0)
  };
  await fs.mkdir(REPORT_DIR,{recursive:true});
  await fs.writeFile(REPORT_FILE, JSON.stringify({ summary, results }, null, 2));
  console.log(`Normalize: ${summary.changed}/${summary.total} modified, ${summary.bytesSaved} bytes saved`);
}
main().catch(e=>{console.error(e);process.exit(1);});

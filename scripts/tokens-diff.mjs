#!/usr/bin/env node
/**
 * tokens-diff.mjs
 * Lightweight token snapshot + diff utility.
 * Strategy: scan styles/ (and packages for future) for CSS custom properties `--varName: value;`
 * Persist snapshot at docs/generated/tokens-snapshot.json.
 * On subsequent runs, diff additions, removals, value changes.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SNAP_PATH = path.join(ROOT,'docs','generated','tokens-snapshot.json');
const SCAN_DIRS = [path.join(ROOT,'styles'), path.join(ROOT,'packages')];

function walk(dir, acc=[]) {
  let entries=[]; try { entries = fs.readdirSync(dir,{withFileTypes:true}); } catch { return acc; }
  for(const e of entries){
    const full = path.join(dir,e.name);
    if(e.isDirectory()) walk(full,acc); else acc.push(full);
  }
  return acc;
}

function extractTokensFromFile(file){
  if(!/\.(css|ts|tsx|js)$/i.test(file)) return [];
  const text = fs.readFileSync(file,'utf8');
  const matches = [...text.matchAll(/--([a-z0-9-_]+)\s*:\s*([^;]+);/gi)];
  return matches.map(m=>({ name: m[1], value: m[2].trim(), file: path.relative(ROOT,file) }));
}

function currentTokens(){
  const map = new Map();
  for(const dir of SCAN_DIRS){
    const files = walk(dir);
    for(const f of files){
      extractTokensFromFile(f).forEach(t=>{
        // last one wins (later file override) but record first definition file if new
        if(!map.has(t.name)) map.set(t.name,{value:t.value,file:t.file});
      });
    }
  }
  return Object.fromEntries([...map.entries()].sort((a,b)=> a[0].localeCompare(b[0])));
}

function writeSnapshot(data){
  const dir = path.dirname(SNAP_PATH);
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(SNAP_PATH, JSON.stringify({ generated: new Date().toISOString(), tokens: data }, null, 2));
}

const current = currentTokens();
if(!fs.existsSync(SNAP_PATH)){
  writeSnapshot(current);
  console.log('Created initial token snapshot at', path.relative(ROOT,SNAP_PATH));
  process.exit(0);
}

const prev = JSON.parse(fs.readFileSync(SNAP_PATH,'utf8'));
const prevTokens = prev.tokens || {};

const added = [];
const removed = [];
const changed = [];

for(const name of Object.keys(current)){
  if(!(name in prevTokens)) added.push({name, value: current[name].value});
  else if(prevTokens[name].value !== current[name].value) changed.push({name, from: prevTokens[name].value, to: current[name].value});
}
for(const name of Object.keys(prevTokens)){
  if(!(name in current)) removed.push({name, value: prevTokens[name].value});
}

if(!added.length && !removed.length && !changed.length){
  console.log('No token changes detected.');
  process.exit(0);
}

console.log('Token changes detected:');
if(added.length){
  console.log('\nAdded:');
  added.forEach(a=> console.log(`  + ${a.name} = ${a.value}`));
}
if(removed.length){
  console.log('\nRemoved:');
  removed.forEach(r=> console.log(`  - ${r.name}`));
}
if(changed.length){
  console.log('\nChanged:');
  changed.forEach(c=> console.log(`  ~ ${c.name}: ${c.from} -> ${c.to}`));
}

// Update snapshot after reporting so CI diff is still visible in logs
writeSnapshot(current);
console.log('\nSnapshot updated.');
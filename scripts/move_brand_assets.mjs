#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC_STATIC = path.join(ROOT, 'import-staging', 'brand', 'static');
const SRC_MOTION = path.join(ROOT, 'import-staging', 'brand', 'motion');
const DEST_STATIC = path.join(ROOT, 'assets', 'brand');
const DEST_MOTION = path.join(ROOT, 'public', 'motion');

function ensureDir(p){ fs.mkdirSync(p,{ recursive: true }); }

function moveAll(srcDir, destDir, exts){
  if(!fs.existsSync(srcDir)) return [];
  ensureDir(destDir);
  const moved = [];
  for(const name of fs.readdirSync(srcDir)){
    const ext = path.extname(name).toLowerCase();
    if(exts.length && !exts.includes(ext)) continue;
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    fs.copyFileSync(from, to);
    moved.push({ from: path.relative(ROOT, from), to: path.relative(ROOT, to) });
  }
  return moved;
}

const movedStatic = moveAll(SRC_STATIC, DEST_STATIC, ['.svg']);
const movedMotion = moveAll(SRC_MOTION, DEST_MOTION, ['.json', '.mp4']);

console.log(JSON.stringify({ movedStatic, movedMotion }, null, 2));

#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ICON_DIR = path.join(process.cwd(), 'components', 'icons');
const OUT_FILE = path.join(process.cwd(), 'docs', 'assets', 'ICON_CHECKLIST.md');

function main(){
  if(!fs.existsSync(ICON_DIR)){
    console.error('No icons directory found:', ICON_DIR);
  }
  const files = fs.existsSync(ICON_DIR) ? fs.readdirSync(ICON_DIR).filter(f=>f.endsWith('.tsx')) : [];
  const rows = files.map(f=>{
    const name = f.replace(/\.tsx$/, '');
    const full = path.join(ICON_DIR, f);
    let hash = '—';
    try {
      const data = fs.readFileSync(full,'utf8');
      hash = crypto.createHash('md5').update(data).digest('hex').slice(0,8);
    } catch {}
    // Usage count placeholder (future: grep usage across codebase)
    const usage = 0;
    return `| ${name} | ${f} | currentColor | size prop | ${hash} | ${usage} |`;
  });
  const md = [
    '# Icon Checklist',
    '',
    'Auto-generated. Do not edit manually. Run `npm run svg:checklist`.',
    '',
    '| Component | File | Color Mode | Sizing | Hash | Usage |',
    '|-----------|------|------------|--------|------|-------|',
    ...(rows.length ? rows : ['| _None_ | | | | | |']),
    '',
    'Legend: currentColor = inherits from text color; size prop = sets width/height; Hash = md5 first 8; Usage = occurrences (pending implementation).'
  ].join('\n');
  fs.writeFileSync(OUT_FILE, md);
  console.log('Icon checklist written to', OUT_FILE);
}

main();
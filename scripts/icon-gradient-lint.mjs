#!/usr/bin/env node
/**
 * Lints icon + svg components for acceptable gradient usage.
 * Rules:
 *  - SVGs/components under components/ and public/icons should not embed hard-coded legacy magenta hexes.
 *  - Gradients must use purple family or currentColor; flags other linearGradient with suspicious stops.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SEARCH_DIRS = [
  path.join(ROOT,'components'),
  path.join(ROOT,'public','icons'),
  path.join(ROOT,'packages')
];

const LEGACY_HEX = /#ff00(ff|f5|c8)|#ff2da8/ig; // common legacy magentas
const GRADIENT_TAG = /<linearGradient[\s\S]*?>([\s\S]*?)<\/linearGradient>/gi;
const STOP_TAG = /<stop[^>]*>/gi;
const STOP_COLOR = /stop-color=("|')(.*?)("|')/i;

const offenders = [];

function walk(dir, acc=[]) {
  let list=[]; try { list = fs.readdirSync(dir,{withFileTypes:true}); } catch { return acc; }
  for(const e of list){
    const full = path.join(dir,e.name);
    if(e.isDirectory()) walk(full,acc); else acc.push(full);
  }
  return acc;
}

function isSvgLike(file){
  return /\.(svg|tsx?)$/i.test(file);
}

for(const dir of SEARCH_DIRS){
  if(!fs.existsSync(dir)) continue;
  const files = walk(dir).filter(isSvgLike);
  for(const file of files){
    const txt = fs.readFileSync(file,'utf8');
    if(LEGACY_HEX.test(txt)) {
      offenders.push({file, reason:'legacy-magenta'});
      LEGACY_HEX.lastIndex=0;
    }
    let m;
    while((m = GRADIENT_TAG.exec(txt))){
      const body = m[1];
      const stops = [...body.matchAll(STOP_TAG)].map(s=> s[0]);
      for(const st of stops){
        const colorMatch = st.match(STOP_COLOR);
        if(colorMatch){
          const c = colorMatch[2].trim().toLowerCase();
          if(c.startsWith('var(')) continue; // token referenced
          if(c === 'currentcolor') continue;
          // allow purple family (#7b00ff .. lighten variants) simple heuristic: starts with #7b00 or #6?0?ff simplified later
          if(/^#7b00ff/.test(c)) continue;
          // else flag
          offenders.push({file, reason:`gradient-stop-color ${c}`});
        }
      }
    }
  }
}

if(offenders.length){
  console.error('Icon gradient lint failed:');
  offenders.forEach(o=> console.error(`  ${o.file} :: ${o.reason}`));
  process.exit(1);
} else {
  console.log('Icon gradient lint passed: no legacy magenta or un-tokenized gradient stops.');
}
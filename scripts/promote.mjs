#!/usr/bin/env node
/**
 * Promotion Script Scaffold
 * Modes:
 *  --plan            (default) produce plan only
 *  --execute phase=1 actually copy PROMOTE Phase 1 targets (dry-run message until implemented)
 *
 * Reads: docs/import-staging-audit.md for table rows.
 * Output: docs/generated/promotion-plan.json (and md)
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const AUDIT = path.join(ROOT, 'docs', 'import-staging-audit.md');
const OUT_DIR = path.join(ROOT, 'docs', 'generated');

const args = process.argv.slice(2);
const isExecute = args.includes('--execute');
const phaseArg = args.find(a=>a.startsWith('phase='));
const phase = phaseArg ? phaseArg.split('=')[1] : '1';

function parseAudit(){
  if(!fs.existsSync(AUDIT)) return [];
  const txt = fs.readFileSync(AUDIT,'utf8');
  const lines = txt.split(/\r?\n/);
  const rows = [];
  let inMatrix = false;
  for(const l of lines){
    if(l.startsWith('| Item')) { inMatrix = true; continue; }
    if(inMatrix){
      if(!l.trim() || l.startsWith('| ---')) continue;
      if(!l.startsWith('|')) { inMatrix = false; continue; }
      const cols = l.split('|').map(c=>c.trim());
      if(cols.length < 5) continue;
      const item = cols[1];
      const classification = cols[2].replace(/\*|`/g,'').trim();
      const destination = cols[3];
      const status = (cols[4] || '').replace(/\*|`/g,'').trim();
      rows.push({ item, classification, destination, status });
    }
  }
  return rows;
}

function parseProposedMap(){
  if(!fs.existsSync(AUDIT)) return [];
  const txt = fs.readFileSync(AUDIT,'utf8');
  const lines = txt.split(/\r?\n/);
  const entries = [];
  let inTable = false;
  for(let i=0;i<lines.length;i++){
    const l = lines[i];
    if(l.trim().startsWith('## Proposed Destination Map')){
      // scan until next header or end
      for(let j=i+1;j<lines.length;j++){
        const line = lines[j];
        if(/^##\s+/.test(line)) break; // next section
        if(line.startsWith('| Source')) { inTable = true; continue; }
        if(inTable){
          if(!line.trim()) continue;
          if(line.startsWith('| ---')) continue;
          if(!line.startsWith('|')) { inTable = false; continue; }
          const cols = line.split('|').map(c=>c.trim());
          if(cols.length < 4) continue;
          let source = cols[1];
          let dest = cols[2];
          // Clean up notes in destination like "(and pages/...)"
          dest = dest.replace(/\(.+?\)/g,'').trim();
          // Normalize trailing slash
          if(dest && !dest.endsWith('/')){
            // if dest points to a file (has extension), keep as-is; else ensure trailing slash
            if(!/\.[a-z0-9]+$/i.test(dest)) dest = dest + '/';
          }
          entries.push({ source, destinationBase: dest });
        }
      }
      break;
    }
  }
  return entries;
}

function walkDir(dir, acc = [], base = dir){
  let ents = [];
  try { ents = fs.readdirSync(dir,{withFileTypes:true}); } catch { return acc; }
  for(const e of ents){
    const full = path.join(dir, e.name);
    if(e.isDirectory()) walkDir(full, acc, base);
    else acc.push({ full, rel: path.relative(base, full).replace(/\\/g,'/') });
  }
  return acc;
}

function buildPlan(rows){
  const promoteRows = rows.filter(r=>['PROMOTE'].includes(r.classification) && String(r.status).toUpperCase() !== 'DONE');
  const mapRows = parseProposedMap();
  const entries = [];
  // From Phase tables (rarely have full paths)
  for(const r of promoteRows){
    if(!r.item) continue;
    // Attempt to resolve within import-staging by searching shallowly (best-effort)
    entries.push({ item: r.item, classification: 'PROMOTE', destination: r.destination });
  }
  // From Proposed Destination Map (authoritative paths)
  for(const m of mapRows){
    if(!m.source) continue;
    const srcRaw = m.source.replace(/`/g,'').trim();
    const hasGlob = srcRaw.endsWith('/*');
    const srcDirRel = path.posix.normalize(srcRaw.replace(/\*$|\*$/g,''));
    const srcAbs = path.join(ROOT, 'import-staging', srcDirRel);
    if(!fs.existsSync(srcAbs)) continue;
    if(hasGlob || fs.existsSync(srcAbs) && fs.statSync(srcAbs).isDirectory()){
      const files = walkDir(srcAbs);
      for(const f of files){
        const destRel = (m.destinationBase || '').replace(/`/g,'');
        if(destRel.includes('*')) continue; // skip wildcard destinations; requires dedicated rule
        const destPath = destRel ? path.posix.join(destRel, f.rel) : path.posix.join(srcDirRel, f.rel);
        if(/debug\.log$/i.test(f.full)) continue; // skip logs
        entries.push({ item: path.posix.join('import-staging', srcDirRel, f.rel), classification:'PROMOTE', destination: destPath });
      }
    } else {
      const destRel = (m.destinationBase || '').replace(/`/g,'');
      const fileName = path.basename(srcAbs);
      let destPath;
      if(!destRel){
        destPath = fileName;
      } else if(/\.[a-z0-9]+$/i.test(destRel)){
        // destination points to a file path with extension
        destPath = destRel;
      } else {
        destPath = path.posix.join(destRel, fileName);
      }
      entries.push({ item: path.posix.join('import-staging', srcDirRel), classification:'PROMOTE', destination: destPath });
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    mode: isExecute ? 'execute' : 'plan',
    phase,
    promoteCount: entries.length,
    entries
  };
}

function writeOutputs(plan){
  if(!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR,{recursive:true});
  const jsonPath = path.join(OUT_DIR,'promotion-plan.json');
  fs.writeFileSync(jsonPath, JSON.stringify(plan,null,2));
  const md = [
    '# Promotion Plan',
    '',
    `Generated: ${plan.generatedAt}`,
    '',
    `Mode: ${plan.mode} | Phase: ${plan.phase}`,
    '',
    `PROMOTE entries: ${plan.promoteCount}`,
    '',
    '| Source | Classification | Destination |',
    '|--------|----------------|-------------|',
    ...plan.entries.map(e=>`| ${e.item} | ${e.classification} | ${e.destination} |`),
    '',
    '> Execution copying not yet implemented (scaffold).' 
  ].join('\n');
  fs.writeFileSync(path.join(OUT_DIR,'promotion-plan.md'), md);
  console.log('Promotion plan written.');
}

function ensureDir(p){ fs.mkdirSync(p,{recursive:true}); }

function copyWithRewrites(srcRel, destRel){
  const srcAbs = path.join(ROOT, srcRel);
  const destAbs = path.join(ROOT, destRel);
  ensureDir(path.dirname(destAbs));
  if(!fs.existsSync(srcAbs)) { console.warn('Missing source (skip):', srcRel); return {status:'missing'}; }
  let content = fs.readFileSync(srcAbs,'utf8');
  // Simple import-staging path rewrite heuristic
  content = content.replace(/from ['"]..\/import-staging\//g, "from '../");
  // Inject TODO marker at top if not present
  if(/\.(ts|tsx|js|jsx)$/.test(srcRel)){
    if(!content.startsWith('// PROMOTED:')){
      content = `// PROMOTED from ${srcRel} on ${new Date().toISOString()}\n// TODO: Review for token + design lint compliance.\n` + content;
    }
  }
  fs.writeFileSync(destAbs, content);
  return {status:'copied'};
}

function execute(plan){
  const report = [];
  console.log('Executing promotion (Phase', plan.phase + ')');
  for(const entry of plan.entries){
    const res = copyWithRewrites(entry.item, entry.destination || entry.item);
    report.push({...entry, ...res});
  }
  const execPath = path.join(OUT_DIR,'promotion-exec-report.json');
  fs.writeFileSync(execPath, JSON.stringify({generatedAt:new Date().toISOString(), phase: plan.phase, results: report}, null,2));
  console.log('Execution report:', execPath);
}

const rows = parseAudit();
const plan = buildPlan(rows);
writeOutputs(plan);
if(isExecute) execute(plan);
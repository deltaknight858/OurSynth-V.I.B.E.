#!/usr/bin/env node
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();
const SRC = process.argv[2];
if (!SRC) {
  console.error('Usage: node scripts/migrate_capsule_suite.mjs <absolute-path-to-capsule-wizard-landing-studio-store-web>');
  process.exit(1);
}
function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }
async function ensureDir(p){ await fsp.mkdir(p, { recursive: true }); }
async function copyDir(src, dest){
  if (!exists(src)) return {copied: false, reason: 'missing'};
  await ensureDir(dest);
  const entries = await fsp.readdir(src, { withFileTypes: true });
  for (const e of entries){
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else await fsp.copyFile(s, d);
  }
  return {copied: true};
}

const plan = [
  // Packages → monorepo packages (kept same names to avoid rename churn)
  { from: ['packages','capsule'], to: ['packages','capsule'], note: 'Will publish as @oursynth/capsule' },
  { from: ['packages','mesh-node'], to: ['packages','mesh-node'], note: 'Mesh node utilities' },
  { from: ['packages','oai'], to: ['packages','oai'], note: 'OAI tools (capsule tools)' },
  // Studio/web components → core library components
  { from: ['apps','studio','components'], to: ['packages','core','src','components','capsules'], note: 'Studio Capsule components into core library' },
  { from: ['apps','web','components','store'], to: ['packages','core','src','components','store'], note: 'Store components into core library' },
  { from: ['apps','web','components','wizard'], to: ['packages','core','src','components','wizard'], note: 'Wizard components into core library' },
  // API deploy route → staged under app migrations (manual conversion to app router later)
  { from: ['apps','deploy','pages','api','deploy'], to: ['apps','assist','app','_migrations','capsule-deploy'], note: 'Stage API route for conversion to app router' },
  // Assets/css → Assist styles
  { from: ['assets','css'], to: ['apps','assist','styles','capsule-suite'], note: 'Landing CSS and related styles' },
  // Docs/guides → docs/capsules
  { from: ['.github','instructions'], to: ['docs','capsules','.github-instructions'], note: 'Historic instructions' },
];

const report = [];
const abs = (...parts) => path.join(...parts);

(async () => {
  for (const item of plan){
    const s = abs(SRC, ...item.from);
    const d = abs(ROOT, ...item.to);
    const res = await copyDir(s, d);
    report.push({ from: path.relative(SRC, s), to: path.relative(ROOT, d), note: item.note, ...res });
  }

  // Copy top-level guides
  const guides = ['BRANDING_GUIDE.md','COPILOT_INSTRUCTIONS.md','COPILOT_LANDING_PAGE_GUIDE.md','GEMINI_INSTRUCTIONS.md','ICON-CHECKLIST.md','README.md','WIZARD_CAPSULE.md'];
  await ensureDir(abs(ROOT,'docs','capsules'));
  for (const g of guides){
    const s = abs(SRC, g);
    const d = abs(ROOT, 'docs', 'capsules', g);
    if (exists(s)) { await fsp.copyFile(s, d); report.push({ from: g, to: path.relative(ROOT, d), copied: true }); }
    else { report.push({ from: g, to: path.relative(ROOT, d), copied: false, reason: 'missing' }); }
  }

  // Copy example html pages to docs examples
  const examples = [
    { src: ['index.html'], out: 'root-index.html' },
    { src: ['pages','index.html'], out: 'pages-index.html' },
  ];
  await ensureDir(abs(ROOT,'docs','capsules','examples'));
  for (const ex of examples){
    const s = abs(SRC, ...ex.src);
    const d = abs(ROOT,'docs','capsules','examples', ex.out);
    if (exists(s)) {
      const st = await fsp.stat(s);
      if (st.isFile()) {
        await fsp.copyFile(s, d);
        report.push({ from: ex.src.join('/'), to: path.relative(ROOT, d), copied: true });
      }
    }
  }

  // Write reports
  await ensureDir(abs(ROOT,'docs','generated'));
  const jsonPath = abs(ROOT,'docs','generated','capsule-suite-migration-report.json');
  const mdPath = abs(ROOT,'docs','generated','capsule-suite-migration-report.md');
  await fsp.writeFile(jsonPath, JSON.stringify({ source: SRC, report }, null, 2));
  await fsp.writeFile(mdPath, `# Capsule Suite Migration Report\n\nSource: ${SRC}\n\n` + report.map(r => `- ${r.copied ? '✓' : '×'} ${r.from} → ${r.to}${r.note ? ' — ' + r.note : ''}${r.reason ? ' ('+r.reason+')' : ''}`).join('\n'));
  console.log('Migration plan executed. Report written to', path.relative(ROOT, jsonPath));
})();

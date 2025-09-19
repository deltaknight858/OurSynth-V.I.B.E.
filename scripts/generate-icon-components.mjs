#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'assets', 'brand');
const OUT_DIR = path.resolve(process.cwd(), 'docs', 'generated', 'icon-components');

function pascalCase(str) {
  return str
    .replace(/(^|[-_\s]+)([a-zA-Z0-9])/g, (_, __, c) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

async function main() {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  const svgFiles = entries.filter(e => e.isFile() && e.name.endsWith('.svg'));
  const exportLines = [];
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const f of svgFiles) {
    const filePath = path.join(ROOT, f.name);
    const raw = await fs.readFile(filePath, 'utf8');
    const name = pascalCase(f.name.replace('.svg', ''));
    const component = `/* Auto-generated from ${f.name} */\nexport const ${name} = ({ size = 24, title = '${name}', ...props }) => {\n  return (\n    ${raw
      .replace('<svg', `<svg role=\"img\" width={size} height={size} aria-label={title}`)
      .replace(/fill=\"(?!none)(.*?)\"/g, 'fill=\"currentColor\"')}\n  );\n};\n`;
    await fs.writeFile(path.join(OUT_DIR, `${name}.js`), component, 'utf8');
    exportLines.push(`export { ${name} } from './${name}.js';`);
  }

  await fs.writeFile(path.join(OUT_DIR, 'index.js'), exportLines.join('\n') + '\n', 'utf8');
  console.log(`Generated ${svgFiles.length} icon component(s) to ${OUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
const REPORT_DIR = path.resolve(process.cwd(), 'docs', 'generated');
const REPORT_FILE = path.join(REPORT_DIR, 'svg-component-report.json');

function pascalCase(name){
  return name.replace(/(^|[-_\s]+)([a-zA-Z0-9])/g, (_, __, c)=>c.toUpperCase()).replace(/[^a-zA-Z0-9]/g,'');
}

async function ensureDir(d){ await fs.mkdir(d,{recursive:true}); }

async function listSvg(dir){
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(()=>[]);
  return entries.filter(e=>e.isFile() && /\.svg$/i.test(e.name)).map(e=>e.name);
}

function toTsx(name, raw){
  // inject props + sizing; strip hard-coded fill
  const cleaned = raw.replace(/fill="(?!none)(.*?)"/g, 'fill="currentColor"');
  return `/** Auto-generated from ${name}. DO NOT EDIT DIRECTLY. */\nimport * as React from 'react';\nexport interface IconProps extends React.SVGProps<SVGSVGElement> { size?: number; title?: string; }\nexport const ${pascalCase(name.replace(/\.svg$/,''))}: React.FC<IconProps> = ({ size = 24, title = '${pascalCase(name.replace(/\.svg$/,''))}', ...props }) => (\n  ${cleaned.replace('<svg', '<svg role="img" width={size} height={size} aria-label={title}')}\n);\n`;
}

async function main(){
  await ensureDir(OUT_DIR);
  await ensureDir(REPORT_DIR);
  const files = await listSvg(SRC_DIR);
  const exports = [];
  const report = [];
  for (const f of files){
    const raw = await fs.readFile(path.join(SRC_DIR,f),'utf8');
    const tsx = toTsx(f, raw);
    const base = pascalCase(f.replace(/\.svg$/,''));
    const outPath = path.join(OUT_DIR, base + '.tsx');
    await fs.writeFile(outPath, tsx, 'utf8');
    exports.push(`export { ${base} } from './${base}';`);
    report.push({ file: f, component: base });
  }
  await fs.writeFile(path.join(OUT_DIR,'index.ts'), exports.join('\n') + '\n', 'utf8');
  await fs.writeFile(REPORT_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), count: report.length, items: report }, null, 2));
  console.log(`Generated ${report.length} TSX icon component(s)`);
}

main().catch(e=>{console.error(e);process.exit(1);});

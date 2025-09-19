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

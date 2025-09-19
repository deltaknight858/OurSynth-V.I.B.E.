#!/usr/bin/env node
/**
 * build_tokens.mjs
 * Token registry builder - generates token output file for CI monitoring.
 * Strategy: scan styles/ and packages/ for CSS custom properties and build a registry.
 * Output at docs/generated/tokens-build.json for CI diff monitoring.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, 'docs', 'generated', 'tokens-build.json');
const SCAN_DIRS = [path.join(ROOT, 'styles'), path.join(ROOT, 'packages')];

function walk(dir, acc = []) {
  let entries = []; 
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc); 
    else acc.push(full);
  }
  return acc;
}

function extractTokensFromFile(file) {
  if (!/\.(css|ts|tsx|js)$/i.test(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  const matches = [...text.matchAll(/--([a-z0-9-_]+)\s*:\s*([^;]+);/gi)];
  return matches.map(m => ({ 
    name: m[1], 
    value: m[2].trim(), 
    file: path.relative(ROOT, file),
    category: categorizeToken(m[1])
  }));
}

function categorizeToken(name) {
  if (name.includes('color') || name.includes('neon') || name.includes('purple') || name.includes('magenta')) return 'color';
  if (name.includes('size') || name.includes('width') || name.includes('height') || name.includes('space')) return 'sizing';
  if (name.includes('font') || name.includes('text') || name.includes('weight')) return 'typography';
  if (name.includes('shadow') || name.includes('blur') || name.includes('radius')) return 'effects';
  return 'misc';
}

function buildTokenRegistry() {
  const registry = {
    generated: new Date().toISOString(),
    meta: {
      totalTokens: 0,
      categories: {},
      files: new Set()
    },
    tokens: {}
  };

  for (const dir of SCAN_DIRS) {
    const files = walk(dir);
    for (const f of files) {
      const tokens = extractTokensFromFile(f);
      for (const token of tokens) {
        registry.tokens[token.name] = {
          value: token.value,
          file: token.file,
          category: token.category
        };
        registry.meta.files.add(token.file);
        registry.meta.categories[token.category] = (registry.meta.categories[token.category] || 0) + 1;
      }
    }
  }

  registry.meta.totalTokens = Object.keys(registry.tokens).length;
  registry.meta.files = [...registry.meta.files].sort();
  
  return registry;
}

function writeTokenBuild(data) {
  const dir = path.dirname(OUTPUT_PATH);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
}

const registry = buildTokenRegistry();
writeTokenBuild(registry);

console.log(`Built token registry with ${registry.meta.totalTokens} tokens from ${registry.meta.files.length} files`);
console.log('Categories:', Object.entries(registry.meta.categories).map(([k, v]) => `${k}: ${v}`).join(', '));
console.log(`Token build written to ${path.relative(ROOT, OUTPUT_PATH)}`);
const TOKENS_SRC = path.join(ROOT, 'tokens', 'tokens.json');
const OUT_CSS = path.join(ROOT, 'packages', 'core', 'dist', 'tokens.css');

function ensureDir(p){ fs.mkdirSync(path.dirname(p), { recursive: true }); }

function toCssVars(obj, prefix = ':root'){
  const lines = [];
  lines.push(`${prefix} {`);
  for(const [k,v] of Object.entries(obj)){
    if (v && typeof v === 'object') continue; // flat only for now
    lines.push(`  --${k}: ${v};`);
  }
  lines.push('}');
  return lines.join('\n');
}

if(!fs.existsSync(TOKENS_SRC)){
  console.warn('No tokens.json found at tokens/tokens.json; skipping token build.');
  process.exit(0);
}

const tokens = JSON.parse(fs.readFileSync(TOKENS_SRC,'utf8'));
const css = toCssVars(tokens);
ensureDir(OUT_CSS);
fs.writeFileSync(OUT_CSS, css);
console.log('Wrote CSS tokens ->', path.relative(ROOT, OUT_CSS));

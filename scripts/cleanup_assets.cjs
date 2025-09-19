// scripts/cleanup_assets.cjs
// Scans for asset/icon/media files and moves them to import-staging/assets, printing a summary.
// Usage: node scripts/cleanup_assets.cjs

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STAGING = path.resolve(ROOT, 'import-staging', 'assets');
const EXCLUDE_DIRS = ['node_modules', '.git', 'import-staging', 'dist', 'build'];
const ASSET_EXTS = [
  '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.icns', '.bmp', '.tiff', '.apng', '.avif', '.heic', '.heif',
  '.ttf', '.woff', '.woff2', '.eot', '.otf',
  '.mp3', '.wav', '.flac', '.ogg', '.aac', '.m4a',
  '.mp4', '.webm', '.mov', '.avi', '.wmv', '.flv', '.mkv',
  '.json', '.pdf', '.zip', '.tar', '.gz', '.csv', '.xlsx', '.pptx', '.docx',
  '.ai', '.psd', '.sketch', '.fig', '.xd', '.blend', '.glb', '.gltf', '.obj', '.fbx', '.3ds', '.dae', '.stl', '.step', '.iges', '.svgz'
];

function isAssetFile(filename) {
  return ASSET_EXTS.some((ext) => filename.toLowerCase().endsWith(ext));
}

function scanDir(dir, found = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDE_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, found);
    } else {
      if (isAssetFile(entry.name)) {
        found.push(fullPath);
      }
    }
  }
  return found;
}

function moveFiles(files) {
  let moved = 0;
  for (const file of files) {
    const dest = path.join(STAGING, path.relative(ROOT, file));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(file, dest);
    moved++;
    console.log(`Moved: ${file} -> ${dest}`);
  }
  return moved;
}

function main() {
  console.log('Scanning for asset/icon/media files...');
  const assetFiles = scanDir(ROOT);
  if (assetFiles.length === 0) {
    console.log('No asset files found.');
    return;
  }
  const moved = moveFiles(assetFiles);
  console.log(`\nMoved ${moved} asset files to import-staging/assets.`);
}

main();

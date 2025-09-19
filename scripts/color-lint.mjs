import fs from "fs/promises";
import path from "path";

const LEGACY_COLORS = ["#FF00F5", "#ff00c8", "#FF00FF", "#FF2DA8"].map(
  (c) => c.toLowerCase()
);

const SCAN_DIRECTORIES = ["components", "pages", "styles", "lib"];
const IGNORE_DIRECTORIES = [
  "node_modules",
  ".next",
  "import-staging",
  "docs",
  "archive",
];
const ALLOWED_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".css", ".scss"];

let errorFound = false;

async function scanFile(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const lines = content.split("\n");

  for (const color of LEGACY_COLORS) {
    if (content.toLowerCase().includes(color)) {
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(color)) {
          console.error(`❌ Legacy color "${color}" found in ${filePath}:${index + 1}`);
          console.error(`   > ${line.trim()}`);
          errorFound = true;
        }
      });
    }
  }
}

async function scanDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRECTORIES.includes(entry.name)) {
        await scanDirectory(fullPath);
      }
    } else if (ALLOWED_EXTENSIONS.includes(path.extname(entry.name))) {
      await scanFile(fullPath);
    }
  }
}

console.log("🎨 Running color linter to detect legacy magenta values...");
Promise.all(SCAN_DIRECTORIES.map(scanDirectory)).then(() => {
  if (errorFound) {
    console.error('\n🚨 Legacy color values detected. Please replace them with the new "Neon Purple" token (`#7B00FF` or CSS variables).');
    process.exit(1);
  } else {
    console.log("✅ No legacy magenta color values found. Great work!");
    process.exit(0);
  }
});
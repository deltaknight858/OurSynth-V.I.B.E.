import fs from "fs";
import path from "path";

const DOCS_DIR = path.resolve(__dirname, "../docs");
const OUTPUT_FILE = path.resolve(__dirname, "../apps/docs/docsIndex.json");

function walkDocs(dir: string, base = ""): Array<{ type: "folder" | "file"; name: string; children?: any[]; path?: string }> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.map((entry): {
    type: "folder" | "file";
    name: string;
    children?: any[];
    path?: string;
  } | null => {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(base, entry.name);

    if (entry.isDirectory()) {
      return {
        type: "folder",
        name: entry.name,
        children: walkDocs(fullPath, relPath),
      };
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      return {
        type: "file",
        name: entry.name.replace(".md", ""),
        path: relPath,
      };
    }
    return null;
  }).filter(Boolean) as Array<{ type: "folder" | "file"; name: string; children?: any[]; path?: string }>;
}

function generateIndex() {
  const index = {
    generatedAt: new Date().toISOString(),
    sections: walkDocs(DOCS_DIR),
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`✅ Docs index generated at ${OUTPUT_FILE}`);
}

generateIndex();

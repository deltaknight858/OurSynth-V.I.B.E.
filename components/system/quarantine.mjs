import fs from "fs/promises";
import path from "path";

const ROOT = process.cwd();
const ARCHIVE_DIR = path.join(ROOT, "archive", "quarantined");
const STAGING_DIR = path.join(ROOT, "import-staging");

async function quarantineAsset(sourcePath) {
  const fullSourcePath = path.join(ROOT, sourcePath);

  if (!sourcePath || !(await fs.stat(fullSourcePath).catch(() => null))) {
    throw new Error(`Source path does not exist: ${fullSourcePath}`);
  }

  // For safety, only allow quarantining from within the project, primarily from staging.
  if (!fullSourcePath.startsWith(STAGING_DIR)) {
     console.warn(`Warning: Quarantining an asset from outside the 'import-staging' directory.`);
  }

  await fs.mkdir(ARCHIVE_DIR, { recursive: true });

  const destinationPath = path.join(ARCHIVE_DIR, path.basename(sourcePath));
  await fs.rename(fullSourcePath, destinationPath);

  // TODO: Update import-staging-audit.md to mark the item as ARCHIVED or DROPPED.

  return { success: true, message: `Successfully quarantined ${sourcePath} to ${destinationPath}` };
}

async function main() {
  const sourceArg = process.argv.find(arg => arg.startsWith('--source='));
  if (!sourceArg) {
    console.error(JSON.stringify({ success: false, message: "Usage: node quarantine.mjs --source=<path>" }));
    process.exit(1);
  }
  const sourcePath = sourceArg.split('=')[1];

  const result = await quarantineAsset(sourcePath);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(err => console.error(JSON.stringify({ success: false, message: err.message })));
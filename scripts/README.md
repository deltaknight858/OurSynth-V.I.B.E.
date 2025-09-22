# Supabase test scripts

`scripts/check-supabase.ts` — TypeScript example that demonstrates how to create a Supabase client using `SUPABASE_URL` and `SUPABASE_ANON_KEY` and run a simple select from `test_table`.

How to run (local):

1. Install dependencies if you haven't already:

```bash
npm install
```

2. Build the project (if using TypeScript build pipeline) or run via ts-node:

```bash
# Using ts-node (install globally or devDependency):
# npx ts-node scripts/check-supabase.ts

# If compiled to JavaScript (example):
# node ./dist/scripts/check-supabase.js
```

Important: Do NOT store real secrets in the repository. Use environment variables or your OS key store.

 # Supabase test scripts

 `scripts/check-supabase.ts` — TypeScript example that demonstrates how to create a Supabase client using `SUPABASE_URL` and `SUPABASE_ANON_KEY` and run a simple select from `test_table`.

 How to run (local):

 1. Install dependencies if you haven't already:

 ```bash
 npm install
 ```

 2. Build the project (if using TypeScript build pipeline) or run via ts-node:

 ```bash
 # Using ts-node (install globally or devDependency):
 # npx ts-node scripts/check-supabase.ts

 # If compiled to JavaScript (example):
 # node ./dist/scripts/check-supabase.js
 ```

 Important: Do NOT store real secrets in the repository. Use environment variables or your OS key store.

 ## Scripts Directory

 This folder contains all build, migration, lint, and asset management scripts for the OurSynth ecosystem.

 ## Structure

 - Each `.mjs`, `.cjs`, or `.js` file is a standalone script for a specific task.
 - The `scripts/` subfolder contains additional scripts for icon generation and SVG inventory.

 ## Key Scripts

 - `build_tokens.mjs`: Compiles design tokens for use in CSS and JS.
 - `promote.mjs`: Promotes staged components/assets to production.
 - `cleanup_assets.cjs`: Cleans up unused or deprecated assets.
 - `generate-icon-checklist.mjs`: Generates a checklist of icon assets.
 - `svg-inventory.mjs`: Creates an inventory of SVG assets.
 - `ci-guard-*.mjs`: CI scripts for enforcing standards and preventing errors.
 - `migrate_capsule_suite.mjs`: Migrates capsule suite assets and code.
 - `tokens-diff.mjs`: Diffs token changes for review.

 ## Usage

 - Run scripts using Node.js: `node scriptname.mjs`
 - For CI scripts, integrate with your CI/CD pipeline as needed.
 - See script comments for specific usage instructions and options.

 ---

 For more details, see the main documentation in `docs/architecture/overview.md` and `docs/SHELL_LAYOUT.md`.
